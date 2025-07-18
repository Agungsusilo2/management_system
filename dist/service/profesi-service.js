"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfesiService = void 0;
const profesi_model_1 = require("../model/profesi-model");
const validation_1 = require("../validation/validation");
const profesi_validation_1 = require("../validation/profesi-validation");
const database_1 = require("../application/database");
const response_error_1 = require("../error/response-error");
const zod_1 = require("zod");
class ProfesiService {
    static update(kodeProfesi, request) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            kodeProfesi = validation_1.Validation.validate(profesi_validation_1.ProfesiValidation.KODE_PROFESI, kodeProfesi);
            const updateRequest = validation_1.Validation.validate(profesi_validation_1.ProfesiValidation.UPDATE, request);
            const existingProfesi = yield database_1.prismaClient.profesi.findUnique({
                where: { KodeProfesi: kodeProfesi }
            });
            if (!existingProfesi) {
                throw new response_error_1.ResponseError(404, "Profesi not found");
            }
            const updatedProfesi = yield database_1.prismaClient.profesi.update({
                where: { KodeProfesi: kodeProfesi },
                data: {
                    Profesi: (_a = updateRequest.namaProfesi) !== null && _a !== void 0 ? _a : existingProfesi.Profesi,
                }
            });
            return (0, profesi_model_1.toProfesiResponse)(updatedProfesi);
        });
    }
    static remove(kodeProfesi) {
        return __awaiter(this, void 0, void 0, function* () {
            kodeProfesi = validation_1.Validation.validate(profesi_validation_1.ProfesiValidation.KODE_PROFESI, kodeProfesi);
            const existingProfesiCount = yield database_1.prismaClient.profesi.count({
                where: { KodeProfesi: kodeProfesi }
            });
            if (existingProfesiCount === 0) {
                throw new response_error_1.ResponseError(404, "Profesi not found");
            }
            const profilLulusanCount = yield database_1.prismaClient.profilLulusan.count({
                where: { KodeProfesi: kodeProfesi }
            });
            if (profilLulusanCount > 0) {
                throw new response_error_1.ResponseError(400, "Cannot delete Profesi: still referenced by Profil Lulusan");
            }
            yield database_1.prismaClient.profesi.delete({
                where: { KodeProfesi: kodeProfesi }
            });
        });
    }
    static get(kodeProfesi) {
        return __awaiter(this, void 0, void 0, function* () {
            kodeProfesi = validation_1.Validation.validate(profesi_validation_1.ProfesiValidation.KODE_PROFESI, kodeProfesi);
            const profesi = yield database_1.prismaClient.profesi.findUnique({
                where: { KodeProfesi: kodeProfesi }
            });
            if (!profesi) {
                throw new response_error_1.ResponseError(404, "Profesi not found");
            }
            return (0, profesi_model_1.toProfesiResponse)(profesi);
        });
    }
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const profesi = yield database_1.prismaClient.profesi.findMany();
            return profesi.map((data) => (0, profesi_model_1.toProfesiResponse)(data));
        });
    }
    static create(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const createRequest = zod_1.z.object({
                KodeProfesi: zod_1.z.string().max(50),
                Profesi: zod_1.z.string().min(1).max(255),
            }).parse(request);
            const existingCount = yield database_1.prismaClient.profesi.count({ where: { KodeProfesi: createRequest.KodeProfesi } });
            if (existingCount > 0) {
                throw new response_error_1.ResponseError(400, "Profesi with this ID already exists");
            }
            const newProfesi = yield database_1.prismaClient.profesi.create({ data: createRequest });
            return (0, profesi_model_1.toProfesiResponse)(newProfesi);
        });
    }
}
exports.ProfesiService = ProfesiService;
