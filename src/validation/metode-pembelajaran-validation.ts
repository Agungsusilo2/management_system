import {
    CreateMetodePembelajaranRequest,
    SearchMetodePembelajaranRequest,
    UpdateMetodePembelajaranRequest
} from "../model/metode-pembelajaran-model";
import {z, ZodType} from "zod";

export class MetodePembelajaranValidation {
    static readonly CREATE: ZodType<CreateMetodePembelajaranRequest> = z.object({
        namaMetodePembelajaran: z.string().min(1).max(100),
    });

    static readonly UPDATE: ZodType<UpdateMetodePembelajaranRequest> = z.object({
        namaMetodePembelajaran: z.string().min(1).max(100).optional(),
    });

    static readonly SEARCH: ZodType<SearchMetodePembelajaranRequest> = z.object({
        namaMetodePembelajaran: z.string().max(100).optional(),
        page: z.number().min(1).positive().default(1).optional(),
        size: z.number().min(1).max(100).positive().default(10).optional(),
    });

    static readonly ID_METODE_PEMBELAJARAN: ZodType<string> = z.string().uuid();
}