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
exports.JenisMKService = void 0;
const response_error_1 = require("../error/response-error");
const database_1 = require("../application/database");
const validation_1 = require("../validation/validation");
const jenis_mk_validation_1 = require("../validation/jenis-mk-validation");
const jenis_mk_1 = require("../model/jenis-mk");
class JenisMKService {
    static create(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const createRequest = validation_1.Validation.validate(jenis_mk_validation_1.JenisMKValidation.CREATE, request);
            const existingJenisMK = yield database_1.prismaClient.jenisMK.count({
                where: { nama_jenis_mk: createRequest.namaJenisMk }
            });
            if (existingJenisMK > 0) {
                throw new response_error_1.ResponseError(400, "Jenis MK with this name already exists");
            }
            const newJenisMK = yield database_1.prismaClient.jenisMK.create({
                data: {
                    nama_jenis_mk: createRequest.namaJenisMk,
                },
            });
            return (0, jenis_mk_1.toJenisMKResponse)(newJenisMK);
        });
    }
    static get(idJenisMk) {
        return __awaiter(this, void 0, void 0, function* () {
            idJenisMk = validation_1.Validation.validate(jenis_mk_validation_1.JenisMKValidation.ID_JENIS_MK, idJenisMk);
            const jenisMK = yield database_1.prismaClient.jenisMK.findUnique({
                where: { id_jenis_mk: idJenisMk },
            });
            if (!jenisMK) {
                throw new response_error_1.ResponseError(404, "Jenis MK not found");
            }
            return (0, jenis_mk_1.toJenisMKResponse)(jenisMK);
        });
    }
    static update(idJenisMk, request) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            idJenisMk = validation_1.Validation.validate(jenis_mk_validation_1.JenisMKValidation.ID_JENIS_MK, idJenisMk);
            const updateRequest = validation_1.Validation.validate(jenis_mk_validation_1.JenisMKValidation.UPDATE, request);
            const existingJenisMK = yield database_1.prismaClient.jenisMK.findUnique({
                where: { id_jenis_mk: idJenisMk }
            });
            if (!existingJenisMK) {
                throw new response_error_1.ResponseError(404, "Jenis MK not found");
            }
            if (updateRequest.namaJenisMk && updateRequest.namaJenisMk !== existingJenisMK.nama_jenis_mk) {
                const conflictCount = yield database_1.prismaClient.jenisMK.count({
                    where: { nama_jenis_mk: updateRequest.namaJenisMk }
                });
                if (conflictCount > 0) {
                    throw new response_error_1.ResponseError(400, "Another Jenis MK with this name already exists");
                }
            }
            const updatedJenisMK = yield database_1.prismaClient.jenisMK.update({
                where: { id_jenis_mk: idJenisMk },
                data: {
                    nama_jenis_mk: (_a = updateRequest.namaJenisMk) !== null && _a !== void 0 ? _a : existingJenisMK.nama_jenis_mk,
                }
            });
            return (0, jenis_mk_1.toJenisMKResponse)(updatedJenisMK);
        });
    }
    static remove(idJenisMk) {
        return __awaiter(this, void 0, void 0, function* () {
            idJenisMk = validation_1.Validation.validate(jenis_mk_validation_1.JenisMKValidation.ID_JENIS_MK, idJenisMk);
            const existingJenisMKCount = yield database_1.prismaClient.jenisMK.count({
                where: { id_jenis_mk: idJenisMk }
            });
            if (existingJenisMKCount === 0) {
                throw new response_error_1.ResponseError(404, "Jenis MK not found");
            }
            const mataKuliahCount = yield database_1.prismaClient.mataKuliah.count({
                where: { jenisMKId: idJenisMk } // Perhatikan nama kolom FK di MataKuliah
            });
            if (mataKuliahCount > 0) {
                throw new response_error_1.ResponseError(400, "Cannot delete Jenis MK: still referenced by Mata Kuliah");
            }
            yield database_1.prismaClient.jenisMK.delete({
                where: { id_jenis_mk: idJenisMk }
            });
        });
    }
    static search(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchRequest = validation_1.Validation.validate(jenis_mk_validation_1.JenisMKValidation.SEARCH, request);
            const skip = (searchRequest.page - 1) * searchRequest.size;
            const filters = [];
            if (searchRequest.namaJenisMk) {
                filters.push({
                    nama_jenis_mk: {
                        contains: searchRequest.namaJenisMk,
                        mode: 'insensitive'
                    }
                });
            }
            const [jenisMKs, total] = yield database_1.prismaClient.$transaction([
                database_1.prismaClient.jenisMK.findMany({
                    where: { AND: filters },
                    take: searchRequest.size,
                    skip: skip,
                    orderBy: { nama_jenis_mk: 'asc' }
                }),
                database_1.prismaClient.jenisMK.count({ where: { AND: filters } })
            ]);
            const responses = jenisMKs.map(jenis_mk_1.toJenisMKResponse);
            return [responses, total];
        });
    }
}
exports.JenisMKService = JenisMKService;
