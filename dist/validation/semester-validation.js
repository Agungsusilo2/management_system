"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SemesterValidation = void 0;
const zod_1 = __importDefault(require("zod"));
class SemesterValidation {
}
exports.SemesterValidation = SemesterValidation;
SemesterValidation.CREATE = zod_1.default.object({
    semesterInt: zod_1.default.number().int().min(1),
});
SemesterValidation.UPDATE = zod_1.default.object({
    semesterInt: zod_1.default.number().int().min(1).optional(),
});
SemesterValidation.SEARCH = zod_1.default.object({
    semesterInt: zod_1.default.number().int().min(1).optional(),
    page: zod_1.default.number().min(1).positive().default(1).optional(),
    size: zod_1.default.number().min(1).max(100).positive().default(10).optional(),
});
SemesterValidation.KODE_SEMESTER = zod_1.default.string().uuid();
