"use strict";
// src/model/aspek-model.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.toAspekResponse = toAspekResponse;
function toAspekResponse(aspek) {
    return {
        kodeAspek: aspek.KodeAspek,
        namaAspek: aspek.Aspek, // Mapping dari kolom database 'Aspek' ke 'namaAspek'
    };
}
