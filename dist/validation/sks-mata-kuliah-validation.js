"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SKSMataKuliahValidation = void 0;
const zod_1 = require("zod");
class SKSMataKuliahValidation {
}
exports.SKSMataKuliahValidation = SKSMataKuliahValidation;
SKSMataKuliahValidation.CREATE = zod_1.z.object({
    bobotTatapMuka: zod_1.z.number().int().min(0),
    bobotPraktikum: zod_1.z.number().int().min(0),
    bobotPraktekLapangan: zod_1.z.number().int().min(0),
    bobotSimulasi: zod_1.z.number().int().min(0),
    idmk: zod_1.z.string().min(1).max(255),
});
SKSMataKuliahValidation.UPDATE = zod_1.z.object({
    bobotTatapMuka: zod_1.z.number().int().min(0).optional(),
    bobotPraktikum: zod_1.z.number().int().min(0).optional(),
    bobotPraktekLapangan: zod_1.z.number().int().min(0).optional(),
    bobotSimulasi: zod_1.z.number().int().min(0).optional(),
    idmk: zod_1.z.string().min(1).max(255).optional(), // FK to MataKuliah
});
SKSMataKuliahValidation.SEARCH = zod_1.z.object({
    idmk: zod_1.z.string().min(1).max(255).optional(),
    page: zod_1.z.number().min(1).positive().default(1).optional(),
    size: zod_1.z.number().min(1).max(100).positive().default(10).optional(),
});
SKSMataKuliahValidation.KODE_SKS = zod_1.z.string().uuid();
