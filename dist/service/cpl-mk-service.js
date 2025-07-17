"use strict";
// src/service/cpl-mk-service.ts
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
exports.CPLMKService = void 0;
const cpl_mk_model_1 = require("../model/cpl-mk-model");
const validation_1 = require("../validation/validation");
const cpl_mk_validation_1 = require("../validation/cpl-mk-validation");
const database_1 = require("../application/database");
const response_error_1 = require("../error/response-error");
class CPLMKService {
    // --- CREATE (Link) CPL-MK ---
    static create(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const createRequest = validation_1.Validation.validate(cpl_mk_validation_1.CPLMKValidation.LINK_UNLINK, request);
            // Cek apakah CPLProdi dan MataKuliah ada
            const cplExists = yield database_1.prismaClient.cPLProdi.count({ where: { KodeCPL: createRequest.kodeCPL } });
            if (cplExists === 0) {
                throw new response_error_1.ResponseError(404, "CPL Prodi not found");
            }
            const mkExists = yield database_1.prismaClient.mataKuliah.count({ where: { IDMK: createRequest.idmk } });
            if (mkExists === 0) {
                throw new response_error_1.ResponseError(404, "Mata Kuliah not found");
            }
            // Cek apakah tautan sudah ada
            const existingLink = yield database_1.prismaClient.cPLMK.count({
                where: {
                    KodeCPL: createRequest.kodeCPL,
                    IDMK: createRequest.idmk,
                }
            });
            if (existingLink > 0) {
                throw new response_error_1.ResponseError(400, "CPL-MK link already exists");
            }
            const newLink = yield database_1.prismaClient.cPLMK.create({
                data: {
                    KodeCPL: createRequest.kodeCPL,
                    IDMK: createRequest.idmk,
                },
                include: { cplProdi: true, mataKuliah: true } // Sertakan detail relasi untuk response
            });
            return (0, cpl_mk_model_1.toCPLMKResponse)(newLink);
        });
    }
    // --- REMOVE (Unlink) CPL-MK ---
    static remove(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleteRequest = validation_1.Validation.validate(cpl_mk_validation_1.CPLMKValidation.LINK_UNLINK, request);
            const existingLink = yield database_1.prismaClient.cPLMK.count({
                where: {
                    KodeCPL: deleteRequest.kodeCPL,
                    IDMK: deleteRequest.idmk,
                }
            });
            if (existingLink === 0) {
                throw new response_error_1.ResponseError(404, "CPL-MK link not found");
            }
            yield database_1.prismaClient.cPLMK.delete({
                where: {
                    KodeCPL_IDMK: {
                        KodeCPL: deleteRequest.kodeCPL,
                        IDMK: deleteRequest.idmk,
                    }
                }
            });
        });
    }
    // --- SEARCH / LIST CPL-MK ---
    static search(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchRequest = validation_1.Validation.validate(cpl_mk_validation_1.CPLMKValidation.SEARCH, request);
            const skip = (searchRequest.page - 1) * searchRequest.size;
            const filters = [];
            if (searchRequest.kodeCPL) {
                filters.push({ KodeCPL: searchRequest.kodeCPL });
            }
            if (searchRequest.idmk) {
                filters.push({ IDMK: searchRequest.idmk });
            }
            const [cplMkList, total] = yield database_1.prismaClient.$transaction([
                database_1.prismaClient.cPLMK.findMany({
                    where: { AND: filters },
                    take: searchRequest.size,
                    skip: skip,
                    include: { cplProdi: true, mataKuliah: true }, // Sertakan detail relasi
                    orderBy: { KodeCPL: 'asc' }
                }),
                database_1.prismaClient.cPLMK.count({ where: { AND: filters } })
            ]);
            const responses = cplMkList.map(cpl_mk_model_1.toCPLMKResponse);
            return [responses, total];
        });
    }
}
exports.CPLMKService = CPLMKService;
