import {Validation} from "../validation/validation";
import {ResponseError} from "../error/response-error";
import {prismaClient} from "../application/database";
import {
    CreateMetodePembelajaranRequest,
    MetodePembelajaranResponse, SearchMetodePembelajaranRequest,
    toMetodePembelajaranResponse, UpdateMetodePembelajaranRequest
} from "../model/metode-pembelajaran-model";
import {MetodePembelajaranValidation} from "../validation/metode-pembelajaran-validation";

export class MetodePembelajaranService {
    static async create(request: CreateMetodePembelajaranRequest): Promise<MetodePembelajaranResponse> {
        const createRequest = Validation.validate(MetodePembelajaranValidation.CREATE, request);

        const existingMetodePembelajaran = await prismaClient.metodePembelajaran.count({
            where: { nama_metode_pembelajaran: createRequest.namaMetodePembelajaran }
        });
        if (existingMetodePembelajaran > 0) {
            throw new ResponseError(400, "Metode Pembelajaran with this name already exists");
        }

        const newMetodePembelajaran = await prismaClient.metodePembelajaran.create({
            data: {
                nama_metode_pembelajaran: createRequest.namaMetodePembelajaran,
            },
        });

        return toMetodePembelajaranResponse(newMetodePembelajaran);
    }

    static async get(idMetodePembelajaran: string): Promise<MetodePembelajaranResponse> {
        idMetodePembelajaran = Validation.validate(MetodePembelajaranValidation.ID_METODE_PEMBELAJARAN, idMetodePembelajaran);

        const metodePembelajaran = await prismaClient.metodePembelajaran.findUnique({
            where: { id_metode_pembelajaran: idMetodePembelajaran },
        });

        if (!metodePembelajaran) {
            throw new ResponseError(404, "Metode Pembelajaran not found");
        }

        return toMetodePembelajaranResponse(metodePembelajaran);
    }

    static async update(idMetodePembelajaran: string, request: UpdateMetodePembelajaranRequest): Promise<MetodePembelajaranResponse> {
        idMetodePembelajaran = Validation.validate(MetodePembelajaranValidation.ID_METODE_PEMBELAJARAN, idMetodePembelajaran);
        const updateRequest = Validation.validate(MetodePembelajaranValidation.UPDATE, request);

        const existingMetodePembelajaran = await prismaClient.metodePembelajaran.findUnique({
            where: { id_metode_pembelajaran: idMetodePembelajaran }
        });

        if (!existingMetodePembelajaran) {
            throw new ResponseError(404, "Metode Pembelajaran not found");
        }

        if (updateRequest.namaMetodePembelajaran && updateRequest.namaMetodePembelajaran !== existingMetodePembelajaran.nama_metode_pembelajaran) {
            const conflictCount = await prismaClient.metodePembelajaran.count({
                where: { nama_metode_pembelajaran: updateRequest.namaMetodePembelajaran }
            });
            if (conflictCount > 0) {
                throw new ResponseError(400, "Another Metode Pembelajaran with this name already exists");
            }
        }

        const updatedMetodePembelajaran = await prismaClient.metodePembelajaran.update({
            where: { id_metode_pembelajaran: idMetodePembelajaran },
            data: {
                nama_metode_pembelajaran: updateRequest.namaMetodePembelajaran ?? existingMetodePembelajaran.nama_metode_pembelajaran,
            }
        });

        return toMetodePembelajaranResponse(updatedMetodePembelajaran);
    }

    static async remove(idMetodePembelajaran: string): Promise<void> {
        idMetodePembelajaran = Validation.validate(MetodePembelajaranValidation.ID_METODE_PEMBELAJARAN, idMetodePembelajaran);

        const existingMetodePembelajaranCount = await prismaClient.metodePembelajaran.count({
            where: { id_metode_pembelajaran: idMetodePembelajaran }
        });

        if (existingMetodePembelajaranCount === 0) {
            throw new ResponseError(404, "Metode Pembelajaran not found");
        }

        const mataKuliahCount = await prismaClient.mataKuliah.count({
            where: { metodePembelajaranId: idMetodePembelajaran } // Perhatikan nama kolom FK di MataKuliah
        });
        if (mataKuliahCount > 0) {
            throw new ResponseError(400, "Cannot delete Metode Pembelajaran: still referenced by Mata Kuliah");
        }

        await prismaClient.metodePembelajaran.delete({
            where: { id_metode_pembelajaran: idMetodePembelajaran }
        });
    }

    static async search(request: SearchMetodePembelajaranRequest): Promise<[MetodePembelajaranResponse[], number]> {
        const searchRequest = Validation.validate(MetodePembelajaranValidation.SEARCH, request);

        const skip = (searchRequest.page! - 1) * searchRequest.size!;
        const filters: any[] = [];

        if (searchRequest.namaMetodePembelajaran) {
            filters.push({
                nama_metode_pembelajaran: {
                    contains: searchRequest.namaMetodePembelajaran,
                    mode: 'insensitive'
                }
            });
        }

        const [metodePembelajarans, total] = await prismaClient.$transaction([
            prismaClient.metodePembelajaran.findMany({
                where: { AND: filters },
                take: searchRequest.size,
                skip: skip,
                orderBy: { nama_metode_pembelajaran: 'asc' }
            }),
            prismaClient.metodePembelajaran.count({ where: { AND: filters } })
        ]);

        const responses = metodePembelajarans.map(toMetodePembelajaranResponse);

        return [responses, total];
    }
}