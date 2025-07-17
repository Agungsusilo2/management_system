"use strict";
// src/model/cpl-bkmk-model.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.toCPLBKMKResponse = toCPLBKMKResponse;
// Fungsi transformasi dari objek Prisma ke response type
function toCPLBKMKResponse(cplBkmk) {
    return {
        kodeCPL: cplBkmk.KodeCPL,
        kodeBK: cplBkmk.KodeBK,
        idmk: cplBkmk.IDMK,
        cplProdi: cplBkmk.cplProdi ? {
            kodeCPL: cplBkmk.cplProdi.KodeCPL,
            deskripsiCPL: cplBkmk.cplProdi.DeskripsiCPL,
            // Tambahkan properti lain yang dibutuhkan oleh CPLProdiResponse di sini
        } : null,
        namaBahanKajian: cplBkmk.bahanKajian ? {
            kodeBK: cplBkmk.bahanKajian.KodeBK,
            namaBahanKajian: cplBkmk.bahanKajian.BahanKajian,
            // --- TAMBAHKAN BARIS INI UNTUK MEMPERBAIKI ERROR ---
            kodeReferensi: cplBkmk.bahanKajian.KodeReferensi,
            // ----------------------------------------------------
            // Penting: Pastikan 'cplBkmk.bahanKajian' yang didapatkan dari Prisma
            // sudah meng-include properti 'KodeReferensi'. Jika tidak,
            // Anda perlu menyesuaikan query Prisma Anda (misalnya dengan 'include')
            // agar KodeReferensi ikut terbawa.
        } : null,
        mataKuliah: cplBkmk.mataKuliah ? {
            idmk: cplBkmk.mataKuliah.IDMK,
            namaMk: cplBkmk.mataKuliah.NamaMK,
            // Tambahkan properti lain yang dibutuhkan oleh MataKuliahResponse di sini
        } : null,
    };
}
