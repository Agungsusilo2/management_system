"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toBKMKResponse = toBKMKResponse;
function toBKMKResponse(bkmk) {
    return {
        kodeBK: bkmk.KodeBK,
        idmk: bkmk.IDMK,
        namaBahanKajian: bkmk.bahanKajian ? {
            kodeBK: bkmk.bahanKajian.KodeBK,
            namaBahanKajian: bkmk.bahanKajian.BahanKajian,
            kodeReferensi: bkmk.bahanKajian.KodeReferensi,
        } : null,
        mataKuliah: bkmk.mataKuliah ? {
            idmk: bkmk.mataKuliah.IDMK,
            namaMk: bkmk.mataKuliah.NamaMK,
        } : null,
    };
}
