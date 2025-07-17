
import { CPLPLResponse, CreateCPLPLRequest, DeleteCPLPLRequest, SearchCPLPLRequest, toCPLPLResponse } from "../model/cpl-pl-model";
import { Validation } from "../validation/validation";
import { CPLPLValidation } from "../validation/cpl-pl-validation";
import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";

export class CPLPLService {

    static async create(request: CreateCPLPLRequest): Promise<CPLPLResponse> {
        const createRequest = Validation.validate(CPLPLValidation.LINK_UNLINK, request);

        const cplExists = await prismaClient.cPLProdi.count({ where: { KodeCPL: createRequest.kodeCPL } });
        if (cplExists === 0) {
            throw new ResponseError(404, "CPL Prodi not found");
        }
        const plExists = await prismaClient.profilLulusan.count({ where: { KodePL: createRequest.kodePL } });
        if (plExists === 0) {
            throw new ResponseError(404, "Profil Lulusan not found");
        }

        const existingLink = await prismaClient.cPLPL.count({
            where: {
                KodeCPL: createRequest.kodeCPL,
                KodePL: createRequest.kodePL,
            }
        });
        if (existingLink > 0) {
            throw new ResponseError(400, "CPL-PL link already exists");
        }

        const newLink = await prismaClient.cPLPL.create({
            data: {
                KodeCPL: createRequest.kodeCPL,
                KodePL: createRequest.kodePL,
            },
            include: { cplProdi: true, profilLulusan: true }
        });

        return toCPLPLResponse(newLink);
    }

    static async remove(request: DeleteCPLPLRequest): Promise<void> {
        const deleteRequest = Validation.validate(CPLPLValidation.LINK_UNLINK, request);

        const existingLink = await prismaClient.cPLPL.count({
            where: {
                KodeCPL: deleteRequest.kodeCPL,
                KodePL: deleteRequest.kodePL,
            }
        });
        if (existingLink === 0) {
            throw new ResponseError(404, "CPL-PL link not found");
        }

        await prismaClient.cPLPL.delete({
            where: {
                KodeCPL_KodePL: {
                    KodeCPL: deleteRequest.kodeCPL,
                    KodePL: deleteRequest.kodePL,
                }
            }
        });
    }


    static async search(request: SearchCPLPLRequest): Promise<[CPLPLResponse[], number]> {
        const searchRequest = Validation.validate(CPLPLValidation.SEARCH, request);

        const skip = (searchRequest.page! - 1) * searchRequest.size!;
        const filters = [];

        if (searchRequest.kodeCPL) {
            filters.push({ KodeCPL: searchRequest.kodeCPL });
        }
        if (searchRequest.kodePL) {
            filters.push({ KodePL: searchRequest.kodePL });
        }

        const [cplPlList, total] = await prismaClient.$transaction([
            prismaClient.cPLPL.findMany({
                where: { AND: filters },
                take: searchRequest.size,
                skip: skip,
                include: { cplProdi: true, profilLulusan: true },
                orderBy: { KodeCPL: 'asc' }
            }),
            prismaClient.cPLPL.count({ where: { AND: filters } })
        ]);

        const responses = cplPlList.map(toCPLPLResponse);

        return [responses, total];
    }
}