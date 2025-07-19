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
exports.KelompokMKService = void 0;
const kelompok_mk_model_1 = require("../model/kelompok-mk-model");
const validation_1 = require("../validation/validation");
const kelompok_mk_validation_1 = require("../validation/kelompok-mk-validation");
const database_1 = require("../application/database");
const response_error_1 = require("../error/response-error");
class KelompokMKService {
    static create(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const createRequest = validation_1.Validation.validate(kelompok_mk_validation_1.KelompokMKValidation.CREATE, request);
            const existingKelompokMK = yield database_1.prismaClient.kelompokMK.count({
                where: { nama_kelompok_mk: createRequest.namaKelompokMk }
            });
            if (existingKelompokMK > 0) {
                throw new response_error_1.ResponseError(400, "Kelompok MK with this name already exists");
            }
            const newKelompokMK = yield database_1.prismaClient.kelompokMK.create({
                data: {
                    nama_kelompok_mk: createRequest.namaKelompokMk,
                },
            });
            return (0, kelompok_mk_model_1.toKelompokMKResponse)(newKelompokMK);
        });
    }
    static get(idKelompokMk) {
        return __awaiter(this, void 0, void 0, function* () {
            idKelompokMk = validation_1.Validation.validate(kelompok_mk_validation_1.KelompokMKValidation.ID_KELOMPOK_MK, idKelompokMk);
            const kelompokMK = yield database_1.prismaClient.kelompokMK.findUnique({
                where: { id_kelompok_mk: idKelompokMk },
            });
            if (!kelompokMK) {
                throw new response_error_1.ResponseError(404, "Kelompok MK not found");
            }
            return (0, kelompok_mk_model_1.toKelompokMKResponse)(kelompokMK);
        });
    }
    static update(idKelompokMk, request) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            idKelompokMk = validation_1.Validation.validate(kelompok_mk_validation_1.KelompokMKValidation.ID_KELOMPOK_MK, idKelompokMk);
            const updateRequest = validation_1.Validation.validate(kelompok_mk_validation_1.KelompokMKValidation.UPDATE, request);
            const existingKelompokMK = yield database_1.prismaClient.kelompokMK.findUnique({
                where: { id_kelompok_mk: idKelompokMk }
            });
            if (!existingKelompokMK) {
                throw new response_error_1.ResponseError(404, "Kelompok MK not found");
            }
            if (updateRequest.namaKelompokMk && updateRequest.namaKelompokMk !== existingKelompokMK.nama_kelompok_mk) {
                const conflictCount = yield database_1.prismaClient.kelompokMK.count({
                    where: { nama_kelompok_mk: updateRequest.namaKelompokMk }
                });
                if (conflictCount > 0) {
                    throw new response_error_1.ResponseError(400, "Another Kelompok MK with this name already exists");
                }
            }
            const updatedKelompokMK = yield database_1.prismaClient.kelompokMK.update({
                where: { id_kelompok_mk: idKelompokMk },
                data: {
                    nama_kelompok_mk: (_a = updateRequest.namaKelompokMk) !== null && _a !== void 0 ? _a : existingKelompokMK.nama_kelompok_mk,
                }
            });
            return (0, kelompok_mk_model_1.toKelompokMKResponse)(updatedKelompokMK);
        });
    }
    static remove(idKelompokMk) {
        return __awaiter(this, void 0, void 0, function* () {
            idKelompokMk = validation_1.Validation.validate(kelompok_mk_validation_1.KelompokMKValidation.ID_KELOMPOK_MK, idKelompokMk);
            const existingKelompokMKCount = yield database_1.prismaClient.kelompokMK.count({
                where: { id_kelompok_mk: idKelompokMk }
            });
            if (existingKelompokMKCount === 0) {
                throw new response_error_1.ResponseError(404, "Kelompok MK not found");
            }
            const mataKuliahCount = yield database_1.prismaClient.mataKuliah.count({
                where: { kelompokMKId: idKelompokMk } // Perhatikan nama kolom FK di MataKuliah
            });
            if (mataKuliahCount > 0) {
                throw new response_error_1.ResponseError(400, "Cannot delete Kelompok MK: still referenced by Mata Kuliah");
            }
            yield database_1.prismaClient.kelompokMK.delete({
                where: { id_kelompok_mk: idKelompokMk }
            });
        });
    }
    static search(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchRequest = validation_1.Validation.validate(kelompok_mk_validation_1.KelompokMKValidation.SEARCH, request);
            const skip = (searchRequest.page - 1) * searchRequest.size;
            const filters = [];
            if (searchRequest.namaKelompokMk) {
                filters.push({
                    nama_kelompok_mk: {
                        contains: searchRequest.namaKelompokMk,
                        mode: 'insensitive'
                    }
                });
            }
            const [kelompokMKs, total] = yield database_1.prismaClient.$transaction([
                database_1.prismaClient.kelompokMK.findMany({
                    where: { AND: filters },
                    take: searchRequest.size,
                    skip: skip,
                    orderBy: { nama_kelompok_mk: 'asc' }
                }),
                database_1.prismaClient.kelompokMK.count({ where: { AND: filters } })
            ]);
            const responses = kelompokMKs.map(kelompok_mk_model_1.toKelompokMKResponse);
            return [responses, total];
        });
    }
}
exports.KelompokMKService = KelompokMKService;
