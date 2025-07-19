"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toMetodePembelajaranResponse = toMetodePembelajaranResponse;
function toMetodePembelajaranResponse(metodePembelajaran) {
    return {
        idMetodePembelajaran: metodePembelajaran.id_metode_pembelajaran,
        namaMetodePembelajaran: metodePembelajaran.nama_metode_pembelajaran,
    };
}
