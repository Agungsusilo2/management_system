
import { CPLCPMKMK, CPLProdi, CPMK, MataKuliah } from '../../generated/prisma';
import { CPLProdiResponse } from './cpl-prodi-model';
import { CPMKResponse } from './cpmk-model';
import { MataKuliahResponse } from './mata-kuliah-model';

export type CPLCPMKMKResponse = {
    kodeCPL: string;
    kodeCPMK: string;
    idmk: string;
    cplProdi?: CPLProdiResponse | null;
    cpmk?: CPMKResponse | null;
    mataKuliah?: MataKuliahResponse | null;
};

export type CreateCPLCPMKMKRequest = {
    kodeCPL: string;
    kodeCPMK: string;
    idmk: string;
};

export type DeleteCPLCPMKMKRequest = {
    kodeCPL: string;
    kodeCPMK: string;
    idmk: string;
};

export type SearchCPLCPMKMKRequest = {
    kodeCPL?: string;
    kodeCPMK?: string;
    idmk?: string;
    page?: number;
    size?: number;
};

export function toCPLCPMKMKResponse(cplCpmkMk: CPLCPMKMK & { cplProdi?: CPLProdi | null; cpmk?: CPMK | null; mataKuliah?: MataKuliah | null }): CPLCPMKMKResponse {
    return {
        kodeCPL: cplCpmkMk.KodeCPL,
        kodeCPMK: cplCpmkMk.KodeCPMK,
        idmk: cplCpmkMk.IDMK,
        cplProdi: cplCpmkMk.cplProdi ? {
            kodeCPL: cplCpmkMk.cplProdi.KodeCPL,
            deskripsiCPL: cplCpmkMk.cplProdi.DeskripsiCPL,
        } : null,
        cpmk: cplCpmkMk.cpmk ? {
            kodeCPMK: cplCpmkMk.cpmk.KodeCPMK,
            namaCPMK: cplCpmkMk.cpmk.CPMK,
            subCPMKId: cplCpmkMk.cpmk.SubCPMK,
        } : null,
        mataKuliah: cplCpmkMk.mataKuliah ? {
            idmk: cplCpmkMk.mataKuliah.IDMK,
            namaMk: cplCpmkMk.mataKuliah.NamaMK,
        } : null,
    };
}