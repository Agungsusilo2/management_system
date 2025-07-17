"use strict";
// src/validation/cpl-cpmk-mk-validation.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.CPLCPMKMKValidation = void 0;
const zod_1 = require("zod");
class CPLCPMKMKValidation {
}
exports.CPLCPMKMKValidation = CPLCPMKMKValidation;
// Validasi untuk membuat/menghapus tautan
CPLCPMKMKValidation.LINK_UNLINK = zod_1.z.object({
    kodeCPL: zod_1.z.string().max(50),
    kodeCPMK: zod_1.z.string().max(50),
    idmk: zod_1.z.string().max(50),
});
CPLCPMKMKValidation.SEARCH = zod_1.z.object({
    kodeCPL: zod_1.z.string().max(50).optional(),
    kodeCPMK: zod_1.z.string().max(50).optional(),
    idmk: zod_1.z.string().max(50).optional(),
    page: zod_1.z.number().min(1).positive().default(1).optional(),
    size: zod_1.z.number().min(1).max(100).positive().default(10).optional(),
});
