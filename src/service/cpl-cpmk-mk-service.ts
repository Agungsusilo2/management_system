
import { CPLCPMKMKResponse, CreateCPLCPMKMKRequest, DeleteCPLCPMKMKRequest, SearchCPLCPMKMKRequest, toCPLCPMKMKResponse } from "../model/cpl-cpmk-mk-model";
import { Validation } from "../validation/validation";
import { CPLCPMKMKValidation } from "../validation/cpl-cpmk-mk-validation";
import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";

export class CPLCPMKMKService {

    static async create(request: CreateCPLCPMKMKRequest): Promise<CPLCPMKMKResponse> {
        const createRequest = Validation.validate(CPLCPMKMKValidation.LINK_UNLINK, request);

        const cplExists = await prismaClient.cPLProdi.count({ where: { KodeCPL: createRequest.kodeCPL } });
        if (cplExists === 0) {
            throw new ResponseError(404, "CPL Prodi not found");
        }
        const cpmkExists = await prismaClient.cPMK.count({ where: { KodeCPMK: createRequest.kodeCPMK } });
        if (cpmkExists === 0) {
            throw new ResponseError(404, "CPMK not found");
        }
        const mkExists = await prismaClient.mataKuliah.count({ where: { IDMK: createRequest.idmk } });
        if (mkExists === 0) {
            throw new ResponseError(404, "Mata Kuliah not found");
        }

        const existingLink = await prismaClient.cPLCPMKMK.count({
            where: {
                KodeCPL: createRequest.kodeCPL,
                KodeCPMK: createRequest.kodeCPMK,
                IDMK: createRequest.idmk,
            }
        });
        if (existingLink > 0) {
            throw new ResponseError(400, "CPL-CPMK-MK link already exists");
        }

        const newLink = await prismaClient.cPLCPMKMK.create({
            data: {
                KodeCPL: createRequest.kodeCPL,
                KodeCPMK: createRequest.kodeCPMK,
                IDMK: createRequest.idmk,
            },
            include: { cplProdi: true, cpmk: true, mataKuliah: true } // Sertakan detail relasi untuk response
        });

        return toCPLCPMKMKResponse(newLink);
    }

    static async remove(request: DeleteCPLCPMKMKRequest): Promise<void> {
        const deleteRequest = Validation.validate(CPLCPMKMKValidation.LINK_UNLINK, request);

        const existingLink = await prismaClient.cPLCPMKMK.count({
            where: {
                KodeCPL: deleteRequest.kodeCPL,
                KodeCPMK: deleteRequest.kodeCPMK,
                IDMK: deleteRequest.idmk,
            }
        });
        if (existingLink === 0) {
            throw new ResponseError(404, "CPL-CPMK-MK link not found");
        }

        await prismaClient.cPLCPMKMK.delete({
            where: {
                KodeCPL_KodeCPMK_IDMK: {
                    KodeCPL: deleteRequest.kodeCPL,
                    KodeCPMK: deleteRequest.kodeCPMK,
                    IDMK: deleteRequest.idmk,
                }
            }
        });
    }

    static async search(request: SearchCPLCPMKMKRequest): Promise<[CPLCPMKMKResponse[], number]> {
        const searchRequest = Validation.validate(CPLCPMKMKValidation.SEARCH, request);

        const skip = (searchRequest.page! - 1) * searchRequest.size!;
        const filters = [];

        if (searchRequest.kodeCPL) {
            filters.push({ KodeCPL: searchRequest.kodeCPL });
        }
        if (searchRequest.kodeCPMK) {
            filters.push({ KodeCPMK: searchRequest.kodeCPMK });
        }
        if (searchRequest.idmk) {
            filters.push({ IDMK: searchRequest.idmk });
        }

        const [cplCpmkMkList, total] = await prismaClient.$transaction([
            prismaClient.cPLCPMKMK.findMany({
                where: { AND: filters },
                take: searchRequest.size,
                skip: skip,
                include: { cplProdi: true, cpmk: true, mataKuliah: true }, // Sertakan detail relasi
                orderBy: { KodeCPL: 'asc' }
            }),
            prismaClient.cPLCPMKMK.count({ where: { AND: filters } })
        ]);

        const responses = cplCpmkMkList.map(toCPLCPMKMKResponse);

        return [responses, total];
    }
}