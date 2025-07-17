
import { MataKuliahResponse, CreateMataKuliahRequest, UpdateMataKuliahRequest, SearchMataKuliahRequest, toMataKuliahResponse } from "../model/mata-kuliah-model";
import { Validation } from "../validation/validation";
import { MataKuliahValidation } from "../validation/mata-kuliah-validation";
import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";

export class MataKuliahService {

    static async create(request: CreateMataKuliahRequest): Promise<MataKuliahResponse> {
        const createRequest = Validation.validate(MataKuliahValidation.CREATE, request);

        const existingMK = await prismaClient.mataKuliah.count({
            where: { IDMK: createRequest.idmk }
        });
        if (existingMK > 0) {
            throw new ResponseError(400, "Mata Kuliah with this IDMK already exists");
        }

        const newMK = await prismaClient.mataKuliah.create({
            data: {
                IDMK: createRequest.idmk,
                NamaMK: createRequest.namaMk,
            },
        });

        return toMataKuliahResponse(newMK);
    }


    static async get(idmk: string): Promise<MataKuliahResponse> {
        idmk = Validation.validate(MataKuliahValidation.IDMK, idmk);

        const mk = await prismaClient.mataKuliah.findUnique({
            where: { IDMK: idmk },
        });

        if (!mk) {
            throw new ResponseError(404, "Mata Kuliah not found");
        }

        return toMataKuliahResponse(mk);
    }

    static async update(idmk: string, request: UpdateMataKuliahRequest): Promise<MataKuliahResponse> {
        idmk = Validation.validate(MataKuliahValidation.IDMK, idmk);
        const updateRequest = Validation.validate(MataKuliahValidation.UPDATE, request);

        const existingMK = await prismaClient.mataKuliah.findUnique({
            where: { IDMK: idmk }
        });

        if (!existingMK) {
            throw new ResponseError(404, "Mata Kuliah not found");
        }

        const updatedMK = await prismaClient.mataKuliah.update({
            where: { IDMK: idmk },
            data: {
                NamaMK: updateRequest.namaMk ?? existingMK.NamaMK,
            }
        });

        return toMataKuliahResponse(updatedMK);
    }

    static async remove(idmk: string): Promise<void> {
        idmk = Validation.validate(MataKuliahValidation.IDMK, idmk);

        const existingMKCount = await prismaClient.mataKuliah.count({
            where: { IDMK: idmk }
        });

        if (existingMKCount === 0) {
            throw new ResponseError(404, "Mata Kuliah not found");
        }

        await prismaClient.mataKuliah.delete({
            where: { IDMK: idmk }
        });
    }

    static async search(request: SearchMataKuliahRequest): Promise<[MataKuliahResponse[], number]> {
        const searchRequest = Validation.validate(MataKuliahValidation.SEARCH, request);

        const page = searchRequest.page ?? 1;
        const size = searchRequest.size ?? 10;
        const skip = (page - 1) * size;

        const filters = [];

        if (searchRequest.namaMk) {
            filters.push({
                NamaMK: {
                    contains: searchRequest.namaMk,
                    mode: 'insensitive',
                }
            });
        }

        const [mataKuliahList, total] = await prismaClient.$transaction([
            prismaClient.mataKuliah.findMany({
                where: { AND: filters },
                take: size,
                skip: skip,
                orderBy: { IDMK: 'asc' },
            }),
            prismaClient.mataKuliah.count({
                where: { AND: filters }
            })
        ]);

        const responses = mataKuliahList.map(toMataKuliahResponse);
        return [responses, total];
    }

}