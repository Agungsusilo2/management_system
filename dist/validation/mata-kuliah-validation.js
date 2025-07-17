"use strict";
// src/validation/mata-kuliah-validation.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.MataKuliahValidation = void 0;
const zod_1 = require("zod");
class MataKuliahValidation {
}
exports.MataKuliahValidation = MataKuliahValidation;
MataKuliahValidation.CREATE = zod_1.z.object({
    idmk: zod_1.z.string().max(50),
    namaMk: zod_1.z.string().min(1).max(255),
});
MataKuliahValidation.UPDATE = zod_1.z.object({
    namaMk: zod_1.z.string().min(1).max(255).optional(),
});
MataKuliahValidation.IDMK = zod_1.z.string().max(50);
MataKuliahValidation.SEARCH = zod_1.z.object({
    namaMk: zod_1.z.string().max(255).optional(),
    page: zod_1.z.number().min(1).positive().default(1).optional(),
    size: zod_1.z.number().min(1).max(100).positive().default(10).optional(),
});
