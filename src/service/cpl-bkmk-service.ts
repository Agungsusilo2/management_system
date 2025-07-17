
import { CPLBKMKResponse, CreateCPLBKMKRequest, DeleteCPLBKMKRequest, SearchCPLBKMKRequest, toCPLBKMKResponse } from "../model/cpl-bkmk-model";
import { Validation } from "../validation/validation";
import { CPLBKMKValidation } from "../validation/cpl-bkmk-validation";
import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";

export class CPLBKMKService {

    static async create(request: CreateCPLBKMKRequest): Promise<CPLBKMKResponse> {
        const createRequest = Validation.validate(CPLBKMKValidation.LINK_UNLINK, request);

        const cplExists = await prismaClient.cPLProdi.count({ where: { KodeCPL: createRequest.kodeCPL } });
        if (cplExists === 0) {
            throw new ResponseError(404, "CPL Prodi not found");
        }
        const bkExists = await prismaClient.bahanKajian.count({ where: { KodeBK: createRequest.kodeBK } });
        if (bkExists === 0) {
            throw new ResponseError(404, "Bahan Kajian not found");
        }
        const mkExists = await prismaClient.mataKuliah.count({ where: { IDMK: createRequest.idmk } });
        if (mkExists === 0) {
            throw new ResponseError(404, "Mata Kuliah not found");
        }

        const existingLink = await prismaClient.cPLBKMK.count({
            where: {
                KodeCPL: createRequest.kodeCPL,
                KodeBK: createRequest.kodeBK,
                IDMK: createRequest.idmk,
            }
        });
        if (existingLink > 0) {
            throw new ResponseError(400, "CPL-BK-MK link already exists");
        }

        const newLink = await prismaClient.cPLBKMK.create({
            data: {
                KodeCPL: createRequest.kodeCPL,
                KodeBK: createRequest.kodeBK,
                IDMK: createRequest.idmk,
            },
            include: { cplProdi: true, bahanKajian: true, mataKuliah: true } // Sertakan detail relasi untuk response
        });

        return toCPLBKMKResponse(newLink);
    }

    static async remove(request: DeleteCPLBKMKRequest): Promise<void> {
        const deleteRequest = Validation.validate(CPLBKMKValidation.LINK_UNLINK, request);

        const existingLink = await prismaClient.cPLBKMK.count({
            where: {
                KodeCPL: deleteRequest.kodeCPL,
                KodeBK: deleteRequest.kodeBK,
                IDMK: deleteRequest.idmk,
            }
        });
        if (existingLink === 0) {
            throw new ResponseError(404, "CPL-BK-MK link not found");
        }

        await prismaClient.cPLBKMK.delete({
            where: {
                KodeCPL_KodeBK_IDMK: {
                    KodeCPL: deleteRequest.kodeCPL,
                    KodeBK: deleteRequest.kodeBK,
                    IDMK: deleteRequest.idmk,
                }
            }
        });
    }

    static async search(request: SearchCPLBKMKRequest): Promise<[CPLBKMKResponse[], number]> {
        const searchRequest = Validation.validate(CPLBKMKValidation.SEARCH, request);

        const skip = (searchRequest.page! - 1) * searchRequest.size!;
        const filters = [];

        if (searchRequest.kodeCPL) {
            filters.push({ KodeCPL: searchRequest.kodeCPL });
        }
        if (searchRequest.kodeBK) {
            filters.push({ KodeBK: searchRequest.kodeBK });
        }
        if (searchRequest.idmk) {
            filters.push({ IDMK: searchRequest.idmk });
        }

        const [cplBkmkList, total] = await prismaClient.$transaction([
            prismaClient.cPLBKMK.findMany({
                where: { AND: filters },
                take: searchRequest.size,
                skip: skip,
                include: { cplProdi: true, bahanKajian: true, mataKuliah: true }, // Sertakan detail relasi
                orderBy: { KodeCPL: 'asc' }
            }),
            prismaClient.cPLBKMK.count({ where: { AND: filters } })
        ]);

        const responses = cplBkmkList.map(toCPLBKMKResponse);

        return [responses, total];
    }
}