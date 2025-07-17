
import { ReferensiResponse, CreateReferensiRequest, UpdateReferensiRequest, SearchReferensiRequest, toReferensiResponse } from "../model/referensi-model";
import { Validation } from "../validation/validation";
import { ReferensiValidation } from "../validation/referensi-validation";
import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";

export class ReferensiService {

    static async create(request: CreateReferensiRequest): Promise<ReferensiResponse> {
        const createRequest = Validation.validate(ReferensiValidation.CREATE, request);

        const existingReferensi = await prismaClient.referensi.count({
            where: { KodeReferensi: createRequest.kodeReferensi }
        });
        if (existingReferensi > 0) {
            throw new ResponseError(400, "Referensi with this KodeReferensi already exists");
        }

        const newReferensi = await prismaClient.referensi.create({
            data: {
                KodeReferensi: createRequest.kodeReferensi,
                Referensi: createRequest.namaReferensi,
            },
        });

        return toReferensiResponse(newReferensi);
    }

    static async get(kodeReferensi: string): Promise<ReferensiResponse> {
        kodeReferensi = Validation.validate(ReferensiValidation.KODE_REFERENSI, kodeReferensi);

        const referensi = await prismaClient.referensi.findUnique({
            where: { KodeReferensi: kodeReferensi },
        });

        if (!referensi) {
            throw new ResponseError(404, "Referensi not found");
        }

        return toReferensiResponse(referensi);
    }

    static async update(kodeReferensi: string, request: UpdateReferensiRequest): Promise<ReferensiResponse> {
        kodeReferensi = Validation.validate(ReferensiValidation.KODE_REFERENSI, kodeReferensi);
        const updateRequest = Validation.validate(ReferensiValidation.UPDATE, request);

        const existingReferensi = await prismaClient.referensi.findUnique({
            where: { KodeReferensi: kodeReferensi }
        });

        if (!existingReferensi) {
            throw new ResponseError(404, "Referensi not found");
        }

        const updatedReferensi = await prismaClient.referensi.update({
            where: { KodeReferensi: kodeReferensi },
            data: {
                Referensi: updateRequest.namaReferensi ?? existingReferensi.Referensi,
            }
        });

        return toReferensiResponse(updatedReferensi);
    }

    static async remove(kodeReferensi: string): Promise<void> {
        kodeReferensi = Validation.validate(ReferensiValidation.KODE_REFERENSI, kodeReferensi);

        const existingReferensiCount = await prismaClient.referensi.count({
            where: { KodeReferensi: kodeReferensi }
        });

        if (existingReferensiCount === 0) {
            throw new ResponseError(404, "Referensi not found");
        }

        const bahanKajianCount = await prismaClient.bahanKajian.count({
            where: { KodeReferensi: kodeReferensi }
        });
        if (bahanKajianCount > 0) {
            throw new ResponseError(400, "Cannot delete Referensi: still referenced by Bahan Kajian");
        }

        await prismaClient.referensi.delete({
            where: { KodeReferensi: kodeReferensi }
        });
    }

    static async search(request: SearchReferensiRequest): Promise<[ReferensiResponse[], number]> {
        const searchRequest = Validation.validate(ReferensiValidation.SEARCH, request);

        const skip = (searchRequest.page! - 1) * searchRequest.size!;
        const filters = [];

        if (searchRequest.namaReferensi) {
            filters.push({
                Referensi: {
                    contains: searchRequest.namaReferensi,
                    mode: 'insensitive'
                }
            });
        }

        const [referensis, total] = await prismaClient.$transaction([
            prismaClient.referensi.findMany({
                where: { AND: filters },
                take: searchRequest.size,
                skip: skip,
                orderBy: { KodeReferensi: 'asc' }
            }),
            prismaClient.referensi.count({ where: { AND: filters } })
        ]);

        const responses = referensis.map(toReferensiResponse);

        return [responses, total];
    }
}