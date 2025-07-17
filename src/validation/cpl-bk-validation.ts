
import { z, ZodType } from "zod";
import { CreateCPLBKRequest, DeleteCPLBKRequest, SearchCPLBKRequest } from "../model/cpl-bk-model";

export class CPLBKValidation {
    static readonly LINK_UNLINK: ZodType<CreateCPLBKRequest | DeleteCPLBKRequest> = z.object({
        kodeCPL: z.string().max(50),
        kodeBK: z.string().max(50),
    });

    static readonly SEARCH: ZodType<SearchCPLBKRequest> = z.object({
        kodeCPL: z.string().max(50).optional(),
        kodeBK: z.string().max(50).optional(),
        page: z.number().min(1).positive().default(1).optional(),
        size: z.number().min(1).max(100).positive().default(10).optional(),
    });
}