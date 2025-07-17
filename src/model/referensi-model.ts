
import { Referensi } from '../../generated/prisma';

export type ReferensiResponse = {
    kodeReferensi: string;
    namaReferensi?: string | null;
};

export type CreateReferensiRequest = {
    kodeReferensi: string;
    namaReferensi: string;
};

export type UpdateReferensiRequest = {
    namaReferensi?: string;
};

export type SearchReferensiRequest = {
    namaReferensi?: string;
    page?: number;
    size?: number;
};

export function toReferensiResponse(referensi: Referensi): ReferensiResponse {
    return {
        kodeReferensi: referensi.KodeReferensi,
        namaReferensi: referensi.Referensi,
    };
}