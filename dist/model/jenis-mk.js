"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toJenisMKResponse = toJenisMKResponse;
function toJenisMKResponse(jenisMK) {
    return {
        idJenisMk: jenisMK.id_jenis_mk,
        namaJenisMk: jenisMK.nama_jenis_mk,
    };
}
