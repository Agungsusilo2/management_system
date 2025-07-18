"use strict";
// src/model/cpl-pl-model.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.toCPLPLResponse = toCPLPLResponse;
function toCPLPLResponse(cplPl) {
    return {
        kodeCPL: cplPl.KodeCPL,
        kodePL: cplPl.KodePL,
        cplProdi: cplPl.cplProdi ? {
            kodeCPL: cplPl.cplProdi.KodeCPL,
            deskripsiCPL: cplPl.cplProdi.DeskripsiCPL,
        } : null,
        profilLulusan: cplPl.profilLulusan ? {
            kodePL: cplPl.profilLulusan.KodePL,
            deskripsi: cplPl.profilLulusan.ProfilLulusan,
        } : null,
    };
}
