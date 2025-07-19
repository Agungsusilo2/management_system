import {LingkupKelas} from "../../generated/prisma";

export type LingkupKelasResponse = {
    idLingkupKelas: string;
    namaLingkupKelas: string;
};

export type CreateLingkupKelasRequest = {
    namaLingkupKelas: string;
};

export type UpdateLingkupKelasRequest = {
    namaLingkupKelas?: string;
};

export type SearchLingkupKelasRequest = {
    namaLingkupKelas?: string;
    page?: number;
    size?: number;
}

export function toLingkupKelasResponse(lingkupKelas: LingkupKelas): LingkupKelasResponse {
    return {
        idLingkupKelas: lingkupKelas.id_lingkup_kelas,
        namaLingkupKelas: lingkupKelas.nama_lingkup_kelas,
    };
}