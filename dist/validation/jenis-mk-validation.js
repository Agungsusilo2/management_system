"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JenisMKValidation = void 0;
const zod_1 = require("zod");
class JenisMKValidation {
}
exports.JenisMKValidation = JenisMKValidation;
JenisMKValidation.CREATE = zod_1.z.object({
    namaJenisMk: zod_1.z.string().min(1).max(50),
});
JenisMKValidation.UPDATE = zod_1.z.object({
    namaJenisMk: zod_1.z.string().min(1).max(50).optional(),
});
JenisMKValidation.SEARCH = zod_1.z.object({
    namaJenisMk: zod_1.z.string().max(50).optional(),
    page: zod_1.z.number().min(1).positive().default(1).optional(),
    size: zod_1.z.number().min(1).max(100).positive().default(10).optional(),
});
JenisMKValidation.ID_JENIS_MK = zod_1.z.string().uuid();
