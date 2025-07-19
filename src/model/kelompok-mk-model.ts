import {KelompokMK} from "../../generated/prisma";

export type KelompokMKResponse = {
    idKelompokMk: string;
    namaKelompokMk: string;
};

export type CreateKelompokMKRequest = {
    namaKelompokMk: string;
};

export type UpdateKelompokMKRequest = {
    namaKelompokMk?: string;
};

export type SearchKelompokMKRequest = {
    namaKelompokMk?: string;
    page?: number;
    size?: number;
}

export function toKelompokMKResponse(kelompokMK: KelompokMK): KelompokMKResponse {
    return {
        idKelompokMk: kelompokMK.id_kelompok_mk,
        namaKelompokMk: kelompokMK.nama_kelompok_mk,
    };
}