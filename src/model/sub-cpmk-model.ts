
import { SubCPMK } from '../../generated/prisma';

export type SubCPMKResponse = {
    subCPMKId: string;
    uraianSubCPMK?: string | null;
};

export type CreateSubCPMKRequest = {
    subCPMKId: string;
    uraianSubCPMK: string;
};

export type UpdateSubCPMKRequest = {
    uraianSubCPMK?: string;
};

export type SearchSubCPMKRequest = {
    uraianSubCPMK?: string;
    page?: number;
    size?: number;
};

export function toSubCPMKResponse(subCpmk: SubCPMK): SubCPMKResponse {
    return {
        subCPMKId: subCpmk.SubCPMK,
        uraianSubCPMK: subCpmk.UraianSubCPMK,
    };
}