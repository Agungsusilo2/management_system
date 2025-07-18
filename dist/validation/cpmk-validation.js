"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CPMKValidation = void 0;
const zod_1 = require("zod");
class CPMKValidation {
}
exports.CPMKValidation = CPMKValidation;
CPMKValidation.CREATE = zod_1.z.object({
    kodeCPMK: zod_1.z.string().max(50),
    namaCPMK: zod_1.z.string().min(1).max(255),
    subCPMKId: zod_1.z.string().max(50),
});
CPMKValidation.UPDATE = zod_1.z.object({
    namaCPMK: zod_1.z.string().min(1).max(255).optional(),
    subCPMKId: zod_1.z.string().max(50).optional(),
});
CPMKValidation.KODE_CPMK = zod_1.z.string().max(50);
CPMKValidation.SEARCH = zod_1.z.object({
    namaCPMK: zod_1.z.string().max(255).optional(),
    subCPMKId: zod_1.z.string().max(50).optional(),
    page: zod_1.z.number().min(1).positive().default(1).optional(),
    size: zod_1.z.number().min(1).max(100).positive().default(10).optional(),
});
