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
exports.SKSMataKuliahService = void 0;
const sks_matakuliah_model_1 = require("../model/sks-matakuliah-model");
const validation_1 = require("../validation/validation");
const sks_mata_kuliah_validation_1 = require("../validation/sks-mata-kuliah-validation");
const database_1 = require("../application/database");
const response_error_1 = require("../error/response-error");
class SKSMataKuliahService {
    static create(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const createRequest = validation_1.Validation.validate(sks_mata_kuliah_validation_1.SKSMataKuliahValidation.CREATE, request);
            const existingSKS = yield database_1.prismaClient.sKSMataKuliah.count({
                where: { IDMK: createRequest.idmk }
            });
            if (existingSKS > 0) {
                throw new response_error_1.ResponseError(400, "SKS data for this Mata Kuliah already exists");
            }
            const newSKSMataKuliah = yield database_1.prismaClient.sKSMataKuliah.create({
                data: {
                    BobotTatapMuka: createRequest.bobotTatapMuka,
                    BobotPraktikum: createRequest.bobotPraktikum,
                    BobotPraktekLapangan: createRequest.bobotPraktekLapangan,
                    BobotSimulasi: createRequest.bobotSimulasi,
                    TotalBobot: createRequest.bobotTatapMuka + createRequest.bobotPraktikum + createRequest.bobotPraktekLapangan + createRequest.bobotSimulasi,
                    mataKuliah: {
                        connect: { IDMK: createRequest.idmk }
                    }
                },
            });
            return (0, sks_matakuliah_model_1.toSKSMataKuliahResponse)(newSKSMataKuliah);
        });
    }
    static get(kodeSKS) {
        return __awaiter(this, void 0, void 0, function* () {
            kodeSKS = validation_1.Validation.validate(sks_mata_kuliah_validation_1.SKSMataKuliahValidation.KODE_SKS, kodeSKS);
            const sksMataKuliah = yield database_1.prismaClient.sKSMataKuliah.findUnique({
                where: { KodeSKS: kodeSKS },
            });
            if (!sksMataKuliah) {
                throw new response_error_1.ResponseError(404, "SKS Mata Kuliah not found");
            }
            return (0, sks_matakuliah_model_1.toSKSMataKuliahResponse)(sksMataKuliah);
        });
    }
    static update(kodeSKS, request) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            kodeSKS = validation_1.Validation.validate(sks_mata_kuliah_validation_1.SKSMataKuliahValidation.KODE_SKS, kodeSKS);
            const updateRequest = validation_1.Validation.validate(sks_mata_kuliah_validation_1.SKSMataKuliahValidation.UPDATE, request);
            const existingSKSMataKuliah = yield database_1.prismaClient.sKSMataKuliah.findUnique({
                where: { KodeSKS: kodeSKS }
            });
            if (!existingSKSMataKuliah) {
                throw new response_error_1.ResponseError(404, "SKS Mata Kuliah not found");
            }
            const updatedData = {
                BobotTatapMuka: (_a = updateRequest.bobotTatapMuka) !== null && _a !== void 0 ? _a : existingSKSMataKuliah.BobotTatapMuka,
                BobotPraktikum: (_b = updateRequest.bobotPraktikum) !== null && _b !== void 0 ? _b : existingSKSMataKuliah.BobotPraktikum,
                BobotPraktekLapangan: (_c = updateRequest.bobotPraktekLapangan) !== null && _c !== void 0 ? _c : existingSKSMataKuliah.BobotPraktekLapangan,
                BobotSimulasi: (_d = updateRequest.bobotSimulasi) !== null && _d !== void 0 ? _d : existingSKSMataKuliah.BobotSimulasi,
            };
            if (updateRequest.bobotTatapMuka !== undefined ||
                updateRequest.bobotPraktikum !== undefined ||
                updateRequest.bobotPraktekLapangan !== undefined ||
                updateRequest.bobotSimulasi !== undefined) {
                updatedData.TotalBobot = ((_e = updateRequest.bobotTatapMuka) !== null && _e !== void 0 ? _e : existingSKSMataKuliah.BobotTatapMuka) +
                    ((_f = updateRequest.bobotPraktikum) !== null && _f !== void 0 ? _f : existingSKSMataKuliah.BobotPraktikum) +
                    ((_g = updateRequest.bobotPraktekLapangan) !== null && _g !== void 0 ? _g : existingSKSMataKuliah.BobotPraktekLapangan) +
                    ((_h = updateRequest.bobotSimulasi) !== null && _h !== void 0 ? _h : existingSKSMataKuliah.BobotSimulasi);
            }
            const updatedSKSMataKuliah = yield database_1.prismaClient.sKSMataKuliah.update({
                where: { KodeSKS: kodeSKS },
                data: updatedData
            });
            return (0, sks_matakuliah_model_1.toSKSMataKuliahResponse)(updatedSKSMataKuliah);
        });
    }
    static remove(kodeSKS) {
        return __awaiter(this, void 0, void 0, function* () {
            kodeSKS = validation_1.Validation.validate(sks_mata_kuliah_validation_1.SKSMataKuliahValidation.KODE_SKS, kodeSKS);
            const existingSKSMataKuliahCount = yield database_1.prismaClient.sKSMataKuliah.count({
                where: { KodeSKS: kodeSKS }
            });
            if (existingSKSMataKuliahCount === 0) {
                throw new response_error_1.ResponseError(404, "SKS Mata Kuliah not found");
            }
            yield database_1.prismaClient.sKSMataKuliah.delete({
                where: { KodeSKS: kodeSKS }
            });
        });
    }
    static search(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchRequest = validation_1.Validation.validate(sks_mata_kuliah_validation_1.SKSMataKuliahValidation.SEARCH, request);
            const skip = (searchRequest.page - 1) * searchRequest.size;
            const filters = [];
            if (searchRequest.idmk) {
                filters.push({
                    IDMK: searchRequest.idmk
                });
            }
            const [sksMataKuliahs, total] = yield database_1.prismaClient.$transaction([
                database_1.prismaClient.sKSMataKuliah.findMany({
                    where: { AND: filters },
                    take: searchRequest.size,
                    skip: skip,
                    orderBy: { KodeSKS: 'asc' }
                }),
                database_1.prismaClient.sKSMataKuliah.count({ where: { AND: filters } })
            ]);
            const responses = sksMataKuliahs.map(sks_matakuliah_model_1.toSKSMataKuliahResponse);
            return [responses, total];
        });
    }
}
exports.SKSMataKuliahService = SKSMataKuliahService;
