
import { CPLBKResponse, CreateCPLBKRequest, DeleteCPLBKRequest, SearchCPLBKRequest, toCPLBKResponse } from "../model/cpl-bk-model";
import { Validation } from "../validation/validation";
import { CPLBKValidation } from "../validation/cpl-bk-validation";
import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";

export class CPLBKService {

    static async create(request: CreateCPLBKRequest): Promise<CPLBKResponse> {
        const createRequest = Validation.validate(CPLBKValidation.LINK_UNLINK, request);

        const cplExists = await prismaClient.cPLProdi.count({ where: { KodeCPL: createRequest.kodeCPL } });
        if (cplExists === 0) {
            throw new ResponseError(404, "CPL Prodi not found");
        }
        const bkExists = await prismaClient.bahanKajian.count({ where: { KodeBK: createRequest.kodeBK } });
        if (bkExists === 0) {
            throw new ResponseError(404, "Bahan Kajian not found");
        }

        const existingLink = await prismaClient.cPLBK.count({
            where: {
                KodeCPL: createRequest.kodeCPL,
                KodeBK: createRequest.kodeBK,
            }
        });
        if (existingLink > 0) {
            throw new ResponseError(400, "CPL-BK link already exists");
        }

        const newLink = await prismaClient.cPLBK.create({
            data: {
                KodeCPL: createRequest.kodeCPL,
                KodeBK: createRequest.kodeBK,
            },
            include: { cplProdi: true, bahanKajian: true } // Sertakan detail relasi untuk response
        });

        return toCPLBKResponse(newLink);
    }

    static async remove(request: DeleteCPLBKRequest): Promise<void> {
        const deleteRequest = Validation.validate(CPLBKValidation.LINK_UNLINK, request);

        const existingLink = await prismaClient.cPLBK.count({
            where: {
                KodeCPL: deleteRequest.kodeCPL,
                KodeBK: deleteRequest.kodeBK,
            }
        });
        if (existingLink === 0) {
            throw new ResponseError(404, "CPL-BK link not found");
        }

        await prismaClient.cPLBK.delete({
            where: {
                KodeCPL_KodeBK: { // Menggunakan nama composite primary key dari Prisma
                    KodeCPL: deleteRequest.kodeCPL,
                    KodeBK: deleteRequest.kodeBK,
                }
            }
        });
    }

    static async search(request: SearchCPLBKRequest): Promise<[CPLBKResponse[], number]> {
        const searchRequest = Validation.validate(CPLBKValidation.SEARCH, request);

        const skip = (searchRequest.page! - 1) * searchRequest.size!;
        const filters = [];

        if (searchRequest.kodeCPL) {
            filters.push({ KodeCPL: searchRequest.kodeCPL });
        }
        if (searchRequest.kodeBK) {
            filters.push({ KodeBK: searchRequest.kodeBK });
        }

        const [cplBkList, total] = await prismaClient.$transaction([
            prismaClient.cPLBK.findMany({
                where: { AND: filters },
                take: searchRequest.size,
                skip: skip,
                include: { cplProdi: true, bahanKajian: true }, // Sertakan detail relasi
                orderBy: { KodeCPL: 'asc' }
            }),
            prismaClient.cPLBK.count({ where: { AND: filters } })
        ]);

        const responses = cplBkList.map(toCPLBKResponse);

        return [responses, total];
    }
}