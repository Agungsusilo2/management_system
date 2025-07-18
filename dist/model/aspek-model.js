"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toAspekResponse = toAspekResponse;
function toAspekResponse(aspek) {
    return {
        kodeAspek: aspek.KodeAspek,
        namaAspek: aspek.Aspek,
    };
}
