// src/model/cpl-bkmk-model.ts

import { CPLBKMK, CPLProdi, BahanKajian, MataKuliah } from '../../generated/prisma';
import { CPLProdiResponse } from './cpl-prodi-model';
import { BahanKajianResponse } from './bahan-kajian-model';
import { MataKuliahResponse } from './mata-kuliah-model';

export type CPLBKMKResponse = {
    kodeCPL: string;
    kodeBK: string;
    idmk: string;
    cplProdi?: CPLProdiResponse | null;
    namaBahanKajian?: BahanKajianResponse | null;
    mataKuliah?: MataKuliahResponse | null;
};

export type CreateCPLBKMKRequest = {
    kodeCPL: string;
    kodeBK: string;
    idmk: string;
};

export type DeleteCPLBKMKRequest = {
    kodeCPL: string;
    kodeBK: string;
    idmk: string;
};

export type SearchCPLBKMKRequest = {
    kodeCPL?: string;
    kodeBK?: string;
    idmk?: string;
    page?: number;
    size?: number;
};

export function toCPLBKMKResponse(cplBkmk: CPLBKMK & { cplProdi?: CPLProdi | null; bahanKajian?: BahanKajian | null; mataKuliah?: MataKuliah | null }): CPLBKMKResponse {
    return {
        kodeCPL: cplBkmk.KodeCPL,
        kodeBK: cplBkmk.KodeBK,
        idmk: cplBkmk.IDMK,
        cplProdi: cplBkmk.cplProdi ? {
            kodeCPL: cplBkmk.cplProdi.KodeCPL,
            deskripsiCPL: cplBkmk.cplProdi.DeskripsiCPL,
        } : null,
        namaBahanKajian: cplBkmk.bahanKajian ? {
            kodeBK: cplBkmk.bahanKajian.KodeBK,
            namaBahanKajian: cplBkmk.bahanKajian.BahanKajian,
            kodeReferensi: cplBkmk.bahanKajian.KodeReferensi,

        } : null,
        mataKuliah: cplBkmk.mataKuliah ? {
            idmk: cplBkmk.mataKuliah.IDMK,
            namaMk: cplBkmk.mataKuliah.NamaMK,
        } : null,
    };
}