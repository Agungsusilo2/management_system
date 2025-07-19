import {
    CreateKelompokMKRequest,
    KelompokMKResponse, SearchKelompokMKRequest,
    toKelompokMKResponse,
    UpdateKelompokMKRequest
} from "../model/kelompok-mk-model";
import {Validation} from "../validation/validation";
import {KelompokMKValidation} from "../validation/kelompok-mk-validation";
import {prismaClient} from "../application/database";
import {ResponseError} from "../error/response-error";

export class KelompokMKService {
    static async create(request: CreateKelompokMKRequest): Promise<KelompokMKResponse> {
        const createRequest = Validation.validate(KelompokMKValidation.CREATE, request);

        const existingKelompokMK = await prismaClient.kelompokMK.count({
            where: { nama_kelompok_mk: createRequest.namaKelompokMk }
        });
        if (existingKelompokMK > 0) {
            throw new ResponseError(400, "Kelompok MK with this name already exists");
        }

        const newKelompokMK = await prismaClient.kelompokMK.create({
            data: {
                nama_kelompok_mk: createRequest.namaKelompokMk,
            },
        });

        return toKelompokMKResponse(newKelompokMK);
    }

    static async get(idKelompokMk: string): Promise<KelompokMKResponse> {
        idKelompokMk = Validation.validate(KelompokMKValidation.ID_KELOMPOK_MK, idKelompokMk);

        const kelompokMK = await prismaClient.kelompokMK.findUnique({
            where: { id_kelompok_mk: idKelompokMk },
        });

        if (!kelompokMK) {
            throw new ResponseError(404, "Kelompok MK not found");
        }

        return toKelompokMKResponse(kelompokMK);
    }

    static async update(idKelompokMk: string, request: UpdateKelompokMKRequest): Promise<KelompokMKResponse> {
        idKelompokMk = Validation.validate(KelompokMKValidation.ID_KELOMPOK_MK, idKelompokMk);
        const updateRequest = Validation.validate(KelompokMKValidation.UPDATE, request);

        const existingKelompokMK = await prismaClient.kelompokMK.findUnique({
            where: { id_kelompok_mk: idKelompokMk }
        });

        if (!existingKelompokMK) {
            throw new ResponseError(404, "Kelompok MK not found");
        }

        if (updateRequest.namaKelompokMk && updateRequest.namaKelompokMk !== existingKelompokMK.nama_kelompok_mk) {
            const conflictCount = await prismaClient.kelompokMK.count({
                where: { nama_kelompok_mk: updateRequest.namaKelompokMk }
            });
            if (conflictCount > 0) {
                throw new ResponseError(400, "Another Kelompok MK with this name already exists");
            }
        }

        const updatedKelompokMK = await prismaClient.kelompokMK.update({
            where: { id_kelompok_mk: idKelompokMk },
            data: {
                nama_kelompok_mk: updateRequest.namaKelompokMk ?? existingKelompokMK.nama_kelompok_mk,
            }
        });

        return toKelompokMKResponse(updatedKelompokMK);
    }

    static async remove(idKelompokMk: string): Promise<void> {
        idKelompokMk = Validation.validate(KelompokMKValidation.ID_KELOMPOK_MK, idKelompokMk);

        const existingKelompokMKCount = await prismaClient.kelompokMK.count({
            where: { id_kelompok_mk: idKelompokMk }
        });

        if (existingKelompokMKCount === 0) {
            throw new ResponseError(404, "Kelompok MK not found");
        }

        const mataKuliahCount = await prismaClient.mataKuliah.count({
            where: { kelompokMKId: idKelompokMk } // Perhatikan nama kolom FK di MataKuliah
        });
        if (mataKuliahCount > 0) {
            throw new ResponseError(400, "Cannot delete Kelompok MK: still referenced by Mata Kuliah");
        }

        await prismaClient.kelompokMK.delete({
            where: { id_kelompok_mk: idKelompokMk }
        });
    }

    static async search(request: SearchKelompokMKRequest): Promise<[KelompokMKResponse[], number]> {
        const searchRequest = Validation.validate(KelompokMKValidation.SEARCH, request);

        const skip = (searchRequest.page! - 1) * searchRequest.size!;
        const filters: any[] = [];

        if (searchRequest.namaKelompokMk) {
            filters.push({
                nama_kelompok_mk: {
                    contains: searchRequest.namaKelompokMk,
                    mode: 'insensitive'
                }
            });
        }

        const [kelompokMKs, total] = await prismaClient.$transaction([
            prismaClient.kelompokMK.findMany({
                where: { AND: filters },
                take: searchRequest.size,
                skip: skip,
                orderBy: { nama_kelompok_mk: 'asc' }
            }),
            prismaClient.kelompokMK.count({ where: { AND: filters } })
        ]);

        const responses = kelompokMKs.map(toKelompokMKResponse);

        return [responses, total];
    }
}
