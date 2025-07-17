
import { BKMK, BahanKajian, MataKuliah } from '../../generated/prisma';
import { BahanKajianResponse } from './bahan-kajian-model';
import { MataKuliahResponse } from './mata-kuliah-model';

export type BKMKResponse = {
    kodeBK: string;
    idmk: string;
    namaBahanKajian?: BahanKajianResponse | null; // Properti ini akan berisi data BahanKajian yang sudah direspons
    mataKuliah?: MataKuliahResponse | null;
};

export type CreateBKMKRequest = {
    kodeBK: string;
    idmk: string;
};

export type DeleteBKMKRequest = {
    kodeBK: string;
    idmk: string;
};

export type SearchBKMKRequest = {
    kodeBK?: string;
    idmk?: string;
    page?: number;
    size?: number;
};

export function toBKMKResponse(bkmk: BKMK & { bahanKajian?: BahanKajian | null; mataKuliah?: MataKuliah | null }): BKMKResponse {
    return {
        kodeBK: bkmk.KodeBK,
        idmk: bkmk.IDMK,
        namaBahanKajian: bkmk.bahanKajian ? {
            kodeBK: bkmk.bahanKajian.KodeBK,
            namaBahanKajian: bkmk.bahanKajian.BahanKajian,
            kodeReferensi: bkmk.bahanKajian.KodeReferensi,
        } : null,
        mataKuliah: bkmk.mataKuliah ? {
            idmk: bkmk.mataKuliah.IDMK,
            namaMk: bkmk.mataKuliah.NamaMK,
        } : null,
    };
}