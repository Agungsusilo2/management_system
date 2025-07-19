import {ModeKuliah} from "../../generated/prisma";

export type ModeKuliahResponse = {
    idModeKuliah: string;
    namaModeKuliah: string;
};

export type CreateModeKuliahRequest = {
    namaModeKuliah: string;
};

export type UpdateModeKuliahRequest = {
    namaModeKuliah?: string;
};

export type SearchModeKuliahRequest = {
    namaModeKuliah?: string;
    page?: number;
    size?: number;
}

export function toModeKuliahResponse(modeKuliah: ModeKuliah): ModeKuliahResponse {
    return {
        idModeKuliah: modeKuliah.id_mode_kuliah,
        namaModeKuliah: modeKuliah.nama_mode_kuliah,
    };
}
