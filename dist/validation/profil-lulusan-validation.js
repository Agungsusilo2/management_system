"use strict";
// src/validation/profil-lulusan-validation.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfilLulusanValidation = void 0;
const zod_1 = require("zod");
class ProfilLulusanValidation {
}
exports.ProfilLulusanValidation = ProfilLulusanValidation;
ProfilLulusanValidation.CREATE = zod_1.z.object({
    kodePL: zod_1.z.string().max(50), // Sesuai @db.VarChar(50)
    deskripsi: zod_1.z.string().min(1).max(255), // Sesuaikan dengan @db.VarChar(255)
    kodeProfesi: zod_1.z.string().max(50).optional(), // Sesuai @db.VarChar(50)
});
ProfilLulusanValidation.UPDATE = zod_1.z.object({
    deskripsi: zod_1.z.string().min(1).max(255).optional(),
    kodeProfesi: zod_1.z.string().max(50).optional(),
});
ProfilLulusanValidation.KODE_PL = zod_1.z.string().max(50); // Untuk ID di params
ProfilLulusanValidation.SEARCH = zod_1.z.object({
    deskripsi: zod_1.z.string().max(255).optional(),
    kodeProfesi: zod_1.z.string().max(50).optional(),
    page: zod_1.z.number().min(1).positive().default(1).optional(),
    size: zod_1.z.number().min(1).max(100).positive().default(10).optional(),
});
