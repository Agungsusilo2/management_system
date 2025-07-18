"use strict";
// src/model/cpl-bkmk-model.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.toCPLBKMKResponse = toCPLBKMKResponse;
function toCPLBKMKResponse(cplBkmk) {
    return {
        kodeCPL: cplBkmk.KodeCPL,
        kodeBK: cplBkmk.KodeBK,
        idmk: cplBkmk.IDMK,
        cplProdi: cplBkmk.cplProdi ? {
            kodeCPL: cplBkmk.cplProdi.KodeCPL,
            deskripsiCPL: cplBkmk.cplProdi.DeskripsiCPL,
        } : null,
        namaBahanKajian: cplBkmk.bahanKajian ? {
            kodeBK: cplBkmk.bahanKajian.KodeBK,
            namaBahanKajian: cplBkmk.bahanKajian.BahanKajian,
            kodeReferensi: cplBkmk.bahanKajian.KodeReferensi,
        } : null,
        mataKuliah: cplBkmk.mataKuliah ? {
            idmk: cplBkmk.mataKuliah.IDMK,
            namaMk: cplBkmk.mataKuliah.NamaMK,
        } : null,
    };
}
