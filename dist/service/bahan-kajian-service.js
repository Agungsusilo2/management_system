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
exports.BahanKajianService = void 0;
const bahan_kajian_model_1 = require("../model/bahan-kajian-model");
const validation_1 = require("../validation/validation");
const bahan_kajian_validation_1 = require("../validation/bahan-kajian-validation");
const database_1 = require("../application/database");
const response_error_1 = require("../error/response-error");
class BahanKajianService {
    static create(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const createRequest = validation_1.Validation.validate(bahan_kajian_validation_1.BahanKajianValidation.CREATE, request);
            const existingBK = yield database_1.prismaClient.bahanKajian.count({
                where: { KodeBK: createRequest.kodeBK }
            });
            if (existingBK > 0) {
                throw new response_error_1.ResponseError(400, "Bahan Kajian with this KodeBK already exists");
            }
            const referensiExists = yield database_1.prismaClient.referensi.count({
                where: { KodeReferensi: createRequest.kodeReferensi }
            });
            if (referensiExists === 0) {
                throw new response_error_1.ResponseError(400, "Referensi ID not found");
            }
            const newBK = yield database_1.prismaClient.bahanKajian.create({
                data: {
                    KodeBK: createRequest.kodeBK,
                    BahanKajian: createRequest.namaBahanKajian,
                    KodeReferensi: createRequest.kodeReferensi,
                },
                include: { referensi: true }
            });
            return (0, bahan_kajian_model_1.toBahanKajianResponse)(newBK);
        });
    }
    static get(kodeBK) {
        return __awaiter(this, void 0, void 0, function* () {
            kodeBK = validation_1.Validation.validate(bahan_kajian_validation_1.BahanKajianValidation.KODE_BK, kodeBK);
            const bk = yield database_1.prismaClient.bahanKajian.findUnique({
                where: { KodeBK: kodeBK },
                include: { referensi: true }
            });
            if (!bk) {
                throw new response_error_1.ResponseError(404, "Bahan Kajian not found");
            }
            return (0, bahan_kajian_model_1.toBahanKajianResponse)(bk);
        });
    }
    static update(kodeBK, request) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            kodeBK = validation_1.Validation.validate(bahan_kajian_validation_1.BahanKajianValidation.KODE_BK, kodeBK);
            const updateRequest = validation_1.Validation.validate(bahan_kajian_validation_1.BahanKajianValidation.UPDATE, request);
            const existingBK = yield database_1.prismaClient.bahanKajian.findUnique({
                where: { KodeBK: kodeBK }
            });
            if (!existingBK) {
                throw new response_error_1.ResponseError(404, "Bahan Kajian not found");
            }
            if (updateRequest.kodeReferensi) {
                const referensiExists = yield database_1.prismaClient.referensi.count({
                    where: { KodeReferensi: updateRequest.kodeReferensi }
                });
                if (referensiExists === 0) {
                    throw new response_error_1.ResponseError(400, "Referensi ID not found");
                }
            }
            const updatedBK = yield database_1.prismaClient.bahanKajian.update({
                where: { KodeBK: kodeBK },
                data: {
                    BahanKajian: (_a = updateRequest.namaBahanKajian) !== null && _a !== void 0 ? _a : existingBK.BahanKajian,
                    KodeReferensi: (_b = updateRequest.kodeReferensi) !== null && _b !== void 0 ? _b : existingBK.KodeReferensi,
                },
                include: { referensi: true }
            });
            return (0, bahan_kajian_model_1.toBahanKajianResponse)(updatedBK);
        });
    }
    static remove(kodeBK) {
        return __awaiter(this, void 0, void 0, function* () {
            kodeBK = validation_1.Validation.validate(bahan_kajian_validation_1.BahanKajianValidation.KODE_BK, kodeBK);
            const existingBKCount = yield database_1.prismaClient.bahanKajian.count({
                where: { KodeBK: kodeBK }
            });
            if (existingBKCount === 0) {
                throw new response_error_1.ResponseError(404, "Bahan Kajian not found");
            }
            yield database_1.prismaClient.bahanKajian.delete({
                where: { KodeBK: kodeBK }
            });
        });
    }
    static search(request) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const searchRequest = validation_1.Validation.validate(bahan_kajian_validation_1.BahanKajianValidation.SEARCH, request);
            const page = (_a = searchRequest.page) !== null && _a !== void 0 ? _a : 1;
            const size = (_b = searchRequest.size) !== null && _b !== void 0 ? _b : 10;
            const skip = (page - 1) * size;
            const filters = [];
            if (searchRequest.namaBahanKajian) {
                filters.push({
                    BahanKajian: {
                        contains: searchRequest.namaBahanKajian,
                        mode: 'insensitive'
                    }
                });
            }
            if (searchRequest.kodeReferensi) {
                filters.push({
                    KodeReferensi: searchRequest.kodeReferensi
                });
            }
            const [bahanKajians, total] = yield database_1.prismaClient.$transaction([
                database_1.prismaClient.bahanKajian.findMany({
                    where: { AND: filters },
                    take: size,
                    skip: skip,
                    include: { referensi: true },
                    orderBy: { KodeBK: 'asc' }
                }),
                database_1.prismaClient.bahanKajian.count({ where: { AND: filters } })
            ]);
            const responses = bahanKajians.map(bahan_kajian_model_1.toBahanKajianResponse);
            return [responses, total];
        });
    }
}
exports.BahanKajianService = BahanKajianService;
