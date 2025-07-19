import { z, ZodType } from "zod";
import {
    CreateMataKuliahRequest, UpdateMataKuliahRequest, SearchMataKuliahRequest,
} from "../model/mata-kuliah-model";

const PAGE_SIZE_SCHEMA = z.number().min(1).max(100).positive().default(10).optional();
const PAGE_SCHEMA = z.number().min(1).positive().default(1).optional();
const UUID_SCHEMA = z.string().uuid();
const IDMK_CODE_SCHEMA = z.string().min(1).max(50); // For IDMK like "P001"

export class MataKuliahValidation {
    static readonly CREATE: ZodType<CreateMataKuliahRequest> = z.object({
        idmk: IDMK_CODE_SCHEMA,
        namaMk: z.string().min(1).max(255),
        kodeSemester: UUID_SCHEMA.optional(),
        jenisMKId: UUID_SCHEMA.optional(),
        kelompokMKId: UUID_SCHEMA.optional(),
        lingkupKelasId: UUID_SCHEMA.optional(),
        modeKuliahId: UUID_SCHEMA.optional(),
        metodePembelajaranId: UUID_SCHEMA.optional(),
    });

    static readonly UPDATE: ZodType<UpdateMataKuliahRequest> = z.object({
        namaMk: z.string().min(1).max(255).optional(),
        kodeSemester: UUID_SCHEMA.nullable().optional(),
        jenisMKId: UUID_SCHEMA.nullable().optional(),
        kelompokMKId: UUID_SCHEMA.nullable().optional(),
        lingkupKelasId: UUID_SCHEMA.nullable().optional(),
        modeKuliahId: UUID_SCHEMA.nullable().optional(),
        metodePembelajaranId: UUID_SCHEMA.nullable().optional(),
    });

    static readonly SEARCH: ZodType<SearchMataKuliahRequest> = z.object({
        idmk: IDMK_CODE_SCHEMA.optional(),
        namaMk: z.string().max(255).optional(),
        kodeSemester: UUID_SCHEMA.optional(),
        jenisMKId: UUID_SCHEMA.optional(),
        kelompokMKId: UUID_SCHEMA.optional(),
        lingkupKelasId: UUID_SCHEMA.optional(),
        modeKuliahId: UUID_SCHEMA.optional(),
        metodePembelajaranId: UUID_SCHEMA.optional(),
        page: PAGE_SCHEMA,
        size: PAGE_SIZE_SCHEMA,
    });

    static readonly IDMK: ZodType<string> = IDMK_CODE_SCHEMA;
}