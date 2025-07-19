import {CreateModeKuliahRequest, SearchModeKuliahRequest, UpdateModeKuliahRequest} from "../model/mode-kuliah";
import {z, ZodType} from "zod";

export class ModeKuliahValidation {
    static readonly CREATE: ZodType<CreateModeKuliahRequest> = z.object({
        namaModeKuliah: z.string().min(1).max(50),
    });

    static readonly UPDATE: ZodType<UpdateModeKuliahRequest> = z.object({
        namaModeKuliah: z.string().min(1).max(50).optional(),
    });

    static readonly SEARCH: ZodType<SearchModeKuliahRequest> = z.object({
        namaModeKuliah: z.string().max(50).optional(),
        page: z.number().min(1).positive().default(1).optional(),
        size: z.number().min(1).max(100).positive().default(10).optional(),
    });

    static readonly ID_MODE_KULIAH: ZodType<string> = z.string().uuid();
}