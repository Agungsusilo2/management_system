"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CPLProdiValidation = void 0;
const zod_1 = require("zod");
class CPLProdiValidation {
}
exports.CPLProdiValidation = CPLProdiValidation;
CPLProdiValidation.CREATE = zod_1.z.object({
    kodeCPL: zod_1.z.string().max(50),
    deskripsiCPL: zod_1.z.string().min(1).max(1000),
    kodeAspek: zod_1.z.string().max(50).optional(),
});
CPLProdiValidation.UPDATE = zod_1.z.object({
    deskripsiCPL: zod_1.z.string().min(1).max(1000).optional(),
    kodeAspek: zod_1.z.string().max(50).optional(),
});
CPLProdiValidation.KODE_CPL = zod_1.z.string().max(50);
CPLProdiValidation.SEARCH = zod_1.z.object({
    deskripsiCPL: zod_1.z.string().max(1000).optional(),
    kodeAspek: zod_1.z.string().max(50).optional(),
    page: zod_1.z.number().min(1).positive().default(1).optional(),
    size: zod_1.z.number().min(1).max(100).positive().default(10).optional(),
});
