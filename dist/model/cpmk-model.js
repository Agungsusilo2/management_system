"use strict";
// src/model/cpmk-model.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.toCPMKResponse = toCPMKResponse;
function toCPMKResponse(cpmk) {
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
