"use strict";
// src/validation/bkmk-validation.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.BKMKValidation = void 0;
const zod_1 = require("zod");
class BKMKValidation {
}
exports.BKMKValidation = BKMKValidation;
// Validasi untuk membuat/menghapus tautan
BKMKValidation.LINK_UNLINK = zod_1.z.object({
    kodeBK: zod_1.z.string().max(50),
    idmk: zod_1.z.string().max(50),
});
BKMKValidation.SEARCH = zod_1.z.object({
    kodeBK: zod_1.z.string().max(50).optional(),
    idmk: zod_1.z.string().max(50).optional(),
    page: zod_1.z.number().min(1).positive().default(1).optional(),
    size: zod_1.z.number().min(1).max(100).positive().default(10).optional(),
});
