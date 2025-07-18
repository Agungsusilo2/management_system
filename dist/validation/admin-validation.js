"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminValidation = void 0;
const zod_1 = require("zod");
class AdminValidation {
}
exports.AdminValidation = AdminValidation;
AdminValidation.CREATE = zod_1.z.object({
    nipAdmin: zod_1.z.string().max(50).optional(),
    jabatan: zod_1.z.string().max(100).optional(),
    phoneNumber: zod_1.z.string().max(20).optional(),
    address: zod_1.z.string().max(500).optional(),
});
AdminValidation.UPDATE = zod_1.z.object({
    nipAdmin: zod_1.z.string().max(50).optional(),
    jabatan: zod_1.z.string().max(100).optional(),
    phoneNumber: zod_1.z.string().max(20).optional(),
    address: zod_1.z.string().max(500).optional(),
});
AdminValidation.SEARCH = zod_1.z.object({
    nipAdmin: zod_1.z.string().max(50).optional(),
    jabatan: zod_1.z.string().max(100).optional(),
    page: zod_1.z.number().min(1).positive().default(1).optional(),
    size: zod_1.z.number().min(1).max(100).positive().default(10).optional(),
});
AdminValidation.ADMIN_ID = zod_1.z.string().min(1).max(100);
