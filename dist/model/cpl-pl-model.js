"use strict";
// src/model/cpl-pl-model.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.toCPLPLResponse = toCPLPLResponse;
// Fungsi transformasi dari objek Prisma ke response type
function toCPLPLResponse(cplPl) {
    return {
        kodeCPL: cplPl.KodeCPL,
        kodePL: cplPl.KodePL,
        cplProdi: cplPl.cplProdi ? {
            kodeCPL: cplPl.cplProdi.KodeCPL,
            deskripsiCPL: cplPl.cplProdi.DeskripsiCPL,
            // ... atribut CPLProdi lainnya yang ingin Anda sertakan
        } : null,
        profilLulusan: cplPl.profilLulusan ? {
            kodePL: cplPl.profilLulusan.KodePL,
            deskripsi: cplPl.profilLulusan.ProfilLulusan,
            // ... atribut ProfilLulusan lainnya
        } : null,
    };
}
