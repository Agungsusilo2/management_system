"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AspekValidation = void 0;
const zod_1 = require("zod");
class AspekValidation {
}
exports.AspekValidation = AspekValidation;
AspekValidation.CREATE = zod_1.z.object({
    kodeAspek: zod_1.z.string().max(50),
    namaAspek: zod_1.z.string().min(1).max(255),
});
AspekValidation.UPDATE = zod_1.z.object({
    namaAspek: zod_1.z.string().min(1).max(255).optional(),
});
AspekValidation.KODE_ASPEK = zod_1.z.string().max(50);
AspekValidation.SEARCH = zod_1.z.object({
    namaAspek: zod_1.z.string().max(255).optional(),
    page: zod_1.z.number().min(1).positive().default(1).optional(),
    size: zod_1.z.number().min(1).max(100).positive().default(10).optional(),
});
