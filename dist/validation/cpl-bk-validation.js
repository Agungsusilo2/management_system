"use strict";
// src/validation/cpl-bk-validation.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.CPLBKValidation = void 0;
const zod_1 = require("zod");
class CPLBKValidation {
}
exports.CPLBKValidation = CPLBKValidation;
// Validasi untuk membuat/menghapus tautan
CPLBKValidation.LINK_UNLINK = zod_1.z.object({
    kodeCPL: zod_1.z.string().max(50),
    kodeBK: zod_1.z.string().max(50),
});
CPLBKValidation.SEARCH = zod_1.z.object({
    kodeCPL: zod_1.z.string().max(50).optional(),
    kodeBK: zod_1.z.string().max(50).optional(),
    page: zod_1.z.number().min(1).positive().default(1).optional(),
    size: zod_1.z.number().min(1).max(100).positive().default(10).optional(),
});
