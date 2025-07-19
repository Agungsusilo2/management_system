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
exports.MetodePembelajaranService = void 0;
const validation_1 = require("../validation/validation");
const response_error_1 = require("../error/response-error");
const database_1 = require("../application/database");
const metode_pembelajaran_model_1 = require("../model/metode-pembelajaran-model");
const metode_pembelajaran_validation_1 = require("../validation/metode-pembelajaran-validation");
class MetodePembelajaranService {
    static create(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const createRequest = validation_1.Validation.validate(metode_pembelajaran_validation_1.MetodePembelajaranValidation.CREATE, request);
            const existingMetodePembelajaran = yield database_1.prismaClient.metodePembelajaran.count({
                where: { nama_metode_pembelajaran: createRequest.namaMetodePembelajaran }
            });
            if (existingMetodePembelajaran > 0) {
                throw new response_error_1.ResponseError(400, "Metode Pembelajaran with this name already exists");
            }
            const newMetodePembelajaran = yield database_1.prismaClient.metodePembelajaran.create({
                data: {
                    nama_metode_pembelajaran: createRequest.namaMetodePembelajaran,
                },
            });
            return (0, metode_pembelajaran_model_1.toMetodePembelajaranResponse)(newMetodePembelajaran);
        });
    }
    static get(idMetodePembelajaran) {
        return __awaiter(this, void 0, void 0, function* () {
            idMetodePembelajaran = validation_1.Validation.validate(metode_pembelajaran_validation_1.MetodePembelajaranValidation.ID_METODE_PEMBELAJARAN, idMetodePembelajaran);
            const metodePembelajaran = yield database_1.prismaClient.metodePembelajaran.findUnique({
                where: { id_metode_pembelajaran: idMetodePembelajaran },
            });
            if (!metodePembelajaran) {
                throw new response_error_1.ResponseError(404, "Metode Pembelajaran not found");
            }
            return (0, metode_pembelajaran_model_1.toMetodePembelajaranResponse)(metodePembelajaran);
        });
    }
    static update(idMetodePembelajaran, request) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            idMetodePembelajaran = validation_1.Validation.validate(metode_pembelajaran_validation_1.MetodePembelajaranValidation.ID_METODE_PEMBELAJARAN, idMetodePembelajaran);
            const updateRequest = validation_1.Validation.validate(metode_pembelajaran_validation_1.MetodePembelajaranValidation.UPDATE, request);
            const existingMetodePembelajaran = yield database_1.prismaClient.metodePembelajaran.findUnique({
                where: { id_metode_pembelajaran: idMetodePembelajaran }
            });
            if (!existingMetodePembelajaran) {
                throw new response_error_1.ResponseError(404, "Metode Pembelajaran not found");
            }
            if (updateRequest.namaMetodePembelajaran && updateRequest.namaMetodePembelajaran !== existingMetodePembelajaran.nama_metode_pembelajaran) {
                const conflictCount = yield database_1.prismaClient.metodePembelajaran.count({
                    where: { nama_metode_pembelajaran: updateRequest.namaMetodePembelajaran }
                });
                if (conflictCount > 0) {
                    throw new response_error_1.ResponseError(400, "Another Metode Pembelajaran with this name already exists");
                }
            }
            const updatedMetodePembelajaran = yield database_1.prismaClient.metodePembelajaran.update({
                where: { id_metode_pembelajaran: idMetodePembelajaran },
                data: {
                    nama_metode_pembelajaran: (_a = updateRequest.namaMetodePembelajaran) !== null && _a !== void 0 ? _a : existingMetodePembelajaran.nama_metode_pembelajaran,
                }
            });
            return (0, metode_pembelajaran_model_1.toMetodePembelajaranResponse)(updatedMetodePembelajaran);
        });
    }
    static remove(idMetodePembelajaran) {
        return __awaiter(this, void 0, void 0, function* () {
            idMetodePembelajaran = validation_1.Validation.validate(metode_pembelajaran_validation_1.MetodePembelajaranValidation.ID_METODE_PEMBELAJARAN, idMetodePembelajaran);
            const existingMetodePembelajaranCount = yield database_1.prismaClient.metodePembelajaran.count({
                where: { id_metode_pembelajaran: idMetodePembelajaran }
            });
            if (existingMetodePembelajaranCount === 0) {
                throw new response_error_1.ResponseError(404, "Metode Pembelajaran not found");
            }
            const mataKuliahCount = yield database_1.prismaClient.mataKuliah.count({
                where: { metodePembelajaranId: idMetodePembelajaran } // Perhatikan nama kolom FK di MataKuliah
            });
            if (mataKuliahCount > 0) {
                throw new response_error_1.ResponseError(400, "Cannot delete Metode Pembelajaran: still referenced by Mata Kuliah");
            }
            yield database_1.prismaClient.metodePembelajaran.delete({
                where: { id_metode_pembelajaran: idMetodePembelajaran }
            });
        });
    }
    static search(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchRequest = validation_1.Validation.validate(metode_pembelajaran_validation_1.MetodePembelajaranValidation.SEARCH, request);
            const skip = (searchRequest.page - 1) * searchRequest.size;
            const filters = [];
            if (searchRequest.namaMetodePembelajaran) {
                filters.push({
                    nama_metode_pembelajaran: {
                        contains: searchRequest.namaMetodePembelajaran,
                        mode: 'insensitive'
                    }
                });
            }
            const [metodePembelajarans, total] = yield database_1.prismaClient.$transaction([
                database_1.prismaClient.metodePembelajaran.findMany({
                    where: { AND: filters },
                    take: searchRequest.size,
                    skip: skip,
                    orderBy: { nama_metode_pembelajaran: 'asc' }
                }),
                database_1.prismaClient.metodePembelajaran.count({ where: { AND: filters } })
            ]);
            const responses = metodePembelajarans.map(metode_pembelajaran_model_1.toMetodePembelajaranResponse);
            return [responses, total];
        });
    }
}
exports.MetodePembelajaranService = MetodePembelajaranService;
