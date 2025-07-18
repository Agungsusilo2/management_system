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
exports.CPMKService = void 0;
const cpmk_model_1 = require("../model/cpmk-model");
const validation_1 = require("../validation/validation");
const cpmk_validation_1 = require("../validation/cpmk-validation");
const database_1 = require("../application/database");
const response_error_1 = require("../error/response-error");
class CPMKService {
    static create(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const createRequest = validation_1.Validation.validate(cpmk_validation_1.CPMKValidation.CREATE, request);
            const existingCPMK = yield database_1.prismaClient.cPMK.count({
                where: { KodeCPMK: createRequest.kodeCPMK }
            });
            if (existingCPMK > 0) {
                throw new response_error_1.ResponseError(400, "CPMK with this KodeCPMK already exists");
            }
            const subCpmkExists = yield database_1.prismaClient.subCPMK.count({
                where: { SubCPMK: createRequest.subCPMKId }
            });
            if (subCpmkExists === 0) {
                throw new response_error_1.ResponseError(400, "SubCPMK ID not found");
            }
            const newCPMK = yield database_1.prismaClient.cPMK.create({
                data: {
                    KodeCPMK: createRequest.kodeCPMK,
                    CPMK: createRequest.namaCPMK,
                    SubCPMK: createRequest.subCPMKId,
                },
                include: { subCPMK: true }
            });
            return (0, cpmk_model_1.toCPMKResponse)(newCPMK);
        });
    }
    static get(kodeCPMK) {
        return __awaiter(this, void 0, void 0, function* () {
            kodeCPMK = validation_1.Validation.validate(cpmk_validation_1.CPMKValidation.KODE_CPMK, kodeCPMK);
            const cpmk = yield database_1.prismaClient.cPMK.findUnique({
                where: { KodeCPMK: kodeCPMK },
                include: { subCPMK: true }
            });
            if (!cpmk) {
                throw new response_error_1.ResponseError(404, "CPMK not found");
            }
            return (0, cpmk_model_1.toCPMKResponse)(cpmk);
        });
    }
    static update(kodeCPMK, request) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            kodeCPMK = validation_1.Validation.validate(cpmk_validation_1.CPMKValidation.KODE_CPMK, kodeCPMK);
            const updateRequest = validation_1.Validation.validate(cpmk_validation_1.CPMKValidation.UPDATE, request);
            const existingCPMK = yield database_1.prismaClient.cPMK.findUnique({
                where: { KodeCPMK: kodeCPMK }
            });
            if (!existingCPMK) {
                throw new response_error_1.ResponseError(404, "CPMK not found");
            }
            if (updateRequest.subCPMKId) {
                const subCpmkExists = yield database_1.prismaClient.subCPMK.count({
                    where: { SubCPMK: updateRequest.subCPMKId }
                });
                if (subCpmkExists === 0) {
                    throw new response_error_1.ResponseError(400, "SubCPMK ID not found");
                }
            }
            const updatedCPMK = yield database_1.prismaClient.cPMK.update({
                where: { KodeCPMK: kodeCPMK },
                data: {
                    CPMK: (_a = updateRequest.namaCPMK) !== null && _a !== void 0 ? _a : existingCPMK.CPMK,
                    SubCPMK: (_b = updateRequest.subCPMKId) !== null && _b !== void 0 ? _b : existingCPMK.SubCPMK,
                },
                include: { subCPMK: true }
            });
            return (0, cpmk_model_1.toCPMKResponse)(updatedCPMK);
        });
    }
    static remove(kodeCPMK) {
        return __awaiter(this, void 0, void 0, function* () {
            kodeCPMK = validation_1.Validation.validate(cpmk_validation_1.CPMKValidation.KODE_CPMK, kodeCPMK);
            const existingCPMKCount = yield database_1.prismaClient.cPMK.count({
                where: { KodeCPMK: kodeCPMK }
            });
            if (existingCPMKCount === 0) {
                throw new response_error_1.ResponseError(404, "CPMK not found");
            }
            yield database_1.prismaClient.cPMK.delete({
                where: { KodeCPMK: kodeCPMK }
            });
        });
    }
    static search(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchRequest = validation_1.Validation.validate(cpmk_validation_1.CPMKValidation.SEARCH, request);
            const skip = (searchRequest.page - 1) * searchRequest.size;
            const filters = [];
            if (searchRequest.namaCPMK) {
                filters.push({
                    CPMK: {
                        contains: searchRequest.namaCPMK,
                        mode: 'insensitive'
                    }
                });
            }
            if (searchRequest.subCPMKId) {
                filters.push({
                    SubCPMK: searchRequest.subCPMKId
                });
            }
            const [cpmkList, total] = yield database_1.prismaClient.$transaction([
                database_1.prismaClient.cPMK.findMany({
                    where: { AND: filters },
                    take: searchRequest.size,
                    skip: skip,
                    include: { subCPMK: true },
                    orderBy: { KodeCPMK: 'asc' }
                }),
                database_1.prismaClient.cPMK.count({ where: { AND: filters } })
            ]);
            const responses = cpmkList.map(cpmk_model_1.toCPMKResponse);
            return [responses, total];
        });
    }
}
exports.CPMKService = CPMKService;
