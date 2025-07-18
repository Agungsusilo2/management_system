"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toMLCPMKSubMKResponse = toMLCPMKSubMKResponse;
function toMLCPMKSubMKResponse(mlCpmkSubMk) {
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
