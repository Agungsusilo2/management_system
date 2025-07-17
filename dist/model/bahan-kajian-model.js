"use strict";
// src/model/bahan-kajian-model.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.toBahanKajianResponse = toBahanKajianResponse;
function toBahanKajianResponse(bahanKajian) {
    return {
        kodeBK: bahanKajian.KodeBK,
        namaBahanKajian: bahanKajian.BahanKajian,
        kodeReferensi: bahanKajian.KodeReferensi,
        referensi: bahanKajian.referensi ? {
            kodeReferensi: bahanKajian.referensi.KodeReferensi,
            namaReferensi: bahanKajian.referensi.Referensi,
        } : null,
    };
}
