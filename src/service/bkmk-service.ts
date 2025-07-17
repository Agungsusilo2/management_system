
import { BKMKResponse, CreateBKMKRequest, DeleteBKMKRequest, SearchBKMKRequest, toBKMKResponse } from "../model/bkmk-model";
import { Validation } from "../validation/validation";
import { BKMKValidation } from "../validation/bkmk-validation";
import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";

export class BKMKService {

    static async create(request: CreateBKMKRequest): Promise<BKMKResponse> {
        const createRequest = Validation.validate(BKMKValidation.LINK_UNLINK, request);

        const bkExists = await prismaClient.bahanKajian.count({ where: { KodeBK: createRequest.kodeBK } });
        if (bkExists === 0) {
            throw new ResponseError(404, "Bahan Kajian not found");
        }
        const mkExists = await prismaClient.mataKuliah.count({ where: { IDMK: createRequest.idmk } });
        if (mkExists === 0) {
            throw new ResponseError(404, "Mata Kuliah not found");
        }

        const existingLink = await prismaClient.bKMK.count({
            where: {
                KodeBK: createRequest.kodeBK,
                IDMK: createRequest.idmk,
            }
        });
        if (existingLink > 0) {
            throw new ResponseError(400, "BKMK link already exists");
        }

        const newLink = await prismaClient.bKMK.create({
            data: {
                KodeBK: createRequest.kodeBK,
                IDMK: createRequest.idmk,
            },
            include: { bahanKajian: true, mataKuliah: true } // Sertakan detail relasi untuk response
        });

        return toBKMKResponse(newLink);
    }

    static async remove(request: DeleteBKMKRequest): Promise<void> {
        const deleteRequest = Validation.validate(BKMKValidation.LINK_UNLINK, request);

        const existingLink = await prismaClient.bKMK.count({
            where: {
                KodeBK: deleteRequest.kodeBK,
                IDMK: deleteRequest.idmk,
            }
        });
        if (existingLink === 0) {
            throw new ResponseError(404, "BKMK link not found");
        }

        await prismaClient.bKMK.delete({
            where: {
                KodeBK_IDMK: { // Menggunakan nama composite primary key dari Prisma
                    KodeBK: deleteRequest.kodeBK,
                    IDMK: deleteRequest.idmk,
                }
            }
        });
    }

    static async search(request: SearchBKMKRequest): Promise<[BKMKResponse[], number]> {
        const searchRequest = Validation.validate(BKMKValidation.SEARCH, request);

        const skip = (searchRequest.page! - 1) * searchRequest.size!;
        const filters = [];

        if (searchRequest.kodeBK) {
            filters.push({ KodeBK: searchRequest.kodeBK });
        }
        if (searchRequest.idmk) {
            filters.push({ IDMK: searchRequest.idmk });
        }

        const [bkmkList, total] = await prismaClient.$transaction([
            prismaClient.bKMK.findMany({
                where: { AND: filters },
                take: searchRequest.size,
                skip: skip,
                include: { bahanKajian: true, mataKuliah: true }, // Sertakan detail relasi
                orderBy: { KodeBK: 'asc' }
            }),
            prismaClient.bKMK.count({ where: { AND: filters } })
        ]);

        const responses = bkmkList.map(toBKMKResponse);

        return [responses, total];
    }
}