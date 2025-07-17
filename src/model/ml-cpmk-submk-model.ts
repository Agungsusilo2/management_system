
import { MLCPMKSubMK, MataKuliah, CPMK, SubCPMK } from '../../generated/prisma';
import { MataKuliahResponse } from './mata-kuliah-model';
import { CPMKResponse } from './cpmk-model';
import { SubCPMKResponse } from './sub-cpmk-model';

export type MLCPMKSubMKResponse = {
    idmk: string;
    kodeCPMK: string;
    subCPMKId: string;
    mataKuliah?: MataKuliahResponse | null;
    cpmk?: CPMKResponse | null;
    subCPMK?: SubCPMKResponse | null;
};

export type CreateMLCPMKSubMKRequest = {
    idmk: string;
    kodeCPMK: string;
    subCPMKId: string;
};

export type DeleteMLCPMKSubMKRequest = {
    idmk: string;
    kodeCPMK: string;
    subCPMKId: string;
};

export type SearchMLCPMKSubMKRequest = {
    idmk?: string;
    kodeCPMK?: string;
    subCPMKId?: string;
    page?: number;
    size?: number;
};

export function toMLCPMKSubMKResponse(mlCpmkSubMk: MLCPMKSubMK & { mataKuliah?: MataKuliah | null; cpmk?: CPMK | null; subCPMK?: SubCPMK | null }): MLCPMKSubMKResponse {
    return {
        idmk: mlCpmkSubMk.IDMK,
        kodeCPMK: mlCpmkSubMk.KodeCPMK,
        subCPMKId: mlCpmkSubMk.SubCPMK,
        mataKuliah: mlCpmkSubMk.mataKuliah ? {
            idmk: mlCpmkSubMk.mataKuliah.IDMK,
            namaMk: mlCpmkSubMk.mataKuliah.NamaMK,
        } : null,
        cpmk: mlCpmkSubMk.cpmk ? {
            kodeCPMK: mlCpmkSubMk.cpmk.KodeCPMK,
            namaCPMK: mlCpmkSubMk.cpmk.CPMK,
            subCPMKId: mlCpmkSubMk.cpmk.SubCPMK,
        } : null,
        subCPMK: mlCpmkSubMk.subCPMK ? {
            subCPMKId: mlCpmkSubMk.subCPMK.SubCPMK,
            uraianSubCPMK: mlCpmkSubMk.subCPMK.UraianSubCPMK,
        } : null,
    };
}