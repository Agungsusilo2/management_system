"use strict";
// src/validation/bahan-kajian-validation.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.BahanKajianValidation = void 0;
const zod_1 = require("zod");
class BahanKajianValidation {
}
exports.BahanKajianValidation = BahanKajianValidation;
BahanKajianValidation.CREATE = zod_1.z.object({
    kodeBK: zod_1.z.string().max(50),
    namaBahanKajian: zod_1.z.string().min(1).max(255),
    kodeReferensi: zod_1.z.string().max(50), // Wajib
});
BahanKajianValidation.UPDATE = zod_1.z.object({
    namaBahanKajian: zod_1.z.string().min(1).max(255).optional(),
    kodeReferensi: zod_1.z.string().max(50).optional(),
});
BahanKajianValidation.KODE_BK = zod_1.z.string().max(50);
BahanKajianValidation.SEARCH = zod_1.z.object({
    namaBahanKajian: zod_1.z.string().max(255).optional(),
    kodeReferensi: zod_1.z.string().max(50).optional(),
    page: zod_1.z.number().min(1).positive().default(1).optional(),
    size: zod_1.z.number().min(1).max(100).positive().default(10).optional(),
});
