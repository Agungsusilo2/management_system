"use strict";
// src/model/mata-kuliah-model.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.toMataKuliahResponse = toMataKuliahResponse;
function toMataKuliahResponse(mataKuliah) {
    return {
        idmk: mataKuliah.IDMK,
        namaMk: mataKuliah.NamaMK, // Mapping dari kolom database 'Nama_MK' ke 'namaMk'
    };
}
