import {
    CreateModeKuliahRequest,
    ModeKuliahResponse, SearchModeKuliahRequest,
    toModeKuliahResponse,
    UpdateModeKuliahRequest
} from "../model/mode-kuliah";
import {Validation} from "../validation/validation";
import {ModeKuliahValidation} from "../validation/mode-kuliah-validation";
import {prismaClient} from "../application/database";
import {ResponseError} from "../error/response-error";

export class ModeKuliahService {
    static async create(request: CreateModeKuliahRequest): Promise<ModeKuliahResponse> {
        const createRequest = Validation.validate(ModeKuliahValidation.CREATE, request);

        const existingModeKuliah = await prismaClient.modeKuliah.count({
            where: { nama_mode_kuliah: createRequest.namaModeKuliah }
        });
        if (existingModeKuliah > 0) {
            throw new ResponseError(400, "Mode Kuliah with this name already exists");
        }

        const newModeKuliah = await prismaClient.modeKuliah.create({
            data: {
                nama_mode_kuliah: createRequest.namaModeKuliah,
            },
        });

        return toModeKuliahResponse(newModeKuliah);
    }

    static async get(idModeKuliah: string): Promise<ModeKuliahResponse> {
        idModeKuliah = Validation.validate(ModeKuliahValidation.ID_MODE_KULIAH, idModeKuliah);

        const modeKuliah = await prismaClient.modeKuliah.findUnique({
            where: { id_mode_kuliah: idModeKuliah },
        });

        if (!modeKuliah) {
            throw new ResponseError(404, "Mode Kuliah not found");
        }

        return toModeKuliahResponse(modeKuliah);
    }

    static async update(idModeKuliah: string, request: UpdateModeKuliahRequest): Promise<ModeKuliahResponse> {
        idModeKuliah = Validation.validate(ModeKuliahValidation.ID_MODE_KULIAH, idModeKuliah);
        const updateRequest = Validation.validate(ModeKuliahValidation.UPDATE, request);

        const existingModeKuliah = await prismaClient.modeKuliah.findUnique({
            where: { id_mode_kuliah: idModeKuliah }
        });

        if (!existingModeKuliah) {
            throw new ResponseError(404, "Mode Kuliah not found");
        }

        if (updateRequest.namaModeKuliah && updateRequest.namaModeKuliah !== existingModeKuliah.nama_mode_kuliah) {
            const conflictCount = await prismaClient.modeKuliah.count({
                where: { nama_mode_kuliah: updateRequest.namaModeKuliah }
            });
            if (conflictCount > 0) {
                throw new ResponseError(400, "Another Mode Kuliah with this name already exists");
            }
        }

        const updatedModeKuliah = await prismaClient.modeKuliah.update({
            where: { id_mode_kuliah: idModeKuliah },
            data: {
                nama_mode_kuliah: updateRequest.namaModeKuliah ?? existingModeKuliah.nama_mode_kuliah,
            }
        });

        return toModeKuliahResponse(updatedModeKuliah);
    }

    static async remove(idModeKuliah: string): Promise<void> {
        idModeKuliah = Validation.validate(ModeKuliahValidation.ID_MODE_KULIAH, idModeKuliah);

        const existingModeKuliahCount = await prismaClient.modeKuliah.count({
            where: { id_mode_kuliah: idModeKuliah }
        });

        if (existingModeKuliahCount === 0) {
            throw new ResponseError(404, "Mode Kuliah not found");
        }

        const mataKuliahCount = await prismaClient.mataKuliah.count({
            where: { modeKuliahId: idModeKuliah } // Perhatikan nama kolom FK di MataKuliah
        });
        if (mataKuliahCount > 0) {
            throw new ResponseError(400, "Cannot delete Mode Kuliah: still referenced by Mata Kuliah");
        }

        await prismaClient.modeKuliah.delete({
            where: { id_mode_kuliah: idModeKuliah }
        });
    }

    static async search(request: SearchModeKuliahRequest): Promise<[ModeKuliahResponse[], number]> {
        const searchRequest = Validation.validate(ModeKuliahValidation.SEARCH, request);

        const skip = (searchRequest.page! - 1) * searchRequest.size!;
        const filters: any[] = [];

        if (searchRequest.namaModeKuliah) {
            filters.push({
                nama_mode_kuliah: {
                    contains: searchRequest.namaModeKuliah,
                    mode: 'insensitive'
                }
            });
        }

        const [modeKuliahs, total] = await prismaClient.$transaction([
            prismaClient.modeKuliah.findMany({
                where: { AND: filters },
                take: searchRequest.size,
                skip: skip,
                orderBy: { nama_mode_kuliah: 'asc' }
            }),
            prismaClient.modeKuliah.count({ where: { AND: filters } })
        ]);

        const responses = modeKuliahs.map(toModeKuliahResponse);

        return [responses, total];
    }
}