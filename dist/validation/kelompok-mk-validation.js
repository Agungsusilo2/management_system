"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KelompokMKValidation = void 0;
const zod_1 = require("zod");
class KelompokMKValidation {
}
exports.KelompokMKValidation = KelompokMKValidation;
KelompokMKValidation.CREATE = zod_1.z.object({
    namaKelompokMk: zod_1.z.string().min(1).max(50),
});
KelompokMKValidation.UPDATE = zod_1.z.object({
    namaKelompokMk: zod_1.z.string().min(1).max(50).optional(),
});
KelompokMKValidation.SEARCH = zod_1.z.object({
    namaKelompokMk: zod_1.z.string().max(50).optional(),
    page: zod_1.z.number().min(1).positive().default(1).optional(),
    size: zod_1.z.number().min(1).max(100).positive().default(10).optional(),
});
KelompokMKValidation.ID_KELOMPOK_MK = zod_1.z.string().uuid();
