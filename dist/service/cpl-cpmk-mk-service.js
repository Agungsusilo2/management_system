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
exports.CPLCPMKMKService = void 0;
const cpl_cpmk_mk_model_1 = require("../model/cpl-cpmk-mk-model");
const validation_1 = require("../validation/validation");
const cpl_cpmk_mk_validation_1 = require("../validation/cpl-cpmk-mk-validation");
const database_1 = require("../application/database");
const response_error_1 = require("../error/response-error");
class CPLCPMKMKService {
    static create(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const createRequest = validation_1.Validation.validate(cpl_cpmk_mk_validation_1.CPLCPMKMKValidation.LINK_UNLINK, request);
            const cplExists = yield database_1.prismaClient.cPLProdi.count({ where: { KodeCPL: createRequest.kodeCPL } });
            if (cplExists === 0) {
                throw new response_error_1.ResponseError(404, "CPL Prodi not found");
            }
            const cpmkExists = yield database_1.prismaClient.cPMK.count({ where: { KodeCPMK: createRequest.kodeCPMK } });
            if (cpmkExists === 0) {
                throw new response_error_1.ResponseError(404, "CPMK not found");
            }
            const mkExists = yield database_1.prismaClient.mataKuliah.count({ where: { IDMK: createRequest.idmk } });
            if (mkExists === 0) {
                throw new response_error_1.ResponseError(404, "Mata Kuliah not found");
            }
            const existingLink = yield database_1.prismaClient.cPLCPMKMK.count({
                where: {
                    KodeCPL: createRequest.kodeCPL,
                    KodeCPMK: createRequest.kodeCPMK,
                    IDMK: createRequest.idmk,
                }
            });
            if (existingLink > 0) {
                throw new response_error_1.ResponseError(400, "CPL-CPMK-MK link already exists");
            }
            const newLink = yield database_1.prismaClient.cPLCPMKMK.create({
                data: {
                    KodeCPL: createRequest.kodeCPL,
                    KodeCPMK: createRequest.kodeCPMK,
                    IDMK: createRequest.idmk,
                },
                include: { cplProdi: true, cpmk: true, mataKuliah: true } // Sertakan detail relasi untuk response
            });
            return (0, cpl_cpmk_mk_model_1.toCPLCPMKMKResponse)(newLink);
        });
    }
    static remove(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleteRequest = validation_1.Validation.validate(cpl_cpmk_mk_validation_1.CPLCPMKMKValidation.LINK_UNLINK, request);
            const existingLink = yield database_1.prismaClient.cPLCPMKMK.count({
                where: {
                    KodeCPL: deleteRequest.kodeCPL,
                    KodeCPMK: deleteRequest.kodeCPMK,
                    IDMK: deleteRequest.idmk,
                }
            });
            if (existingLink === 0) {
                throw new response_error_1.ResponseError(404, "CPL-CPMK-MK link not found");
            }
            yield database_1.prismaClient.cPLCPMKMK.delete({
                where: {
                    KodeCPL_KodeCPMK_IDMK: {
                        KodeCPL: deleteRequest.kodeCPL,
                        KodeCPMK: deleteRequest.kodeCPMK,
                        IDMK: deleteRequest.idmk,
                    }
                }
            });
        });
    }
    static search(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchRequest = validation_1.Validation.validate(cpl_cpmk_mk_validation_1.CPLCPMKMKValidation.SEARCH, request);
            const skip = (searchRequest.page - 1) * searchRequest.size;
            const filters = [];
            if (searchRequest.kodeCPL) {
                filters.push({ KodeCPL: searchRequest.kodeCPL });
            }
            if (searchRequest.kodeCPMK) {
                filters.push({ KodeCPMK: searchRequest.kodeCPMK });
            }
            if (searchRequest.idmk) {
                filters.push({ IDMK: searchRequest.idmk });
            }
            const [cplCpmkMkList, total] = yield database_1.prismaClient.$transaction([
                database_1.prismaClient.cPLCPMKMK.findMany({
                    where: { AND: filters },
                    take: searchRequest.size,
                    skip: skip,
                    include: { cplProdi: true, cpmk: true, mataKuliah: true }, // Sertakan detail relasi
                    orderBy: { KodeCPL: 'asc' }
                }),
                database_1.prismaClient.cPLCPMKMK.count({ where: { AND: filters } })
            ]);
            const responses = cplCpmkMkList.map(cpl_cpmk_mk_model_1.toCPLCPMKMKResponse);
            return [responses, total];
        });
    }
}
exports.CPLCPMKMKService = CPLCPMKMKService;
