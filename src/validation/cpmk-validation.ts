
import { z, ZodType } from "zod";
import { CreateCPMKRequest, UpdateCPMKRequest, SearchCPMKRequest } from "../model/cpmk-model";

export class CPMKValidation {
    static readonly CREATE: ZodType<CreateCPMKRequest> = z.object({
        kodeCPMK: z.string().max(50),
        namaCPMK: z.string().min(1).max(255),
        subCPMKId: z.string().max(50),
    });

    static readonly UPDATE: ZodType<UpdateCPMKRequest> = z.object({
        namaCPMK: z.string().min(1).max(255).optional(),
        subCPMKId: z.string().max(50).optional(),
    });

    static readonly KODE_CPMK: ZodType<string> = z.string().max(50);

    static readonly SEARCH: ZodType<SearchCPMKRequest> = z.object({
        namaCPMK: z.string().max(255).optional(),
        subCPMKId: z.string().max(50).optional(),
        page: z.number().min(1).positive().default(1).optional(),
        size: z.number().min(1).max(100).positive().default(10).optional(),
    });
}