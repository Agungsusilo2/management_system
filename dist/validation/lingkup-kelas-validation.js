"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LingkupKelasValidation = void 0;
const zod_1 = require("zod");
class LingkupKelasValidation {
}
exports.LingkupKelasValidation = LingkupKelasValidation;
LingkupKelasValidation.CREATE = zod_1.z.object({
    namaLingkupKelas: zod_1.z.string().min(1).max(50),
});
LingkupKelasValidation.UPDATE = zod_1.z.object({
    namaLingkupKelas: zod_1.z.string().min(1).max(50).optional(),
});
LingkupKelasValidation.SEARCH = zod_1.z.object({
    namaLingkupKelas: zod_1.z.string().max(50).optional(),
    page: zod_1.z.number().min(1).positive().default(1).optional(),
    size: zod_1.z.number().min(1).max(100).positive().default(10).optional(),
});
LingkupKelasValidation.ID_LINGKUP_KELAS = zod_1.z.string().uuid();
