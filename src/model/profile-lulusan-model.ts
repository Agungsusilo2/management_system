

import {Profesi, ProfilLulusan} from "../../generated/prisma";

export type ProfilLulusanResponse = {
    kodePL: string;
    deskripsi?: string | null;
    kodeProfesi?: string | null;
    profesi?: {
        kodeProfesi: string;
        namaProfesi?: string | null;
    } | null;
};

export type CreateProfilLulusanRequest = {
    kodePL: string;
    deskripsi: string;
    kodeProfesi?: string;
};

export type UpdateProfilLulusanRequest = {
    deskripsi?: string;
    kodeProfesi?: string;
};

export type SearchProfilLulusanRequest = {
    deskripsi?: string;
    kodeProfesi?: string;
    page?: number;
    size?: number;
};

export function toProfilLulusanResponse(profilLulusan: ProfilLulusan & { profesi?: Profesi | null }): ProfilLulusanResponse {
    return {
        kodePL: profilLulusan.KodePL,
        deskripsi: profilLulusan.ProfilLulusan, 
        kodeProfesi: profilLulusan.KodeProfesi,
        profesi: profilLulusan.profesi ? {
            kodeProfesi: profilLulusan.profesi.KodeProfesi,
            namaProfesi: profilLulusan.profesi.Profesi,
        } : null,
    };
}