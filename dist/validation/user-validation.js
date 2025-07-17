"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
class UserValidation {
}
exports.UserValidation = UserValidation;
UserValidation.REGISTER = zod_1.z.object({
    username: zod_1.z.string().min(3).max(100),
    password_hash: zod_1.z.string().min(8).max(100),
    email: zod_1.z.string().email().max(100),
    full_name: zod_1.z.string().min(1).max(255),
    user_type: zod_1.z.enum(['Admin', 'Dosen', 'Mahasiswa']),
});
UserValidation.LOGIN = zod_1.z.object({
    username: zod_1.z.string().min(3).max(100),
    password_hash: zod_1.z.string().min(8).max(100),
});
UserValidation.UPDATE = zod_1.z.object({
    username: zod_1.z.string().min(3).max(100).optional(),
    password_hash: zod_1.z.string().min(8).max(100).optional(),
    email: zod_1.z.string().email().max(100).optional(),
    full_name: zod_1.z.string().min(1).max(255).optional(),
    is_active: zod_1.z.boolean().optional()
});
