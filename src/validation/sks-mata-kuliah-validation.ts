import {
    CreateSKSMataKuliahRequest,
    SearchSKSMataKuliahRequest,
    UpdateSKSMataKuliahRequest
} from "../model/sks-matakuliah-model";
import {z, ZodType} from "zod";

export class SKSMataKuliahValidation {
    static readonly CREATE: ZodType<CreateSKSMataKuliahRequest> = z.object({
        bobotTatapMuka: z.number().int().min(0),
        bobotPraktikum: z.number().int().min(0),
        bobotPraktekLapangan: z.number().int().min(0),
        bobotSimulasi: z.number().int().min(0),
        idmk: z.string().min(1).max(255),
    });

    static readonly UPDATE: ZodType<UpdateSKSMataKuliahRequest> = z.object({
        bobotTatapMuka: z.number().int().min(0).optional(),
        bobotPraktikum: z.number().int().min(0).optional(),
        bobotPraktekLapangan: z.number().int().min(0).optional(),
        bobotSimulasi: z.number().int().min(0).optional(),
        idmk: z.string().min(1).max(255).optional(), // FK to MataKuliah
    });

    static readonly SEARCH: ZodType<SearchSKSMataKuliahRequest> = z.object({
        idmk: z.string().min(1).max(255).optional(),
        page: z.number().min(1).positive().default(1).optional(),
        size: z.number().min(1).max(100).positive().default(10).optional(),
    });

    static readonly KODE_SKS: ZodType<string> = z.string().uuid();
}
