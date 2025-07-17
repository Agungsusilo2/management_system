"use strict";
// src/model/cpl-bk-model.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.toCPLBKResponse = toCPLBKResponse;
function toCPLBKResponse(cplBk) {
    return {
        kodeCPL: cplBk.KodeCPL,
        kodeBK: cplBk.KodeBK,
        cplProdi: cplBk.cplProdi ? {
            kodeCPL: cplBk.cplProdi.KodeCPL,
            deskripsiCPL: cplBk.cplProdi.DeskripsiCPL,
            // Perhatikan: Jika CPLProdiResponse memiliki properti wajib lainnya, tambahkan di sini
        } : null,
        bahanKajian: cplBk.bahanKajian ? {
            kodeBK: cplBk.bahanKajian.KodeBK,
            namaBahanKajian: cplBk.bahanKajian.BahanKajian,
            // --- TAMBAHKAN BARIS INI UNTUK MEMPERBAIKI ERROR ---
            kodeReferensi: cplBk.bahanKajian.KodeReferensi,
            // ----------------------------------------------------
            // Penting: Pastikan 'cplBk.bahanKajian' yang didapatkan dari Prisma
            // sudah meng-include properti 'KodeReferensi'. Jika tidak,
            // Anda perlu menyesuaikan query Prisma Anda (misalnya dengan 'include')
            // agar KodeReferensi ikut terbawa.
        } : null,
    };
}
