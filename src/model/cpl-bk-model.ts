
import { CPLBK, CPLProdi, BahanKajian } from '../../generated/prisma';
import { CPLProdiResponse } from './cpl-prodi-model';
import { BahanKajianResponse } from './bahan-kajian-model'; // Make sure this file properly defines BahanKajianResponse

export type CPLBKResponse = {
    kodeCPL: string;
    kodeBK: string;
    cplProdi?: CPLProdiResponse | null;
    bahanKajian?: BahanKajianResponse | null;
};

export type CreateCPLBKRequest = {
    kodeCPL: string;
    kodeBK: string;
};

export type DeleteCPLBKRequest = {
    kodeCPL: string;
    kodeBK: string;
};

export type SearchCPLBKRequest = {
    kodeCPL?: string;
    kodeBK?: string;
    page?: number;
    size?: number;
};

export function toCPLBKResponse(cplBk: CPLBK & { cplProdi?: CPLProdi | null; bahanKajian?: BahanKajian | null }): CPLBKResponse {
    return {
        kodeCPL: cplBk.KodeCPL,
        kodeBK: cplBk.KodeBK,
        cplProdi: cplBk.cplProdi ? {
            kodeCPL: cplBk.cplProdi.KodeCPL,
            deskripsiCPL: cplBk.cplProdi.DeskripsiCPL,
        } : null,
        bahanKajian: cplBk.bahanKajian ? {
            kodeBK: cplBk.bahanKajian.KodeBK,
            namaBahanKajian: cplBk.bahanKajian.BahanKajian,
            kodeReferensi: cplBk.bahanKajian.KodeReferensi,
        } : null,
    };
}