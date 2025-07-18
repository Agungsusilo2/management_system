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
exports.CPLProdiService = void 0;
const cpl_prodi_model_1 = require("../model/cpl-prodi-model");
const validation_1 = require("../validation/validation");
const cpl_prodi_validation_1 = require("../validation/cpl-prodi-validation");
const database_1 = require("../application/database");
const response_error_1 = require("../error/response-error");
class CPLProdiService {
    static create(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const createRequest = validation_1.Validation.validate(cpl_prodi_validation_1.CPLProdiValidation.CREATE, request);
            const existingCPL = yield database_1.prismaClient.cPLProdi.count({
                where: { KodeCPL: createRequest.kodeCPL }
            });
            if (existingCPL > 0) {
                throw new response_error_1.ResponseError(400, "CPL Prodi with this KodeCPL already exists");
            }
            if (createRequest.kodeAspek) {
                const aspekExists = yield database_1.prismaClient.aspek.count({ where: { KodeAspek: createRequest.kodeAspek } });
                if (aspekExists === 0) {
                    throw new response_error_1.ResponseError(400, "Aspek ID not found");
                }
            }
            const data = {
                KodeCPL: createRequest.kodeCPL,
                DeskripsiCPL: createRequest.deskripsiCPL,
            };
            if (createRequest.kodeAspek !== undefined && createRequest.kodeAspek !== null) {
                data.KodeAspek = createRequest.kodeAspek;
            }
            const newCPL = yield database_1.prismaClient.cPLProdi.create({
                data: data,
                include: { aspek: true }
            });
            return (0, cpl_prodi_model_1.toCPLProdiResponse)(newCPL);
        });
    }
    static get(kodeCPL) {
        return __awaiter(this, void 0, void 0, function* () {
            kodeCPL = validation_1.Validation.validate(cpl_prodi_validation_1.CPLProdiValidation.KODE_CPL, kodeCPL);
            const cpl = yield database_1.prismaClient.cPLProdi.findUnique({
                where: { KodeCPL: kodeCPL },
                include: { aspek: true }
            });
            if (!cpl) {
                throw new response_error_1.ResponseError(404, "CPL Prodi not found");
            }
            return (0, cpl_prodi_model_1.toCPLProdiResponse)(cpl);
        });
    }
    static update(kodeCPL, request) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            kodeCPL = validation_1.Validation.validate(cpl_prodi_validation_1.CPLProdiValidation.KODE_CPL, kodeCPL);
            const updateRequest = validation_1.Validation.validate(cpl_prodi_validation_1.CPLProdiValidation.UPDATE, request);
            const existingCPL = yield database_1.prismaClient.cPLProdi.findUnique({
                where: { KodeCPL: kodeCPL }
            });
            if (!existingCPL) {
                throw new response_error_1.ResponseError(404, "CPL Prodi not found");
            }
            if (updateRequest.kodeAspek) {
                const aspekExists = yield database_1.prismaClient.aspek.count({ where: { KodeAspek: updateRequest.kodeAspek } });
                if (aspekExists === 0) {
                    throw new response_error_1.ResponseError(400, "Aspek ID not found");
                }
            }
            const updateData = {
                DeskripsiCPL: (_a = updateRequest.deskripsiCPL) !== null && _a !== void 0 ? _a : existingCPL.DeskripsiCPL,
            };
            if (updateRequest.kodeAspek !== undefined) {
                updateData.KodeAspek = updateRequest.kodeAspek;
            }
            else {
                updateData.KodeAspek = existingCPL.KodeAspek;
            }
            const updatedCPL = yield database_1.prismaClient.cPLProdi.update({
                where: { KodeCPL: kodeCPL },
                data: updateData,
                include: { aspek: true }
            });
            return (0, cpl_prodi_model_1.toCPLProdiResponse)(updatedCPL);
        });
    }
    static remove(kodeCPL) {
        return __awaiter(this, void 0, void 0, function* () {
            kodeCPL = validation_1.Validation.validate(cpl_prodi_validation_1.CPLProdiValidation.KODE_CPL, kodeCPL);
            const existingCPLCount = yield database_1.prismaClient.cPLProdi.count({
                where: { KodeCPL: kodeCPL }
            });
            if (existingCPLCount === 0) {
                throw new response_error_1.ResponseError(404, "CPL Prodi not found");
            }
            yield database_1.prismaClient.cPLProdi.delete({
                where: { KodeCPL: kodeCPL }
            });
        });
    }
    static search(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchRequest = validation_1.Validation.validate(cpl_prodi_validation_1.CPLProdiValidation.SEARCH, request);
            const skip = (searchRequest.page - 1) * searchRequest.size;
            const filters = [];
            if (searchRequest.deskripsiCPL) {
                filters.push({
                    DeskripsiCPL: {
                        contains: searchRequest.deskripsiCPL,
                        mode: 'insensitive'
                    }
                });
            }
            if (searchRequest.kodeAspek) {
                filters.push({
                    KodeAspek: searchRequest.kodeAspek
                });
            }
            const [cplProdiList, total] = yield database_1.prismaClient.$transaction([
                database_1.prismaClient.cPLProdi.findMany({
                    where: { AND: filters },
                    take: searchRequest.size,
                    skip: skip,
                    include: { aspek: true },
                    orderBy: { KodeCPL: 'asc' }
                }),
                database_1.prismaClient.cPLProdi.count({ where: { AND: filters } })
            ]);
            const responses = cplProdiList.map(cpl_prodi_model_1.toCPLProdiResponse);
            return [responses, total];
        });
    }
}
exports.CPLProdiService = CPLProdiService;
