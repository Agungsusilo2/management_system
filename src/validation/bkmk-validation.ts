
import { z, ZodType } from "zod";
import { CreateBKMKRequest, DeleteBKMKRequest, SearchBKMKRequest } from "../model/bkmk-model";

export class BKMKValidation {
    static readonly LINK_UNLINK: ZodType<CreateBKMKRequest | DeleteBKMKRequest> = z.object({
        kodeBK: z.string().max(50),
        idmk: z.string().max(50),
    });

    static readonly SEARCH: ZodType<SearchBKMKRequest> = z.object({
        kodeBK: z.string().max(50).optional(),
        idmk: z.string().max(50).optional(),
        page: z.number().min(1).positive().default(1).optional(),
        size: z.number().min(1).max(100).positive().default(10).optional(),
    });
}