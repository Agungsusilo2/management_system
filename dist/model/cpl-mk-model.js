"use strict";
// src/model/cpl-mk-model.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.toCPLMKResponse = toCPLMKResponse;
// Fungsi transformasi dari objek Prisma ke response type
function toCPLMKResponse(cplMk) {
    return {
        kodeCPL: cplMk.KodeCPL,
        idmk: cplMk.IDMK,
        cplProdi: cplMk.cplProdi ? {
            kodeCPL: cplMk.cplProdi.KodeCPL,
            deskripsiCPL: cplMk.cplProdi.DeskripsiCPL,
            // ... atribut CPLProdi lainnya
        } : null,
        mataKuliah: cplMk.mataKuliah ? {
            idmk: cplMk.mataKuliah.IDMK,
            namaMk: cplMk.mataKuliah.NamaMK,
            // ... atribut MataKuliah lainnya
        } : null,
    };
}
