"use strict";
// src/service/profil-lulusan-service.ts
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
exports.ProfilLulusanService = void 0;
const profile_lulusan_model_1 = require("../model/profile-lulusan-model");
const validation_1 = require("../validation/validation");
const profil_lulusan_validation_1 = require("../validation/profil-lulusan-validation");
const database_1 = require("../application/database");
const response_error_1 = require("../error/response-error");
class ProfilLulusanService {
    // --- CREATE ---
    static create(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const createRequest = validation_1.Validation.validate(profil_lulusan_validation_1.ProfilLulusanValidation.CREATE, request);
            // Cek apakah ID sudah ada
            const existingPl = yield database_1.prismaClient.profilLulusan.count({
                where: { KodePL: createRequest.kodePL }
            });
            if (existingPl > 0) {
                throw new response_error_1.ResponseError(400, "Profil Lulusan with this ID already exists");
            }
            // Cek apakah kodeProfesi valid jika diberikan
            if (createRequest.kodeProfesi) {
                const profesiExists = yield database_1.prismaClient.profesi.count({
                    where: { KodeProfesi: createRequest.kodeProfesi }
                });
                if (profesiExists === 0) {
                    throw new response_error_1.ResponseError(400, "Profesi ID not found");
                }
            }
            const data = {
                KodePL: createRequest.kodePL,
                ProfilLulusan: createRequest.deskripsi,
            };
            if (createRequest.kodeProfesi !== undefined) {
                data.KodeProfesi = createRequest.kodeProfesi;
            }
            const newPl = yield database_1.prismaClient.profilLulusan.create({
                data,
                include: { profesi: true }
            });
            return (0, profile_lulusan_model_1.toProfilLulusanResponse)(newPl);
        });
    }
    // --- GET by ID ---
    static get(kodePL) {
        return __awaiter(this, void 0, void 0, function* () {
            kodePL = validation_1.Validation.validate(profil_lulusan_validation_1.ProfilLulusanValidation.KODE_PL, kodePL);
            const pl = yield database_1.prismaClient.profilLulusan.findUnique({
                where: { KodePL: kodePL },
                include: { profesi: true }
            });
            if (!pl) {
                throw new response_error_1.ResponseError(404, "Profil Lulusan not found");
            }
            return (0, profile_lulusan_model_1.toProfilLulusanResponse)(pl);
        });
    }
    // --- UPDATE ---
    static update(kodePL, request) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            kodePL = validation_1.Validation.validate(profil_lulusan_validation_1.ProfilLulusanValidation.KODE_PL, kodePL);
            const updateRequest = validation_1.Validation.validate(profil_lulusan_validation_1.ProfilLulusanValidation.UPDATE, request);
            const existingPl = yield database_1.prismaClient.profilLulusan.findUnique({
                where: { KodePL: kodePL }
            });
            if (!existingPl) {
                throw new response_error_1.ResponseError(404, "Profil Lulusan not found");
            }
            if (updateRequest.kodeProfesi) {
                const profesiExists = yield database_1.prismaClient.profesi.count({
                    where: { KodeProfesi: updateRequest.kodeProfesi }
                });
                if (profesiExists === 0) {
                    throw new response_error_1.ResponseError(400, "Profesi ID not found");
                }
            }
            const updatedPl = yield database_1.prismaClient.profilLulusan.update({
                where: { KodePL: kodePL },
                data: {
                    ProfilLulusan: (_a = updateRequest.deskripsi) !== null && _a !== void 0 ? _a : existingPl.ProfilLulusan, // Update field ProfilLulusan
                    KodeProfesi: (_b = updateRequest.kodeProfesi) !== null && _b !== void 0 ? _b : existingPl.KodeProfesi,
                },
                include: { profesi: true }
            });
            return (0, profile_lulusan_model_1.toProfilLulusanResponse)(updatedPl);
        });
    }
    // --- DELETE ---
    static remove(kodePL) {
        return __awaiter(this, void 0, void 0, function* () {
            kodePL = validation_1.Validation.validate(profil_lulusan_validation_1.ProfilLulusanValidation.KODE_PL, kodePL);
            const existingPlCount = yield database_1.prismaClient.profilLulusan.count({
                where: { KodePL: kodePL }
            });
            if (existingPlCount === 0) {
                throw new response_error_1.ResponseError(404, "Profil Lulusan not found");
            }
            yield database_1.prismaClient.profilLulusan.delete({
                where: { KodePL: kodePL }
            });
        });
    }
    // --- SEARCH / LIST ---
    static search(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchRequest = validation_1.Validation.validate(profil_lulusan_validation_1.ProfilLulusanValidation.SEARCH, request);
            const skip = (searchRequest.page - 1) * searchRequest.size;
            const filters = [];
            if (searchRequest.deskripsi) {
                filters.push({
                    ProfilLulusan: {
                        contains: searchRequest.deskripsi,
                        mode: 'insensitive'
                    }
                });
            }
            if (searchRequest.kodeProfesi) {
                filters.push({
                    KodeProfesi: searchRequest.kodeProfesi
                });
            }
            const [profilLulusanList, total] = yield database_1.prismaClient.$transaction([
                database_1.prismaClient.profilLulusan.findMany({
                    where: { AND: filters },
                    take: searchRequest.size,
                    skip: skip,
                    include: { profesi: true },
                    orderBy: { KodePL: 'asc' } // Urutkan berdasarkan KodePL
                }),
                database_1.prismaClient.profilLulusan.count({ where: { AND: filters } })
            ]);
            const responses = profilLulusanList.map(profile_lulusan_model_1.toProfilLulusanResponse);
            return [responses, total];
        });
    }
}
exports.ProfilLulusanService = ProfilLulusanService;
