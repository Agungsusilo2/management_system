
import { z, ZodType } from "zod";
import { CreateCPLPLRequest, DeleteCPLPLRequest, SearchCPLPLRequest } from "../model/cpl-pl-model";

export class CPLPLValidation {
    static readonly LINK_UNLINK: ZodType<CreateCPLPLRequest | DeleteCPLPLRequest> = z.object({
        kodeCPL: z.string().max(50),
        kodePL: z.string().max(50),
    });

    static readonly SEARCH: ZodType<SearchCPLPLRequest> = z.object({
        kodeCPL: z.string().max(50).optional(),
        kodePL: z.string().max(50).optional(),
        page: z.number().min(1).positive().default(1).optional(),
        size: z.number().min(1).max(100).positive().default(10).optional(),
    });
}