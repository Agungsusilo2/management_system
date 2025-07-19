"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MataKuliahValidation = void 0;
const zod_1 = require("zod");
const PAGE_SIZE_SCHEMA = zod_1.z.number().min(1).max(100).positive().default(10).optional();
const PAGE_SCHEMA = zod_1.z.number().min(1).positive().default(1).optional();
const UUID_SCHEMA = zod_1.z.string().uuid();
const IDMK_CODE_SCHEMA = zod_1.z.string().min(1).max(50); // For IDMK like "P001"
class MataKuliahValidation {
}
exports.MataKuliahValidation = MataKuliahValidation;
MataKuliahValidation.CREATE = zod_1.z.object({
    idmk: IDMK_CODE_SCHEMA,
    namaMk: zod_1.z.string().min(1).max(255),
    kodeSemester: UUID_SCHEMA.optional(),
    jenisMKId: UUID_SCHEMA.optional(),
    kelompokMKId: UUID_SCHEMA.optional(),
    lingkupKelasId: UUID_SCHEMA.optional(),
    modeKuliahId: UUID_SCHEMA.optional(),
    metodePembelajaranId: UUID_SCHEMA.optional(),
});
MataKuliahValidation.UPDATE = zod_1.z.object({
    namaMk: zod_1.z.string().min(1).max(255).optional(),
    kodeSemester: UUID_SCHEMA.nullable().optional(),
    jenisMKId: UUID_SCHEMA.nullable().optional(),
    kelompokMKId: UUID_SCHEMA.nullable().optional(),
    lingkupKelasId: UUID_SCHEMA.nullable().optional(),
    modeKuliahId: UUID_SCHEMA.nullable().optional(),
    metodePembelajaranId: UUID_SCHEMA.nullable().optional(),
});
MataKuliahValidation.SEARCH = zod_1.z.object({
    idmk: IDMK_CODE_SCHEMA.optional(),
    namaMk: zod_1.z.string().max(255).optional(),
    kodeSemester: UUID_SCHEMA.optional(),
    jenisMKId: UUID_SCHEMA.optional(),
    kelompokMKId: UUID_SCHEMA.optional(),
    lingkupKelasId: UUID_SCHEMA.optional(),
    modeKuliahId: UUID_SCHEMA.optional(),
    metodePembelajaranId: UUID_SCHEMA.optional(),
    page: PAGE_SCHEMA,
    size: PAGE_SIZE_SCHEMA,
});
MataKuliahValidation.IDMK = IDMK_CODE_SCHEMA;
