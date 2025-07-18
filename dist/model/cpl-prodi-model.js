"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toCPLProdiResponse = toCPLProdiResponse;
function toCPLProdiResponse(cplProdi) {
    return {
        kodeCPL: cplProdi.KodeCPL,
        deskripsiCPL: cplProdi.DeskripsiCPL,
        kodeAspek: cplProdi.KodeAspek,
        aspek: cplProdi.aspek ? {
            kodeAspek: cplProdi.aspek.KodeAspek,
            namaAspek: cplProdi.aspek.Aspek,
        } : null,
    };
}
