
import { CPLMKResponse, CreateCPLMKRequest, DeleteCPLMKRequest, SearchCPLMKRequest, toCPLMKResponse } from "../model/cpl-mk-model";
import { Validation } from "../validation/validation";
import { CPLMKValidation } from "../validation/cpl-mk-validation";
import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";

export class CPLMKService {

    static async create(request: CreateCPLMKRequest): Promise<CPLMKResponse> {
        const createRequest = Validation.validate(CPLMKValidation.LINK_UNLINK, request);

        const cplExists = await prismaClient.cPLProdi.count({ where: { KodeCPL: createRequest.kodeCPL } });
        if (cplExists === 0) {
            throw new ResponseError(404, "CPL Prodi not found");
        }
        const mkExists = await prismaClient.mataKuliah.count({ where: { IDMK: createRequest.idmk } });
        if (mkExists === 0) {
            throw new ResponseError(404, "Mata Kuliah not found");
        }

        const existingLink = await prismaClient.cPLMK.count({
            where: {
                KodeCPL: createRequest.kodeCPL,
                IDMK: createRequest.idmk,
            }
        });
        if (existingLink > 0) {
            throw new ResponseError(400, "CPL-MK link already exists");
        }

        const newLink = await prismaClient.cPLMK.create({
            data: {
                KodeCPL: createRequest.kodeCPL,
                IDMK: createRequest.idmk,
            },
            include: { cplProdi: true, mataKuliah: true } // Sertakan detail relasi untuk response
        });

        return toCPLMKResponse(newLink);
    }

    static async remove(request: DeleteCPLMKRequest): Promise<void> {
        const deleteRequest = Validation.validate(CPLMKValidation.LINK_UNLINK, request);

        const existingLink = await prismaClient.cPLMK.count({
            where: {
                KodeCPL: deleteRequest.kodeCPL,
                IDMK: deleteRequest.idmk,
            }
        });
        if (existingLink === 0) {
            throw new ResponseError(404, "CPL-MK link not found");
        }

        await prismaClient.cPLMK.delete({
            where: {
                KodeCPL_IDMK: {
                    KodeCPL: deleteRequest.kodeCPL,
                    IDMK: deleteRequest.idmk,
                }
            }
        });
    }

    static async search(request: SearchCPLMKRequest): Promise<[CPLMKResponse[], number]> {
        const searchRequest = Validation.validate(CPLMKValidation.SEARCH, request);

        const skip = (searchRequest.page! - 1) * searchRequest.size!;
        const filters = [];

        if (searchRequest.kodeCPL) {
            filters.push({ KodeCPL: searchRequest.kodeCPL });
        }
        if (searchRequest.idmk) {
            filters.push({ IDMK: searchRequest.idmk });
        }

        const [cplMkList, total] = await prismaClient.$transaction([
            prismaClient.cPLMK.findMany({
                where: { AND: filters },
                take: searchRequest.size,
                skip: skip,
                include: { cplProdi: true, mataKuliah: true }, // Sertakan detail relasi
                orderBy: { KodeCPL: 'asc' }
            }),
            prismaClient.cPLMK.count({ where: { AND: filters } })
        ]);

        const responses = cplMkList.map(toCPLMKResponse);

        return [responses, total];
    }
}