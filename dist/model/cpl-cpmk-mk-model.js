"use strict";
// src/model/cpl-cpmk-mk-model.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.toCPLCPMKMKResponse = toCPLCPMKMKResponse;
// Fungsi transformasi dari objek Prisma ke response type
function toCPLCPMKMKResponse(cplCpmkMk) {
    return {
        kodeCPL: cplCpmkMk.KodeCPL,
        kodeCPMK: cplCpmkMk.KodeCPMK,
        idmk: cplCpmkMk.IDMK,
        cplProdi: cplCpmkMk.cplProdi ? {
            kodeCPL: cplCpmkMk.cplProdi.KodeCPL,
            deskripsiCPL: cplCpmkMk.cplProdi.DeskripsiCPL,
        } : null,
        cpmk: cplCpmkMk.cpmk ? {
            kodeCPMK: cplCpmkMk.cpmk.KodeCPMK,
            namaCPMK: cplCpmkMk.cpmk.CPMK,
            subCPMKId: cplCpmkMk.cpmk.SubCPMK,
        } : null,
        mataKuliah: cplCpmkMk.mataKuliah ? {
            idmk: cplCpmkMk.mataKuliah.IDMK,
            namaMk: cplCpmkMk.mataKuliah.NamaMK,
        } : null,
    };
}
