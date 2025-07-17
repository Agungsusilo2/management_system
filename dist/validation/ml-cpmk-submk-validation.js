"use strict";
// src/validation/ml-cpmk-submk-validation.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.MLCPMKSubMKValidation = void 0;
const zod_1 = require("zod");
class MLCPMKSubMKValidation {
}
exports.MLCPMKSubMKValidation = MLCPMKSubMKValidation;
// Validasi untuk membuat/menghapus tautan
MLCPMKSubMKValidation.LINK_UNLINK = zod_1.z.object({
    idmk: zod_1.z.string().max(50),
    kodeCPMK: zod_1.z.string().max(50),
    subCPMKId: zod_1.z.string().max(50),
});
MLCPMKSubMKValidation.SEARCH = zod_1.z.object({
    idmk: zod_1.z.string().max(50).optional(),
    kodeCPMK: zod_1.z.string().max(50).optional(),
    subCPMKId: zod_1.z.string().max(50).optional(),
    page: zod_1.z.number().min(1).positive().default(1).optional(),
    size: zod_1.z.number().min(1).max(100).positive().default(10).optional(),
});
