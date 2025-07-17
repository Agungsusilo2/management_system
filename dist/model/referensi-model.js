"use strict";
// src/model/referensi-model.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.toReferensiResponse = toReferensiResponse;
function toReferensiResponse(referensi) {
    return {
        kodeReferensi: referensi.KodeReferensi,
        namaReferensi: referensi.Referensi, // Mapping dari kolom database 'Referensi' ke 'namaReferensi'
    };
}
