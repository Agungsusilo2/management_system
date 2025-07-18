"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toCPLBKResponse = toCPLBKResponse;
function toCPLBKResponse(cplBk) {
    return {
        kodeCPL: cplBk.KodeCPL,
        kodeBK: cplBk.KodeBK,
        cplProdi: cplBk.cplProdi ? {
            kodeCPL: cplBk.cplProdi.KodeCPL,
            deskripsiCPL: cplBk.cplProdi.DeskripsiCPL,
        } : null,
        bahanKajian: cplBk.bahanKajian ? {
            kodeBK: cplBk.bahanKajian.KodeBK,
            namaBahanKajian: cplBk.bahanKajian.BahanKajian,
            kodeReferensi: cplBk.bahanKajian.KodeReferensi,
        } : null,
    };
}
