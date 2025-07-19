import {ResponseError} from "../error/response-error";
import {prismaClient} from "../application/database";
import {Validation} from "../validation/validation";
import {JenisMKValidation} from "../validation/jenis-mk-validation";
import {
    CreateJenisMKRequest,
    JenisMKResponse,
    SearchJenisMKRequest,
    toJenisMKResponse,
    UpdateJenisMKRequest
} from "../model/jenis-mk";

export class JenisMKService {
    static async create(request: CreateJenisMKRequest): Promise<JenisMKResponse> {
        const createRequest = Validation.validate(JenisMKValidation.CREATE, request);

        const existingJenisMK = await prismaClient.jenisMK.count({
            where: { nama_jenis_mk: createRequest.namaJenisMk }
        });
        if (existingJenisMK > 0) {
            throw new ResponseError(400, "Jenis MK with this name already exists");
        }

        const newJenisMK = await prismaClient.jenisMK.create({
            data: {
                nama_jenis_mk: createRequest.namaJenisMk,
            },
        });

        return toJenisMKResponse(newJenisMK);
    }

    static async get(idJenisMk: string): Promise<JenisMKResponse> {
        idJenisMk = Validation.validate(JenisMKValidation.ID_JENIS_MK, idJenisMk);

        const jenisMK = await prismaClient.jenisMK.findUnique({
            where: { id_jenis_mk: idJenisMk },
        });

        if (!jenisMK) {
            throw new ResponseError(404, "Jenis MK not found");
        }

        return toJenisMKResponse(jenisMK);
    }

    static async update(idJenisMk: string, request: UpdateJenisMKRequest): Promise<JenisMKResponse> {
        idJenisMk = Validation.validate(JenisMKValidation.ID_JENIS_MK, idJenisMk);
        const updateRequest = Validation.validate(JenisMKValidation.UPDATE, request);

        const existingJenisMK = await prismaClient.jenisMK.findUnique({
            where: { id_jenis_mk: idJenisMk }
        });

        if (!existingJenisMK) {
            throw new ResponseError(404, "Jenis MK not found");
        }

        if (updateRequest.namaJenisMk && updateRequest.namaJenisMk !== existingJenisMK.nama_jenis_mk) {
            const conflictCount = await prismaClient.jenisMK.count({
                where: { nama_jenis_mk: updateRequest.namaJenisMk }
            });
            if (conflictCount > 0) {
                throw new ResponseError(400, "Another Jenis MK with this name already exists");
            }
        }

        const updatedJenisMK = await prismaClient.jenisMK.update({
            where: { id_jenis_mk: idJenisMk },
            data: {
                nama_jenis_mk: updateRequest.namaJenisMk ?? existingJenisMK.nama_jenis_mk,
            }
        });

        return toJenisMKResponse(updatedJenisMK);
    }

    static async remove(idJenisMk: string): Promise<void> {
        idJenisMk = Validation.validate(JenisMKValidation.ID_JENIS_MK, idJenisMk);

        const existingJenisMKCount = await prismaClient.jenisMK.count({
            where: { id_jenis_mk: idJenisMk }
        });

        if (existingJenisMKCount === 0) {
            throw new ResponseError(404, "Jenis MK not found");
        }

        const mataKuliahCount = await prismaClient.mataKuliah.count({
            where: { jenisMKId: idJenisMk } // Perhatikan nama kolom FK di MataKuliah
        });
        if (mataKuliahCount > 0) {
            throw new ResponseError(400, "Cannot delete Jenis MK: still referenced by Mata Kuliah");
        }

        await prismaClient.jenisMK.delete({
            where: { id_jenis_mk: idJenisMk }
        });
    }

    static async search(request: SearchJenisMKRequest): Promise<[JenisMKResponse[], number]> {
        const searchRequest = Validation.validate(JenisMKValidation.SEARCH, request);

        const skip = (searchRequest.page! - 1) * searchRequest.size!;
        const filters: any[] = [];

        if (searchRequest.namaJenisMk) {
            filters.push({
                nama_jenis_mk: {
                    contains: searchRequest.namaJenisMk,
                    mode: 'insensitive'
                }
            });
        }

        const [jenisMKs, total] = await prismaClient.$transaction([
            prismaClient.jenisMK.findMany({
                where: { AND: filters },
                take: searchRequest.size,
                skip: skip,
                orderBy: { nama_jenis_mk: 'asc' }
            }),
            prismaClient.jenisMK.count({ where: { AND: filters } })
        ]);

        const responses = jenisMKs.map(toJenisMKResponse);

        return [responses, total];
    }
}