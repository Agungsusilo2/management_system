"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetodePembelajaranValidation = void 0;
const zod_1 = require("zod");
class MetodePembelajaranValidation {
}
exports.MetodePembelajaranValidation = MetodePembelajaranValidation;
MetodePembelajaranValidation.CREATE = zod_1.z.object({
    namaMetodePembelajaran: zod_1.z.string().min(1).max(100),
});
MetodePembelajaranValidation.UPDATE = zod_1.z.object({
    namaMetodePembelajaran: zod_1.z.string().min(1).max(100).optional(),
});
MetodePembelajaranValidation.SEARCH = zod_1.z.object({
    namaMetodePembelajaran: zod_1.z.string().max(100).optional(),
    page: zod_1.z.number().min(1).positive().default(1).optional(),
    size: zod_1.z.number().min(1).max(100).positive().default(10).optional(),
});
MetodePembelajaranValidation.ID_METODE_PEMBELAJARAN = zod_1.z.string().uuid();
