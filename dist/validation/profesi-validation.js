"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfesiValidation = void 0;
const zod_1 = require("zod");
class ProfesiValidation {
}
exports.ProfesiValidation = ProfesiValidation;
ProfesiValidation.UPDATE = zod_1.z.object({
    namaProfesi: zod_1.z.string().min(1).max(255).optional(),
});
ProfesiValidation.KODE_PROFESI = zod_1.z.string().max(50);
