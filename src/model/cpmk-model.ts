// src/model/cpmk-model.ts

import { CPMK, SubCPMK } from '../../generated/prisma';

export type CPMKResponse = {
    kodeCPMK: string;
    namaCPMK?: string | null;
    subCPMKId: string;
    subCPMK?: {
        subCPMKId: string;
        uraianSubCPMK?: string | null;
    } | null;
};

export type CreateCPMKRequest = {
    kodeCPMK: string;
    namaCPMK: string;
    subCPMKId: string;
};

export type UpdateCPMKRequest = {
    namaCPMK?: string;
    subCPMKId?: string;
};

export type SearchCPMKRequest = {
    namaCPMK?: string;
    subCPMKId?: string;
    page?: number;
    size?: number;
};

export function toCPMKResponse(cpmk: CPMK & { subCPMK?: SubCPMK | null }): CPMKResponse {
    return {
        kodeCPMK: cpmk.KodeCPMK,
        namaCPMK: cpmk.CPMK,
        subCPMKId: cpmk.SubCPMK,
        subCPMK: cpmk.subCPMK ? {
            subCPMKId: cpmk.subCPMK.SubCPMK,
            uraianSubCPMK: cpmk.subCPMK.UraianSubCPMK,
        } : null,
    };
}