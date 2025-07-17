"use strict";
// src/validation/admin-validation.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminValidation = void 0;
const zod_1 = require("zod");
class AdminValidation {
}
exports.AdminValidation = AdminValidation;
// Validasi untuk membuat Admin (sudah ada)
AdminValidation.CREATE = zod_1.z.object({
    // Jika endpoint create admin juga membuat user, tambahkan di sini:
    // username: z.string().min(3).max(50),
    // password: z.string().min(8),
    // email: z.string().email().max(100),
    // fullName: z.string().min(1).max(255),
    nipAdmin: zod_1.z.string().max(50).optional(),
    jabatan: zod_1.z.string().max(100).optional(),
    phoneNumber: zod_1.z.string().max(20).optional(),
    address: zod_1.z.string().max(500).optional(),
});
// --- SKEMA BARU UNTUK UPDATE ---
AdminValidation.UPDATE = zod_1.z.object({
    // Semua field opsional karena update bisa parsial
    nipAdmin: zod_1.z.string().max(50).optional(),
    jabatan: zod_1.z.string().max(100).optional(),
    phoneNumber: zod_1.z.string().max(20).optional(),
    address: zod_1.z.string().max(500).optional(),
});
// --- SKEMA BARU UNTUK SEARCH/LIST ---
AdminValidation.SEARCH = zod_1.z.object({
    nipAdmin: zod_1.z.string().max(50).optional(),
    jabatan: zod_1.z.string().max(100).optional(),
    page: zod_1.z.number().min(1).positive().default(1).optional(), // Halaman minimal 1, positif
    size: zod_1.z.number().min(1).max(100).positive().default(10).optional(), // Ukuran minimal 1, maksimal 100
});
// Validasi untuk ID (digunakan di get, update, delete)
AdminValidation.ADMIN_ID = zod_1.z.string().min(1).max(100); // Sesuaikan panjang dengan @db.VarChar(100)
