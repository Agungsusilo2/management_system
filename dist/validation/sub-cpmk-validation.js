"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubCPMKValidation = void 0;
const zod_1 = require("zod");
class SubCPMKValidation {
}
exports.SubCPMKValidation = SubCPMKValidation;
SubCPMKValidation.CREATE = zod_1.z.object({
    subCPMKId: zod_1.z.string().max(50),
    uraianSubCPMK: zod_1.z.string().min(1).max(255),
});
SubCPMKValidation.UPDATE = zod_1.z.object({
    uraianSubCPMK: zod_1.z.string().min(1).max(255).optional(),
});
SubCPMKValidation.SUB_CPMK_ID = zod_1.z.string().max(50);
SubCPMKValidation.SEARCH = zod_1.z.object({
    uraianSubCPMK: zod_1.z.string().max(255).optional(),
    page: zod_1.z.number().min(1).positive().default(1).optional(),
    size: zod_1.z.number().min(1).max(100).positive().default(10).optional(),
});
