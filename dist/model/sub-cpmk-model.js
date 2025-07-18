"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toSubCPMKResponse = toSubCPMKResponse;
function toSubCPMKResponse(subCpmk) {
    return {
        subCPMKId: subCpmk.SubCPMK,
        uraianSubCPMK: subCpmk.UraianSubCPMK,
    };
}
