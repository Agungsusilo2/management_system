

import {Aspek} from "../../generated/prisma";

export type AspekResponse = {
    kodeAspek: string;
    namaAspek?: string | null;
};

export type CreateAspekRequest = {
    kodeAspek: string;
    namaAspek: string;
};

export type UpdateAspekRequest = {
    namaAspek?: string;
};

export type SearchAspekRequest = {
    namaAspek?: string;
    page?: number;
    size?: number;
};

export function toAspekResponse(aspek: Aspek): AspekResponse {
    return {
        kodeAspek: aspek.KodeAspek,
        namaAspek: aspek.Aspek,
    };
}