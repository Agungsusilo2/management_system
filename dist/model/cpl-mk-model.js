"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toCPLMKResponse = toCPLMKResponse;
function toCPLMKResponse(cplMk) {
    return {
        kodeCPL: cplMk.KodeCPL,
        idmk: cplMk.IDMK,
        cplProdi: cplMk.cplProdi ? {
            kodeCPL: cplMk.cplProdi.KodeCPL,
            deskripsiCPL: cplMk.cplProdi.DeskripsiCPL,
        } : null,
        mataKuliah: cplMk.mataKuliah ? {
            idmk: cplMk.mataKuliah.IDMK,
            namaMk: cplMk.mataKuliah.NamaMK,
        } : null,
    };
}
