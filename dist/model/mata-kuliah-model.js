"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toMataKuliahResponse = toMataKuliahResponse;
function toMataKuliahResponse(mataKuliah) {
    return {
        idmk: mataKuliah.IDMK,
        namaMk: mataKuliah.NamaMK,
    };
}
