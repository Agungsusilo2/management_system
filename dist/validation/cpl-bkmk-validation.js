"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CPLBKMKValidation = void 0;
const zod_1 = require("zod");
class CPLBKMKValidation {
}
exports.CPLBKMKValidation = CPLBKMKValidation;
CPLBKMKValidation.LINK_UNLINK = zod_1.z.object({
    kodeCPL: zod_1.z.string().max(50),
    kodeBK: zod_1.z.string().max(50),
    idmk: zod_1.z.string().max(50),
});
CPLBKMKValidation.SEARCH = zod_1.z.object({
    kodeCPL: zod_1.z.string().max(50).optional(),
    kodeBK: zod_1.z.string().max(50).optional(),
    idmk: zod_1.z.string().max(50).optional(),
    page: zod_1.z.number().min(1).positive().default(1).optional(),
    size: zod_1.z.number().min(1).max(100).positive().default(10).optional(),
});
