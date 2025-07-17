
import { Validation } from "../validation/validation";
import { AspekValidation } from "../validation/aspek-validation";
import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import {
    AspekResponse,
    CreateAspekRequest,
    SearchAspekRequest,
    toAspekResponse,
    UpdateAspekRequest
} from "../model/aspek-model";

export class AspekService {

    static async create(request: CreateAspekRequest): Promise<AspekResponse> {
        const createRequest = Validation.validate(AspekValidation.CREATE, request);

        const existingAspek = await prismaClient.aspek.count({
            where: { KodeAspek: createRequest.kodeAspek }
        });
        if (existingAspek > 0) {
            throw new ResponseError(400, "Aspek with this KodeAspek already exists");
        }

        const newAspek = await prismaClient.aspek.create({
            data: {
                KodeAspek: createRequest.kodeAspek,
                Aspek: createRequest.namaAspek,
            },
        });

        return toAspekResponse(newAspek);
    }

    static async get(kodeAspek: string): Promise<AspekResponse> {
        kodeAspek = Validation.validate(AspekValidation.KODE_ASPEK, kodeAspek);

        const aspek = await prismaClient.aspek.findUnique({
            where: { KodeAspek: kodeAspek },
        });

        if (!aspek) {
            throw new ResponseError(404, "Aspek not found");
        }

        return toAspekResponse(aspek);
    }

    static async update(kodeAspek: string, request: UpdateAspekRequest): Promise<AspekResponse> {
        kodeAspek = Validation.validate(AspekValidation.KODE_ASPEK, kodeAspek);
        const updateRequest = Validation.validate(AspekValidation.UPDATE, request);

        const existingAspek = await prismaClient.aspek.findUnique({
            where: { KodeAspek: kodeAspek }
        });

        if (!existingAspek) {
            throw new ResponseError(404, "Aspek not found");
        }

        const updatedAspek = await prismaClient.aspek.update({
            where: { KodeAspek: kodeAspek },
            data: {
                Aspek: updateRequest.namaAspek ?? existingAspek.Aspek,
            }
        });

        return toAspekResponse(updatedAspek);
    }

    static async remove(kodeAspek: string): Promise<void> {
        kodeAspek = Validation.validate(AspekValidation.KODE_ASPEK, kodeAspek);

        const existingAspekCount = await prismaClient.aspek.count({
            where: { KodeAspek: kodeAspek }
        });

        if (existingAspekCount === 0) {
            throw new ResponseError(404, "Aspek not found");
        }

        const cplProdiCount = await prismaClient.cPLProdi.count({
            where: { KodeAspek: kodeAspek }
        });
        if (cplProdiCount > 0) {
            throw new ResponseError(400, "Cannot delete Aspek: still referenced by CPL Prodi");
        }

        await prismaClient.aspek.delete({
            where: { KodeAspek: kodeAspek }
        });
    }

    static async search(request: SearchAspekRequest): Promise<[AspekResponse[], number]> {
        const searchRequest = Validation.validate(AspekValidation.SEARCH, request);

        const skip = (searchRequest.page! - 1) * searchRequest.size!;
        const filters = [];

        if (searchRequest.namaAspek) {
            filters.push({
                Aspek: {
                    contains: searchRequest.namaAspek.toLowerCase()
                }
            });
        }

        const [aspeks, total] = await prismaClient.$transaction([
            prismaClient.aspek.findMany({
                where: { AND: filters },
                take: searchRequest.size,
                skip: skip,
                orderBy: { KodeAspek: 'asc' }
            }),
            prismaClient.aspek.count({ where: { AND: filters } })
        ]);

        const responses = aspeks.map(toAspekResponse);

        return [responses, total];
    }
}