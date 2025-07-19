"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toModeKuliahResponse = toModeKuliahResponse;
function toModeKuliahResponse(modeKuliah) {
    return {
        idModeKuliah: modeKuliah.id_mode_kuliah,
        namaModeKuliah: modeKuliah.nama_mode_kuliah,
    };
}
