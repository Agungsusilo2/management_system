import { Validation } from "../validation/validation";
import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";

import { MataKuliahValidation } from "../validation/mata-kuliah-validation";
import { MataKuliahResponse, CreateMataKuliahRequest, UpdateMataKuliahRequest, SearchMataKuliahRequest, toMataKuliahResponse } from "../model/mata-kuliah-model"; // Adjust path as needed

export class MataKuliahService {
    static async create(request: CreateMataKuliahRequest): Promise<MataKuliahResponse> {
        const createRequest = Validation.validate(MataKuliahValidation.CREATE, request);

        // Check if IDMK already exists
        const existingMataKuliah = await prismaClient.mataKuliah.count({
            where: { IDMK: createRequest.idmk }
        });
        if (existingMataKuliah > 0) {
            throw new ResponseError(400, "Mata Kuliah with this IDMK already exists");
        }

        const newMataKuliah = await prismaClient.mataKuliah.create({
            data: {
                IDMK: createRequest.idmk,
                NamaMK: createRequest.namaMk,
                ...(createRequest.kodeSemester && { semester: { connect: { KodeSemester: createRequest.kodeSemester } } }),
                ...(createRequest.jenisMKId && { jenis_mk: { connect: { id_jenis_mk: createRequest.jenisMKId } } }),
                ...(createRequest.kelompokMKId && { kelompok_mk: { connect: { id_kelompok_mk: createRequest.kelompokMKId } } }),
                ...(createRequest.lingkupKelasId && { lingkup_kelas: { connect: { id_lingkup_kelas: createRequest.lingkupKelasId } } }),
                ...(createRequest.modeKuliahId && { mode_kuliah: { connect: { id_mode_kuliah: createRequest.modeKuliahId } } }),
                ...(createRequest.metodePembelajaranId && { metode_pembelajaran: { connect: { id_metode_pembelajaran: createRequest.metodePembelajaranId } } }),
            },
        });

        return toMataKuliahResponse(newMataKuliah);
    }

    static async get(idmk: string): Promise<MataKuliahResponse> {
        idmk = Validation.validate(MataKuliahValidation.IDMK, idmk);

        const mataKuliah = await prismaClient.mataKuliah.findUnique({
            where: { IDMK: idmk },
            include: {
                semester: true,
                sksMataKuliah: true,
                jenis_mk: true,
                kelompok_mk: true,
                lingkup_kelas: true,
                mode_kuliah: true,
                metode_pembelajaran: true,
            }
        });

        if (!mataKuliah) {
            throw new ResponseError(404, "Mata Kuliah not found");
        }

        return toMataKuliahResponse(mataKuliah);
    }

    static async update(idmk: string, request: UpdateMataKuliahRequest): Promise<MataKuliahResponse> {
        idmk = Validation.validate(MataKuliahValidation.IDMK, idmk);
        const updateRequest = Validation.validate(MataKuliahValidation.UPDATE, request);

        const existingMataKuliah = await prismaClient.mataKuliah.findUnique({
            where: { IDMK: idmk }
        });

        if (!existingMataKuliah) {
            throw new ResponseError(404, "Mata Kuliah not found");
        }

        const updateData: any = {
            NamaMK: updateRequest.namaMk ?? existingMataKuliah.NamaMK,
        };

        if (updateRequest.kodeSemester !== undefined) {
            updateData.semester = updateRequest.kodeSemester === null
                ? { disconnect: true }
                : { connect: { KodeSemester: updateRequest.kodeSemester } };
        }
        if (updateRequest.jenisMKId !== undefined) {
            updateData.jenis_mk = updateRequest.jenisMKId === null
                ? { disconnect: true }
                : { connect: { id_jenis_mk: updateRequest.jenisMKId } };
        }
        if (updateRequest.kelompokMKId !== undefined) {
            updateData.kelompok_mk = updateRequest.kelompokMKId === null
                ? { disconnect: true }
                : { connect: { id_kelompok_mk: updateRequest.kelompokMKId } };
        }
        if (updateRequest.lingkupKelasId !== undefined) {
            updateData.lingkup_kelas = updateRequest.lingkupKelasId === null
                ? { disconnect: true }
                : { connect: { id_lingkup_kelas: updateRequest.lingkupKelasId } };
        }
        if (updateRequest.modeKuliahId !== undefined) {
            updateData.mode_kuliah = updateRequest.modeKuliahId === null
                ? { disconnect: true }
                : { connect: { id_mode_kuliah: updateRequest.modeKuliahId } };
        }
        if (updateRequest.metodePembelajaranId !== undefined) {
            updateData.metode_pembelajaran = updateRequest.metodePembelajaranId === null
                ? { disconnect: true }
                : { connect: { id_metode_pembelajaran: updateRequest.metodePembelajaranId } };
        }

        const updatedMataKuliah = await prismaClient.mataKuliah.update({
            where: { IDMK: idmk },
            data: updateData,
            include: {
                semester: true,
                sksMataKuliah: true,
                jenis_mk: true,
                kelompok_mk: true,
                lingkup_kelas: true,
                mode_kuliah: true,
                metode_pembelajaran: true,
            }
        });

        return toMataKuliahResponse(updatedMataKuliah);
    }

    static async remove(idmk: string): Promise<void> {
        idmk = Validation.validate(MataKuliahValidation.IDMK, idmk);

        const existingMataKuliahCount = await prismaClient.mataKuliah.count({
            where: { IDMK: idmk }
        });

        if (existingMataKuliahCount === 0) {
            throw new ResponseError(404, "Mata Kuliah not found");
        }
        
        const bkmkCount = await prismaClient.bKMK.count({ where: { IDMK: idmk } });
        if (bkmkCount > 0) {
            throw new ResponseError(400, "Cannot delete Mata Kuliah: still referenced by BKMK");
        }
        const cplmkCount = await prismaClient.cPLMK.count({ where: { IDMK: idmk } });
        if (cplmkCount > 0) {
            throw new ResponseError(400, "Cannot delete Mata Kuliah: still referenced by CPLMK");
        }
        const cplbkmkCount = await prismaClient.cPLBKMK.count({ where: { IDMK: idmk } });
        if (cplbkmkCount > 0) {
            throw new ResponseError(400, "Cannot delete Mata Kuliah: still referenced by CPLBKMK");
        }
        const mlcpmksubmkCount = await prismaClient.mLCPMKSubMK.count({ where: { IDMK: idmk } });
        if (mlcpmksubmkCount > 0) {
            throw new ResponseError(400, "Cannot delete Mata Kuliah: still referenced by MLCPMKSubMK");
        }
        const cplcpmkmkCount = await prismaClient.cPLCPMKMK.count({ where: { IDMK: idmk } });
        if (cplcpmkmkCount > 0) {
            throw new ResponseError(400, "Cannot delete Mata Kuliah: still referenced by CPLCPMKMK");
        }

        await prismaClient.mataKuliah.delete({
            where: { IDMK: idmk }
        });
    }

    static async search(request: SearchMataKuliahRequest): Promise<[MataKuliahResponse[], number]> {
        const searchRequest = Validation.validate(MataKuliahValidation.SEARCH, request);

        const skip = (searchRequest.page! - 1) * searchRequest.size!;
        const filters: any[] = [];

        if (searchRequest.idmk) {
            filters.push({ IDMK: { contains: searchRequest.idmk, mode: 'insensitive' } });
        }
        if (searchRequest.namaMk) {
            filters.push({ NamaMK: { contains: searchRequest.namaMk, mode: 'insensitive' } });
        }
        if (searchRequest.kodeSemester) {
            filters.push({ KodeSemester: searchRequest.kodeSemester });
        }
        if (searchRequest.jenisMKId) {
            filters.push({ jenisMKId: searchRequest.jenisMKId });
        }
        if (searchRequest.kelompokMKId) {
            filters.push({ kelompokMKId: searchRequest.kelompokMKId });
        }
        if (searchRequest.lingkupKelasId) {
            filters.push({ lingkupKelasId: searchRequest.lingkupKelasId });
        }
        if (searchRequest.modeKuliahId) {
            filters.push({ modeKuliahId: searchRequest.modeKuliahId });
        }
        if (searchRequest.metodePembelajaranId) {
            filters.push({ metodePembelajaranId: searchRequest.metodePembelajaranId });
        }

        const [mataKuliahs, total] = await prismaClient.$transaction([
            prismaClient.mataKuliah.findMany({
                where: { AND: filters },
                take: searchRequest.size,
                skip: skip,
                orderBy: { IDMK: 'asc' },
                include: { // Include relations for search results to populate response fields
                    semester: true,
                    sksMataKuliah: true,
                    jenis_mk: true,
                    kelompok_mk: true,
                    lingkup_kelas: true,
                    mode_kuliah: true,
                    metode_pembelajaran: true,
                }
            }),
            prismaClient.mataKuliah.count({ where: { AND: filters } })
        ]);

        const responses = mataKuliahs.map(toMataKuliahResponse);

        return [responses, total];
    }
}