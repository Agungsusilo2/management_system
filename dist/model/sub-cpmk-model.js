"use strict";
// src/model/sub-cpmk-model.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.toSubCPMKResponse = toSubCPMKResponse;
function toSubCPMKResponse(subCpmk) {
    return {
        subCPMKId: subCpmk.SubCPMK,
        uraianSubCPMK: subCpmk.UraianSubCPMK,
    };
}
