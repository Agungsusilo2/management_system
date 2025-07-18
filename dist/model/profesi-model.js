"use strict";
// src/model/profesi-model.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.toProfesiResponse = toProfesiResponse;
function toProfesiResponse(profesi) {
    return {
        kodeProfesi: profesi.KodeProfesi,
        namaProfesi: profesi.Profesi,
    };
}
