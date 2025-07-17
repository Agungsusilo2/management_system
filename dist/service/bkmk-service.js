"use strict";
// src/service/bkmk-service.ts
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
exports.BKMKService = void 0;
const bkmk_model_1 = require("../model/bkmk-model");
const validation_1 = require("../validation/validation");
const bkmk_validation_1 = require("../validation/bkmk-validation");
const database_1 = require("../application/database");
const response_error_1 = require("../error/response-error");
class BKMKService {
    // --- CREATE (Link) BKMK ---
    static create(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const createRequest = validation_1.Validation.validate(bkmk_validation_1.BKMKValidation.LINK_UNLINK, request);
            // Cek apakah BahanKajian dan MataKuliah ada
            const bkExists = yield database_1.prismaClient.bahanKajian.count({ where: { KodeBK: createRequest.kodeBK } });
            if (bkExists === 0) {
                throw new response_error_1.ResponseError(404, "Bahan Kajian not found");
            }
            const mkExists = yield database_1.prismaClient.mataKuliah.count({ where: { IDMK: createRequest.idmk } });
            if (mkExists === 0) {
                throw new response_error_1.ResponseError(404, "Mata Kuliah not found");
            }
            // Cek apakah tautan sudah ada
            const existingLink = yield database_1.prismaClient.bKMK.count({
                where: {
                    KodeBK: createRequest.kodeBK,
                    IDMK: createRequest.idmk,
                }
            });
            if (existingLink > 0) {
                throw new response_error_1.ResponseError(400, "BKMK link already exists");
            }
            const newLink = yield database_1.prismaClient.bKMK.create({
                data: {
                    KodeBK: createRequest.kodeBK,
                    IDMK: createRequest.idmk,
                },
                include: { bahanKajian: true, mataKuliah: true } // Sertakan detail relasi untuk response
            });
            return (0, bkmk_model_1.toBKMKResponse)(newLink);
        });
    }
    // --- REMOVE (Unlink) BKMK ---
    static remove(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleteRequest = validation_1.Validation.validate(bkmk_validation_1.BKMKValidation.LINK_UNLINK, request);
            const existingLink = yield database_1.prismaClient.bKMK.count({
                where: {
                    KodeBK: deleteRequest.kodeBK,
                    IDMK: deleteRequest.idmk,
                }
            });
            if (existingLink === 0) {
                throw new response_error_1.ResponseError(404, "BKMK link not found");
            }
            yield database_1.prismaClient.bKMK.delete({
                where: {
                    KodeBK_IDMK: {
                        KodeBK: deleteRequest.kodeBK,
                        IDMK: deleteRequest.idmk,
                    }
                }
            });
        });
    }
    // --- SEARCH / LIST BKMK ---
    static search(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchRequest = validation_1.Validation.validate(bkmk_validation_1.BKMKValidation.SEARCH, request);
            const skip = (searchRequest.page - 1) * searchRequest.size;
            const filters = [];
            if (searchRequest.kodeBK) {
                filters.push({ KodeBK: searchRequest.kodeBK });
            }
            if (searchRequest.idmk) {
                filters.push({ IDMK: searchRequest.idmk });
            }
            const [bkmkList, total] = yield database_1.prismaClient.$transaction([
                database_1.prismaClient.bKMK.findMany({
                    where: { AND: filters },
                    take: searchRequest.size,
                    skip: skip,
                    include: { bahanKajian: true, mataKuliah: true }, // Sertakan detail relasi
                    orderBy: { KodeBK: 'asc' }
                }),
                database_1.prismaClient.bKMK.count({ where: { AND: filters } })
            ]);
            const responses = bkmkList.map(bkmk_model_1.toBKMKResponse);
            return [responses, total];
        });
    }
}
exports.BKMKService = BKMKService;
