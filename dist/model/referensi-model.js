"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toReferensiResponse = toReferensiResponse;
function toReferensiResponse(referensi) {
    return {
        kodeReferensi: referensi.KodeReferensi,
        namaReferensi: referensi.Referensi,
    };
}
