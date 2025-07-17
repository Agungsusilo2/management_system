
import { z, ZodType } from "zod";
import { CreateCPLProdiRequest, UpdateCPLProdiRequest, SearchCPLProdiRequest } from "../model/cpl-prodi-model";

export class CPLProdiValidation {
    static readonly CREATE: ZodType<CreateCPLProdiRequest> = z.object({
        kodeCPL: z.string().max(50),
        deskripsiCPL: z.string().min(1).max(1000),
        kodeAspek: z.string().max(50).optional(),
    });

    static readonly UPDATE: ZodType<UpdateCPLProdiRequest> = z.object({
        deskripsiCPL: z.string().min(1).max(1000).optional(),
        kodeAspek: z.string().max(50).optional(),
    });

    static readonly KODE_CPL: ZodType<string> = z.string().max(50);

    static readonly SEARCH: ZodType<SearchCPLProdiRequest> = z.object({
        deskripsiCPL: z.string().max(1000).optional(),
        kodeAspek: z.string().max(50).optional(),
        page: z.number().min(1).positive().default(1).optional(),
        size: z.number().min(1).max(100).positive().default(10).optional(),
    });
}