
import { BahanKajianResponse, CreateBahanKajianRequest, UpdateBahanKajianRequest, SearchBahanKajianRequest, toBahanKajianResponse } from "../model/bahan-kajian-model";
import { Validation } from "../validation/validation";
import { BahanKajianValidation } from "../validation/bahan-kajian-validation";
import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";

export class BahanKajianService {

    static async create(request: CreateBahanKajianRequest): Promise<BahanKajianResponse> {
        const createRequest = Validation.validate(BahanKajianValidation.CREATE, request);

        const existingBK = await prismaClient.bahanKajian.count({
            where: { KodeBK: createRequest.kodeBK }
        });
        if (existingBK > 0) {
            throw new ResponseError(400, "Bahan Kajian with this KodeBK already exists");
        }

        const referensiExists = await prismaClient.referensi.count({
            where: { KodeReferensi: createRequest.kodeReferensi }
        });
        if (referensiExists === 0) {
            throw new ResponseError(400, "Referensi ID not found");
        }

        const newBK = await prismaClient.bahanKajian.create({
            data: {
                KodeBK: createRequest.kodeBK,
                BahanKajian: createRequest.namaBahanKajian,
                KodeReferensi: createRequest.kodeReferensi,
            },
            include: { referensi: true }
        });

        return toBahanKajianResponse(newBK);
    }

    static async get(kodeBK: string): Promise<BahanKajianResponse> {
        kodeBK = Validation.validate(BahanKajianValidation.KODE_BK, kodeBK);

        const bk = await prismaClient.bahanKajian.findUnique({
            where: { KodeBK: kodeBK },
            include: { referensi: true }
        });

        if (!bk) {
            throw new ResponseError(404, "Bahan Kajian not found");
        }

        return toBahanKajianResponse(bk);
    }

    static async update(kodeBK: string, request: UpdateBahanKajianRequest): Promise<BahanKajianResponse> {
        kodeBK = Validation.validate(BahanKajianValidation.KODE_BK, kodeBK);
        const updateRequest = Validation.validate(BahanKajianValidation.UPDATE, request);

        const existingBK = await prismaClient.bahanKajian.findUnique({
            where: { KodeBK: kodeBK }
        });

        if (!existingBK) {
            throw new ResponseError(404, "Bahan Kajian not found");
        }

        if (updateRequest.kodeReferensi) {
            const referensiExists = await prismaClient.referensi.count({
                where: { KodeReferensi: updateRequest.kodeReferensi }
            });
            if (referensiExists === 0) {
                throw new ResponseError(400, "Referensi ID not found");
            }
        }


        const updatedBK = await prismaClient.bahanKajian.update({
            where: { KodeBK: kodeBK },
            data: {
                BahanKajian: updateRequest.namaBahanKajian ?? existingBK.BahanKajian,
                KodeReferensi: updateRequest.kodeReferensi ?? existingBK.KodeReferensi,
            },
            include: { referensi: true }
        });

        return toBahanKajianResponse(updatedBK);
    }

    static async remove(kodeBK: string): Promise<void> {
        kodeBK = Validation.validate(BahanKajianValidation.KODE_BK, kodeBK);

        const existingBKCount = await prismaClient.bahanKajian.count({
            where: { KodeBK: kodeBK }
        });

        if (existingBKCount === 0) {
            throw new ResponseError(404, "Bahan Kajian not found");
        }

        await prismaClient.bahanKajian.delete({
            where: { KodeBK: kodeBK }
        });
    }

    static async search(request: SearchBahanKajianRequest): Promise<[BahanKajianResponse[], number]> {
        const searchRequest = Validation.validate(BahanKajianValidation.SEARCH, request);

        const page = searchRequest.page ?? 1;
        const size = searchRequest.size ?? 10;
        const skip = (page - 1) * size;

        const filters = [];

        if (searchRequest.namaBahanKajian) {
            filters.push({
                BahanKajian: {
                    contains: searchRequest.namaBahanKajian,
                    mode: 'insensitive'
                }
            });
        }

        if (searchRequest.kodeReferensi) {
            filters.push({
                KodeReferensi: searchRequest.kodeReferensi
            });
        }

        const [bahanKajians, total] = await prismaClient.$transaction([
            prismaClient.bahanKajian.findMany({
                where: { AND: filters },
                take: size,
                skip: skip,
                include: { referensi: true },
                orderBy: { KodeBK: 'asc' }
            }),
            prismaClient.bahanKajian.count({ where: { AND: filters } })
        ]);

        const responses = bahanKajians.map(toBahanKajianResponse);

        return [responses, total];
    }

}