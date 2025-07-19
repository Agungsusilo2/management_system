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
exports.LingkupKelasService = void 0;
const lingkup_kelas_model_1 = require("../model/lingkup-kelas-model");
const validation_1 = require("../validation/validation");
const lingkup_kelas_validation_1 = require("../validation/lingkup-kelas-validation");
const database_1 = require("../application/database");
const response_error_1 = require("../error/response-error");
class LingkupKelasService {
    static create(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const createRequest = validation_1.Validation.validate(lingkup_kelas_validation_1.LingkupKelasValidation.CREATE, request);
            const existingLingkupKelas = yield database_1.prismaClient.lingkupKelas.count({
                where: { nama_lingkup_kelas: createRequest.namaLingkupKelas }
            });
            if (existingLingkupKelas > 0) {
                throw new response_error_1.ResponseError(400, "Lingkup Kelas with this name already exists");
            }
            const newLingkupKelas = yield database_1.prismaClient.lingkupKelas.create({
                data: {
                    nama_lingkup_kelas: createRequest.namaLingkupKelas,
                },
            });
            return (0, lingkup_kelas_model_1.toLingkupKelasResponse)(newLingkupKelas);
        });
    }
    static get(idLingkupKelas) {
        return __awaiter(this, void 0, void 0, function* () {
            idLingkupKelas = validation_1.Validation.validate(lingkup_kelas_validation_1.LingkupKelasValidation.ID_LINGKUP_KELAS, idLingkupKelas);
            const lingkupKelas = yield database_1.prismaClient.lingkupKelas.findUnique({
                where: { id_lingkup_kelas: idLingkupKelas },
            });
            if (!lingkupKelas) {
                throw new response_error_1.ResponseError(404, "Lingkup Kelas not found");
            }
            return (0, lingkup_kelas_model_1.toLingkupKelasResponse)(lingkupKelas);
        });
    }
    static update(idLingkupKelas, request) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            idLingkupKelas = validation_1.Validation.validate(lingkup_kelas_validation_1.LingkupKelasValidation.ID_LINGKUP_KELAS, idLingkupKelas);
            const updateRequest = validation_1.Validation.validate(lingkup_kelas_validation_1.LingkupKelasValidation.UPDATE, request);
            const existingLingkupKelas = yield database_1.prismaClient.lingkupKelas.findUnique({
                where: { id_lingkup_kelas: idLingkupKelas }
            });
            if (!existingLingkupKelas) {
                throw new response_error_1.ResponseError(404, "Lingkup Kelas not found");
            }
            if (updateRequest.namaLingkupKelas && updateRequest.namaLingkupKelas !== existingLingkupKelas.nama_lingkup_kelas) {
                const conflictCount = yield database_1.prismaClient.lingkupKelas.count({
                    where: { nama_lingkup_kelas: updateRequest.namaLingkupKelas }
                });
                if (conflictCount > 0) {
                    throw new response_error_1.ResponseError(400, "Another Lingkup Kelas with this name already exists");
                }
            }
            const updatedLingkupKelas = yield database_1.prismaClient.lingkupKelas.update({
                where: { id_lingkup_kelas: idLingkupKelas },
                data: {
                    nama_lingkup_kelas: (_a = updateRequest.namaLingkupKelas) !== null && _a !== void 0 ? _a : existingLingkupKelas.nama_lingkup_kelas,
                }
            });
            return (0, lingkup_kelas_model_1.toLingkupKelasResponse)(updatedLingkupKelas);
        });
    }
    static remove(idLingkupKelas) {
        return __awaiter(this, void 0, void 0, function* () {
            idLingkupKelas = validation_1.Validation.validate(lingkup_kelas_validation_1.LingkupKelasValidation.ID_LINGKUP_KELAS, idLingkupKelas);
            const existingLingkupKelasCount = yield database_1.prismaClient.lingkupKelas.count({
                where: { id_lingkup_kelas: idLingkupKelas }
            });
            if (existingLingkupKelasCount === 0) {
                throw new response_error_1.ResponseError(404, "Lingkup Kelas not found");
            }
            const mataKuliahCount = yield database_1.prismaClient.mataKuliah.count({
                where: { lingkupKelasId: idLingkupKelas } // Perhatikan nama kolom FK di MataKuliah
            });
            if (mataKuliahCount > 0) {
                throw new response_error_1.ResponseError(400, "Cannot delete Lingkup Kelas: still referenced by Mata Kuliah");
            }
            yield database_1.prismaClient.lingkupKelas.delete({
                where: { id_lingkup_kelas: idLingkupKelas }
            });
        });
    }
    static search(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchRequest = validation_1.Validation.validate(lingkup_kelas_validation_1.LingkupKelasValidation.SEARCH, request);
            const skip = (searchRequest.page - 1) * searchRequest.size;
            const filters = [];
            if (searchRequest.namaLingkupKelas) {
                filters.push({
                    nama_lingkup_kelas: {
                        contains: searchRequest.namaLingkupKelas,
                        mode: 'insensitive'
                    }
                });
            }
            const [lingkupKelas, total] = yield database_1.prismaClient.$transaction([
                database_1.prismaClient.lingkupKelas.findMany({
                    where: { AND: filters },
                    take: searchRequest.size,
                    skip: skip,
                    orderBy: { nama_lingkup_kelas: 'asc' }
                }),
                database_1.prismaClient.lingkupKelas.count({ where: { AND: filters } })
            ]);
            const responses = lingkupKelas.map(lingkup_kelas_model_1.toLingkupKelasResponse);
            return [responses, total];
        });
    }
}
exports.LingkupKelasService = LingkupKelasService;
