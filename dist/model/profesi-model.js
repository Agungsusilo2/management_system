"use strict";
// src/model/profesi-model.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.toProfesiResponse = toProfesiResponse;
// Fungsi transformasi dari objek Prisma ke response type
function toProfesiResponse(profesi) {
    return {
        kodeProfesi: profesi.KodeProfesi,
        namaProfesi: profesi.Profesi, // Perhatikan ini Profesi.Profesi
    };
}
