
import { z, ZodType } from "zod";
import { CreateMataKuliahRequest, UpdateMataKuliahRequest, SearchMataKuliahRequest } from "../model/mata-kuliah-model";

export class MataKuliahValidation {
    static readonly CREATE: ZodType<CreateMataKuliahRequest> = z.object({
        idmk: z.string().max(50),
        namaMk: z.string().min(1).max(255),
    });

    static readonly UPDATE: ZodType<UpdateMataKuliahRequest> = z.object({
        namaMk: z.string().min(1).max(255).optional(),
    });

    static readonly IDMK: ZodType<string> = z.string().max(50);

    static readonly SEARCH: ZodType<SearchMataKuliahRequest> = z.object({
        namaMk: z.string().max(255).optional(),
        page: z.number().min(1).positive().default(1).optional(),
        size: z.number().min(1).max(100).positive().default(10).optional(),
    });
}