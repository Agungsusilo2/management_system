"use strict";
// src/validation/referensi-validation.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReferensiValidation = void 0;
const zod_1 = require("zod");
class ReferensiValidation {
}
exports.ReferensiValidation = ReferensiValidation;
ReferensiValidation.CREATE = zod_1.z.object({
    kodeReferensi: zod_1.z.string().max(50),
    namaReferensi: zod_1.z.string().min(1).max(255),
});
ReferensiValidation.UPDATE = zod_1.z.object({
    namaReferensi: zod_1.z.string().min(1).max(255).optional(),
});
ReferensiValidation.KODE_REFERENSI = zod_1.z.string().max(50);
ReferensiValidation.SEARCH = zod_1.z.object({
    namaReferensi: zod_1.z.string().max(255).optional(),
    page: zod_1.z.number().min(1).positive().default(1).optional(),
    size: zod_1.z.number().min(1).max(100).positive().default(10).optional(),
});
