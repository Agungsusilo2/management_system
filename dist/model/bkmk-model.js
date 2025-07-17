"use strict";
// src/model/bkmk-model.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.toBKMKResponse = toBKMKResponse;
// Fungsi transformasi dari objek Prisma ke response type
function toBKMKResponse(bkmk) {
    return {
        kodeBK: bkmk.KodeBK,
        idmk: bkmk.IDMK,
        namaBahanKajian: bkmk.bahanKajian ? {
            kodeBK: bkmk.bahanKajian.KodeBK,
            namaBahanKajian: bkmk.bahanKajian.BahanKajian,
            kodeReferensi: bkmk.bahanKajian.KodeReferensi, // <--- TAMBAHKAN BARIS INI
            // Pastikan bkmk.bahanKajian yang didapat dari Prisma sudah meng-include KodeReferensi
            // Jika tidak, Anda perlu menyesuaikan query Prisma Anda (misalnya dengan 'include')
            // agar KodeReferensi ikut terbawa.
        } : null,
        mataKuliah: bkmk.mataKuliah ? {
            idmk: bkmk.mataKuliah.IDMK,
            namaMk: bkmk.mataKuliah.NamaMK,
            // Tambahkan properti lain yang dibutuhkan oleh MataKuliahResponse di sini
        } : null,
    };
}
