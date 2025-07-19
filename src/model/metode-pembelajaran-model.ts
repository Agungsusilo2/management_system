import {MetodePembelajaran} from "../../generated/prisma";

export type MetodePembelajaranResponse = {
    idMetodePembelajaran: string;
    namaMetodePembelajaran: string;
};

export type CreateMetodePembelajaranRequest = {
    namaMetodePembelajaran: string;
};

export type UpdateMetodePembelajaranRequest = {
    namaMetodePembelajaran?: string;
};

export type SearchMetodePembelajaranRequest = {
    namaMetodePembelajaran?: string;
    page?: number;
    size?: number;
}

export function toMetodePembelajaranResponse(metodePembelajaran: MetodePembelajaran): MetodePembelajaranResponse {
    return {
        idMetodePembelajaran: metodePembelajaran.id_metode_pembelajaran,
        namaMetodePembelajaran: metodePembelajaran.nama_metode_pembelajaran,
    };
}