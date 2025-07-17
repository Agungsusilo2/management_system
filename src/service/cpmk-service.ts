
import { CPMKResponse, CreateCPMKRequest, UpdateCPMKRequest, SearchCPMKRequest, toCPMKResponse } from "../model/cpmk-model";
import { Validation } from "../validation/validation";
import { CPMKValidation } from "../validation/cpmk-validation";
import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";

export class CPMKService {

    static async create(request: CreateCPMKRequest): Promise<CPMKResponse> {
        const createRequest = Validation.validate(CPMKValidation.CREATE, request);

        const existingCPMK = await prismaClient.cPMK.count({
            where: { KodeCPMK: createRequest.kodeCPMK }
        });
        if (existingCPMK > 0) {
            throw new ResponseError(400, "CPMK with this KodeCPMK already exists");
        }

        const subCpmkExists = await prismaClient.subCPMK.count({
            where: { SubCPMK: createRequest.subCPMKId }
        });
        if (subCpmkExists === 0) {
            throw new ResponseError(400, "SubCPMK ID not found");
        }


        const newCPMK = await prismaClient.cPMK.create({
            data: {
                KodeCPMK: createRequest.kodeCPMK,
                CPMK: createRequest.namaCPMK,
                SubCPMK: createRequest.subCPMKId,
            },
            include: { subCPMK: true }
        });

        return toCPMKResponse(newCPMK);
    }


    static async get(kodeCPMK: string): Promise<CPMKResponse> {
        kodeCPMK = Validation.validate(CPMKValidation.KODE_CPMK, kodeCPMK);

        const cpmk = await prismaClient.cPMK.findUnique({
            where: { KodeCPMK: kodeCPMK },
            include: { subCPMK: true }
        });

        if (!cpmk) {
            throw new ResponseError(404, "CPMK not found");
        }

        return toCPMKResponse(cpmk);
    }

    static async update(kodeCPMK: string, request: UpdateCPMKRequest): Promise<CPMKResponse> {
        kodeCPMK = Validation.validate(CPMKValidation.KODE_CPMK, kodeCPMK);
        const updateRequest = Validation.validate(CPMKValidation.UPDATE, request);

        const existingCPMK = await prismaClient.cPMK.findUnique({
            where: { KodeCPMK: kodeCPMK }
        });

        if (!existingCPMK) {
            throw new ResponseError(404, "CPMK not found");
        }

        if (updateRequest.subCPMKId) {
            const subCpmkExists = await prismaClient.subCPMK.count({
                where: { SubCPMK: updateRequest.subCPMKId }
            });
            if (subCpmkExists === 0) {
                throw new ResponseError(400, "SubCPMK ID not found");
            }
        }


        const updatedCPMK = await prismaClient.cPMK.update({
            where: { KodeCPMK: kodeCPMK },
            data: {
                CPMK: updateRequest.namaCPMK ?? existingCPMK.CPMK,
                SubCPMK: updateRequest.subCPMKId ?? existingCPMK.SubCPMK,
            },
            include: { subCPMK: true }
        });

        return toCPMKResponse(updatedCPMK);
    }

    static async remove(kodeCPMK: string): Promise<void> {
        kodeCPMK = Validation.validate(CPMKValidation.KODE_CPMK, kodeCPMK);

        const existingCPMKCount = await prismaClient.cPMK.count({
            where: { KodeCPMK: kodeCPMK }
        });

        if (existingCPMKCount === 0) {
            throw new ResponseError(404, "CPMK not found");
        }

        await prismaClient.cPMK.delete({
            where: { KodeCPMK: kodeCPMK }
        });
    }

    static async search(request: SearchCPMKRequest): Promise<[CPMKResponse[], number]> {
        const searchRequest = Validation.validate(CPMKValidation.SEARCH, request);

        const skip = (searchRequest.page! - 1) * searchRequest.size!;
        const filters = [];

        if (searchRequest.namaCPMK) {
            filters.push({
                CPMK: {
                    contains: searchRequest.namaCPMK,
                    mode: 'insensitive'
                }
            });
        }
        if (searchRequest.subCPMKId) {
            filters.push({
                SubCPMK: searchRequest.subCPMKId
            });
        }


        const [cpmkList, total] = await prismaClient.$transaction([
            prismaClient.cPMK.findMany({
                where: { AND: filters },
                take: searchRequest.size,
                skip: skip,
                include: { subCPMK: true },
                orderBy: { KodeCPMK: 'asc' }
            }),
            prismaClient.cPMK.count({ where: { AND: filters } })
        ]);

        const responses = cpmkList.map(toCPMKResponse);

        return [responses, total];
    }
}