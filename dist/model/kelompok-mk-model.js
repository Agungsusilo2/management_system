"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toKelompokMKResponse = toKelompokMKResponse;
function toKelompokMKResponse(kelompokMK) {
    return {
        idKelompokMk: kelompokMK.id_kelompok_mk,
        namaKelompokMk: kelompokMK.nama_kelompok_mk,
    };
}
