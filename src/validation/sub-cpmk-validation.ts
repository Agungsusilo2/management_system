
import { z, ZodType } from "zod";
import { CreateSubCPMKRequest, UpdateSubCPMKRequest, SearchSubCPMKRequest } from "../model/sub-cpmk-model";

export class SubCPMKValidation {
    static readonly CREATE: ZodType<CreateSubCPMKRequest> = z.object({
        subCPMKId: z.string().max(50),
        uraianSubCPMK: z.string().min(1).max(255),
    });

    static readonly UPDATE: ZodType<UpdateSubCPMKRequest> = z.object({
        uraianSubCPMK: z.string().min(1).max(255).optional(),
    });

    static readonly SUB_CPMK_ID: ZodType<string> = z.string().max(50);

    static readonly SEARCH: ZodType<SearchSubCPMKRequest> = z.object({
        uraianSubCPMK: z.string().max(255).optional(),
        page: z.number().min(1).positive().default(1).optional(),
        size: z.number().min(1).max(100).positive().default(10).optional(),
    });
}