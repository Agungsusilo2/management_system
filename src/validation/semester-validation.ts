import {CreateSemesterRequest, SearchSemesterRequest, UpdateSemesterRequest} from "../model/semester-model";
import z, {ZodType} from "zod";

export class SemesterValidation {
    static readonly CREATE: ZodType<CreateSemesterRequest> = z.object({
        semesterInt: z.number().int().min(1),
    });

    static readonly UPDATE: ZodType<UpdateSemesterRequest> = z.object({
        semesterInt: z.number().int().min(1).optional(),
    });

    static readonly SEARCH: ZodType<SearchSemesterRequest> = z.object({
        semesterInt: z.number().int().min(1).optional(),
        page: z.number().min(1).positive().default(1).optional(),
        size: z.number().min(1).max(100).positive().default(10).optional(),
    });

    static readonly KODE_SEMESTER: ZodType<string> = z.string().uuid();
}