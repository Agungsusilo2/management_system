// src/model/cpl-pl-model.ts

import { CPLPL, CPLProdi, ProfilLulusan } from '../../generated/prisma';
import { CPLProdiResponse } from './cpl-prodi-model';
import {ProfilLulusanResponse} from "./profile-lulusan-model"; // Asumsi ada cpl-prodi-model

export type CPLPLResponse = {
    kodeCPL: string;
    kodePL: string;
    cplProdi?: CPLProdiResponse | null;
    profilLulusan?: ProfilLulusanResponse | null;
};

export type CreateCPLPLRequest = {
    kodeCPL: string;
    kodePL: string;
};

export type DeleteCPLPLRequest = {
    kodeCPL: string;
    kodePL: string;
};

export type SearchCPLPLRequest = {
    kodeCPL?: string;
    kodePL?: string;
    page?: number;
    size?: number;
};

export function toCPLPLResponse(cplPl: CPLPL & { cplProdi?: CPLProdi | null; profilLulusan?: ProfilLulusan | null }): CPLPLResponse {
    return {
        kodeCPL: cplPl.KodeCPL,
        kodePL: cplPl.KodePL,
        cplProdi: cplPl.cplProdi ? {
            kodeCPL: cplPl.cplProdi.KodeCPL,
            deskripsiCPL: cplPl.cplProdi.DeskripsiCPL,
        } : null,
        profilLulusan: cplPl.profilLulusan ? {
            kodePL: cplPl.profilLulusan.KodePL,
            deskripsi: cplPl.profilLulusan.ProfilLulusan,
        } : null,
    };
}