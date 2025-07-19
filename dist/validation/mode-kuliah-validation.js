"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModeKuliahValidation = void 0;
const zod_1 = require("zod");
class ModeKuliahValidation {
}
exports.ModeKuliahValidation = ModeKuliahValidation;
ModeKuliahValidation.CREATE = zod_1.z.object({
    namaModeKuliah: zod_1.z.string().min(1).max(50),
});
ModeKuliahValidation.UPDATE = zod_1.z.object({
    namaModeKuliah: zod_1.z.string().min(1).max(50).optional(),
});
ModeKuliahValidation.SEARCH = zod_1.z.object({
    namaModeKuliah: zod_1.z.string().max(50).optional(),
    page: zod_1.z.number().min(1).positive().default(1).optional(),
    size: zod_1.z.number().min(1).max(100).positive().default(10).optional(),
});
ModeKuliahValidation.ID_MODE_KULIAH = zod_1.z.string().uuid();
