"use strict";
// src/validation/cpl-pl-validation.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.CPLPLValidation = void 0;
const zod_1 = require("zod");
class CPLPLValidation {
}
exports.CPLPLValidation = CPLPLValidation;
// Validasi untuk membuat/menghapus tautan
CPLPLValidation.LINK_UNLINK = zod_1.z.object({
    kodeCPL: zod_1.z.string().max(50),
    kodePL: zod_1.z.string().max(50),
});
CPLPLValidation.SEARCH = zod_1.z.object({
    kodeCPL: zod_1.z.string().max(50).optional(),
    kodePL: zod_1.z.string().max(50).optional(),
    page: zod_1.z.number().min(1).positive().default(1).optional(),
    size: zod_1.z.number().min(1).max(100).positive().default(10).optional(),
});
