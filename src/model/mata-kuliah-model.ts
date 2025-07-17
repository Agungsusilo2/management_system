
import { MataKuliah } from '../../generated/prisma';

export type MataKuliahResponse = {
    idmk: string;
    namaMk?: string | null;
};

export type CreateMataKuliahRequest = {
    idmk: string;
    namaMk: string;
};

export type UpdateMataKuliahRequest = {
    namaMk?: string;
};

export type SearchMataKuliahRequest = {
    namaMk?: string;
    page?: number;
    size?: number;
};

export function toMataKuliahResponse(mataKuliah: MataKuliah): MataKuliahResponse {
    return {
        idmk: mataKuliah.IDMK,
        namaMk: mataKuliah.NamaMK,
    };
}