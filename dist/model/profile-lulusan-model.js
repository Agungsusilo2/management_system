"use strict";
// src/model/profil-lulusan-model.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.toProfilLulusanResponse = toProfilLulusanResponse;
function toProfilLulusanResponse(profilLulusan) {
    return {
        kodePL: profilLulusan.KodePL,
        deskripsi: profilLulusan.ProfilLulusan,
        kodeProfesi: profilLulusan.KodeProfesi,
        profesi: profilLulusan.profesi ? {
            kodeProfesi: profilLulusan.profesi.KodeProfesi,
            namaProfesi: profilLulusan.profesi.Profesi,
        } : null,
    };
}
