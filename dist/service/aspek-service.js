"use strict";
// src/service/aspek-service.ts
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
exports.AspekService = void 0;
const validation_1 = require("../validation/validation");
const aspek_validation_1 = require("../validation/aspek-validation");
const database_1 = require("../application/database");
const response_error_1 = require("../error/response-error");
const aspek_model_1 = require("../model/aspek-model");
class AspekService {
    // --- CREATE Aspek ---
    static create(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const createRequest = validation_1.Validation.validate(aspek_validation_1.AspekValidation.CREATE, request);
            const existingAspek = yield database_1.prismaClient.aspek.count({
                where: { KodeAspek: createRequest.kodeAspek }
            });
            if (existingAspek > 0) {
                throw new response_error_1.ResponseError(400, "Aspek with this KodeAspek already exists");
            }
            const newAspek = yield database_1.prismaClient.aspek.create({
                data: {
                    KodeAspek: createRequest.kodeAspek,
                    Aspek: createRequest.namaAspek, // Mapping ke kolom 'Aspek' di DB
                },
            });
            return (0, aspek_model_1.toAspekResponse)(newAspek);
        });
    }
    // --- GET Aspek by ID ---
    static get(kodeAspek) {
        return __awaiter(this, void 0, void 0, function* () {
            kodeAspek = validation_1.Validation.validate(aspek_validation_1.AspekValidation.KODE_ASPEK, kodeAspek);
            const aspek = yield database_1.prismaClient.aspek.findUnique({
                where: { KodeAspek: kodeAspek },
            });
            if (!aspek) {
                throw new response_error_1.ResponseError(404, "Aspek not found");
            }
            return (0, aspek_model_1.toAspekResponse)(aspek);
        });
    }
    // --- UPDATE Aspek ---
    static update(kodeAspek, request) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            kodeAspek = validation_1.Validation.validate(aspek_validation_1.AspekValidation.KODE_ASPEK, kodeAspek);
            const updateRequest = validation_1.Validation.validate(aspek_validation_1.AspekValidation.UPDATE, request);
            const existingAspek = yield database_1.prismaClient.aspek.findUnique({
                where: { KodeAspek: kodeAspek }
            });
            if (!existingAspek) {
                throw new response_error_1.ResponseError(404, "Aspek not found");
            }
            const updatedAspek = yield database_1.prismaClient.aspek.update({
                where: { KodeAspek: kodeAspek },
                data: {
                    Aspek: (_a = updateRequest.namaAspek) !== null && _a !== void 0 ? _a : existingAspek.Aspek,
                }
            });
            return (0, aspek_model_1.toAspekResponse)(updatedAspek);
        });
    }
    // --- DELETE Aspek ---
    static remove(kodeAspek) {
        return __awaiter(this, void 0, void 0, function* () {
            kodeAspek = validation_1.Validation.validate(aspek_validation_1.AspekValidation.KODE_ASPEK, kodeAspek);
            const existingAspekCount = yield database_1.prismaClient.aspek.count({
                where: { KodeAspek: kodeAspek }
            });
            if (existingAspekCount === 0) {
                throw new response_error_1.ResponseError(404, "Aspek not found");
            }
            // Cek apakah ada CPLProdi yang masih merujuk ke aspek ini
            const cplProdiCount = yield database_1.prismaClient.cPLProdi.count({
                where: { KodeAspek: kodeAspek }
            });
            if (cplProdiCount > 0) {
                throw new response_error_1.ResponseError(400, "Cannot delete Aspek: still referenced by CPL Prodi");
            }
            yield database_1.prismaClient.aspek.delete({
                where: { KodeAspek: kodeAspek }
            });
        });
    }
    // --- SEARCH / LIST Aspek ---
    static search(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchRequest = validation_1.Validation.validate(aspek_validation_1.AspekValidation.SEARCH, request);
            const skip = (searchRequest.page - 1) * searchRequest.size;
            const filters = [];
            if (searchRequest.namaAspek) {
                filters.push({
                    Aspek: {
                        contains: searchRequest.namaAspek.toLowerCase()
                    }
                });
            }
            const [aspeks, total] = yield database_1.prismaClient.$transaction([
                database_1.prismaClient.aspek.findMany({
                    where: { AND: filters },
                    take: searchRequest.size,
                    skip: skip,
                    orderBy: { KodeAspek: 'asc' }
                }),
                database_1.prismaClient.aspek.count({ where: { AND: filters } })
            ]);
            const responses = aspeks.map(aspek_model_1.toAspekResponse);
            return [responses, total];
        });
    }
}
exports.AspekService = AspekService;
