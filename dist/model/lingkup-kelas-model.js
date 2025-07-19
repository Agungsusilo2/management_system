"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toLingkupKelasResponse = toLingkupKelasResponse;
function toLingkupKelasResponse(lingkupKelas) {
    return {
        idLingkupKelas: lingkupKelas.id_lingkup_kelas,
        namaLingkupKelas: lingkupKelas.nama_lingkup_kelas,
    };
}
