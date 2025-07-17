// src/model/bahan-kajian-model.ts

import { BahanKajian, Referensi } from '../../generated/prisma';

export type BahanKajianResponse = {
    kodeBK: string; // KodeBK
    namaBahanKajian?: string | null;
    kodeReferensi: string;
    referensi?: {
        kodeReferensi: string;
        namaReferensi?: string | null;
    } | null;
};

export type CreateBahanKajianRequest = {
    kodeBK: string;
    namaBahanKajian: string;
    kodeReferensi: string;
};

export type UpdateBahanKajianRequest = {
    namaBahanKajian?: string;
    kodeReferensi?: string;
};

export type SearchBahanKajianRequest = {
    namaBahanKajian?: string;
    kodeReferensi?: string;
    page?: number;
    size?: number;
};

export function toBahanKajianResponse(bahanKajian: BahanKajian & { referensi?: Referensi | null }): BahanKajianResponse {
    return {
        kodeBK: bahanKajian.KodeBK,
        namaBahanKajian: bahanKajian.BahanKajian,
        kodeReferensi: bahanKajian.KodeReferensi,
        referensi: bahanKajian.referensi ? {
            kodeReferensi: bahanKajian.referensi.KodeReferensi,
            namaReferensi: bahanKajian.referensi.Referensi,
        } : null,
    };
}