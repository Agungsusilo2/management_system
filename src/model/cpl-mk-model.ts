
import { CPLMK, CPLProdi, MataKuliah } from '../../generated/prisma';
import { CPLProdiResponse } from './cpl-prodi-model'; // Asumsi ada cpl-prodi-model
import { MataKuliahResponse } from './mata-kuliah-model'; // Asumsi ada mata-kuliah-model

export type CPLMKResponse = {
    kodeCPL: string;
    idmk: string;
    cplProdi?: CPLProdiResponse | null;
    mataKuliah?: MataKuliahResponse | null;
};

export type CreateCPLMKRequest = {
    kodeCPL: string;
    idmk: string;
};

export type DeleteCPLMKRequest = {
    kodeCPL: string;
    idmk: string;
};

export type SearchCPLMKRequest = {
    kodeCPL?: string;
    idmk?: string;
    page?: number;
    size?: number;
};

export function toCPLMKResponse(cplMk: CPLMK & { cplProdi?: CPLProdi | null; mataKuliah?: MataKuliah | null }): CPLMKResponse {
    return {
        kodeCPL: cplMk.KodeCPL,
        idmk: cplMk.IDMK,
        cplProdi: cplMk.cplProdi ? {
            kodeCPL: cplMk.cplProdi.KodeCPL,
            deskripsiCPL: cplMk.cplProdi.DeskripsiCPL,
        } : null,
        mataKuliah: cplMk.mataKuliah ? {
            idmk: cplMk.mataKuliah.IDMK,
            namaMk: cplMk.mataKuliah.NamaMK,
        } : null,
    };
}