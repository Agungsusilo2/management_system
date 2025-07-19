import {
    CreateLingkupKelasRequest,
    LingkupKelasResponse, SearchLingkupKelasRequest,
    toLingkupKelasResponse,
    UpdateLingkupKelasRequest
} from "../model/lingkup-kelas-model";
import {Validation} from "../validation/validation";
import {LingkupKelasValidation} from "../validation/lingkup-kelas-validation";
import {prismaClient} from "../application/database";
import {ResponseError} from "../error/response-error";

export class LingkupKelasService {
    static async create(request: CreateLingkupKelasRequest): Promise<LingkupKelasResponse> {
        const createRequest = Validation.validate(LingkupKelasValidation.CREATE, request);

        const existingLingkupKelas = await prismaClient.lingkupKelas.count({
            where: { nama_lingkup_kelas: createRequest.namaLingkupKelas }
        });
        if (existingLingkupKelas > 0) {
            throw new ResponseError(400, "Lingkup Kelas with this name already exists");
        }

        const newLingkupKelas = await prismaClient.lingkupKelas.create({
            data: {
                nama_lingkup_kelas: createRequest.namaLingkupKelas,
            },
        });

        return toLingkupKelasResponse(newLingkupKelas);
    }

    static async get(idLingkupKelas: string): Promise<LingkupKelasResponse> {
        idLingkupKelas = Validation.validate(LingkupKelasValidation.ID_LINGKUP_KELAS, idLingkupKelas);

        const lingkupKelas = await prismaClient.lingkupKelas.findUnique({
            where: { id_lingkup_kelas: idLingkupKelas },
        });

        if (!lingkupKelas) {
            throw new ResponseError(404, "Lingkup Kelas not found");
        }

        return toLingkupKelasResponse(lingkupKelas);
    }

    static async update(idLingkupKelas: string, request: UpdateLingkupKelasRequest): Promise<LingkupKelasResponse> {
        idLingkupKelas = Validation.validate(LingkupKelasValidation.ID_LINGKUP_KELAS, idLingkupKelas);
        const updateRequest = Validation.validate(LingkupKelasValidation.UPDATE, request);

        const existingLingkupKelas = await prismaClient.lingkupKelas.findUnique({
            where: { id_lingkup_kelas: idLingkupKelas }
        });

        if (!existingLingkupKelas) {
            throw new ResponseError(404, "Lingkup Kelas not found");
        }

        if (updateRequest.namaLingkupKelas && updateRequest.namaLingkupKelas !== existingLingkupKelas.nama_lingkup_kelas) {
            const conflictCount = await prismaClient.lingkupKelas.count({
                where: { nama_lingkup_kelas: updateRequest.namaLingkupKelas }
            });
            if (conflictCount > 0) {
                throw new ResponseError(400, "Another Lingkup Kelas with this name already exists");
            }
        }

        const updatedLingkupKelas = await prismaClient.lingkupKelas.update({
            where: { id_lingkup_kelas: idLingkupKelas },
            data: {
                nama_lingkup_kelas: updateRequest.namaLingkupKelas ?? existingLingkupKelas.nama_lingkup_kelas,
            }
        });

        return toLingkupKelasResponse(updatedLingkupKelas);
    }

    static async remove(idLingkupKelas: string): Promise<void> {
        idLingkupKelas = Validation.validate(LingkupKelasValidation.ID_LINGKUP_KELAS, idLingkupKelas);

        const existingLingkupKelasCount = await prismaClient.lingkupKelas.count({
            where: { id_lingkup_kelas: idLingkupKelas }
        });

        if (existingLingkupKelasCount === 0) {
            throw new ResponseError(404, "Lingkup Kelas not found");
        }

        const mataKuliahCount = await prismaClient.mataKuliah.count({
            where: { lingkupKelasId: idLingkupKelas } // Perhatikan nama kolom FK di MataKuliah
        });
        if (mataKuliahCount > 0) {
            throw new ResponseError(400, "Cannot delete Lingkup Kelas: still referenced by Mata Kuliah");
        }

        await prismaClient.lingkupKelas.delete({
            where: { id_lingkup_kelas: idLingkupKelas }
        });
    }

    static async search(request: SearchLingkupKelasRequest): Promise<[LingkupKelasResponse[], number]> {
        const searchRequest = Validation.validate(LingkupKelasValidation.SEARCH, request);

        const skip = (searchRequest.page! - 1) * searchRequest.size!;
        const filters: any[] = [];

        if (searchRequest.namaLingkupKelas) {
            filters.push({
                nama_lingkup_kelas: {
                    contains: searchRequest.namaLingkupKelas,
                    mode: 'insensitive'
                }
            });
        }

        const [lingkupKelas, total] = await prismaClient.$transaction([
            prismaClient.lingkupKelas.findMany({
                where: { AND: filters },
                take: searchRequest.size,
                skip: skip,
                orderBy: { nama_lingkup_kelas: 'asc' }
            }),
            prismaClient.lingkupKelas.count({ where: { AND: filters } })
        ]);

        const responses = lingkupKelas.map(toLingkupKelasResponse);

        return [responses, total];
    }
}
