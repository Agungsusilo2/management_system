import {JenisMK} from "../../generated/prisma";

export type JenisMKResponse = {
    idJenisMk: string;
    namaJenisMk: string;
};

export type CreateJenisMKRequest = {
    namaJenisMk: string;
};

export type UpdateJenisMKRequest = {
    namaJenisMk?: string;
};

export type SearchJenisMKRequest = {
    namaJenisMk?: string;
    page?: number;
    size?: number;
}

export function toJenisMKResponse(jenisMK: JenisMK): JenisMKResponse {
    return {
        idJenisMk: jenisMK.id_jenis_mk,
        namaJenisMk: jenisMK.nama_jenis_mk,
    };
}