"use strict";
// src/service/admin-service.ts
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
exports.AdminService = void 0;
const admin_model_1 = require("../model/admin-model"); // Import tipe baru
const validation_1 = require("../validation/validation");
const admin_validation_1 = require("../validation/admin-validation");
const database_1 = require("../application/database");
const response_error_1 = require("../error/response-error");
class AdminService {
    static create(user, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const createRequest = validation_1.Validation.validate(admin_validation_1.AdminValidation.CREATE, request);
            const existingAdmin = yield database_1.prismaClient.admin.findUnique({
                where: { userId: user.id }
            });
            if (existingAdmin) {
                throw new response_error_1.ResponseError(400, "User already has an admin profile.");
            }
            const dataToCreate = {
                nipAdmin: createRequest.nipAdmin,
                jabatan: createRequest.jabatan,
                phoneNumber: createRequest.phoneNumber,
                address: createRequest.address,
                user: {
                    connect: {
                        id: user.id
                    }
                }
            };
            const newAdmin = yield database_1.prismaClient.admin.create({
                data: dataToCreate
            });
            return (0, admin_model_1.toAdminResponse)(newAdmin);
        });
    }
    static get(user, adminId) {
        return __awaiter(this, void 0, void 0, function* () {
            adminId = validation_1.Validation.validate(admin_validation_1.AdminValidation.ADMIN_ID, adminId);
            const admin = yield database_1.prismaClient.admin.findUnique({
                where: {
                    id: adminId,
                }
            });
            if (!admin) {
                throw new response_error_1.ResponseError(404, "Admin not found");
            }
            return (0, admin_model_1.toAdminResponse)(admin);
        });
    }
    static update(user, adminId, request) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            adminId = validation_1.Validation.validate(admin_validation_1.AdminValidation.ADMIN_ID, adminId);
            const updateRequest = validation_1.Validation.validate(admin_validation_1.AdminValidation.UPDATE, request);
            const existingAdmin = yield database_1.prismaClient.admin.findUnique({
                where: {
                    id: adminId,
                    userId: user.id
                }
            });
            if (!existingAdmin) {
                throw new response_error_1.ResponseError(404, "Admin not found or unauthorized");
            }
            // Cek jika ada nipAdmin baru dan sudah dipakai oleh admin lain
            if (updateRequest.nipAdmin) {
                const nipAdminExists = yield database_1.prismaClient.admin.count({
                    where: {
                        nipAdmin: updateRequest.nipAdmin,
                        id: {
                            not: adminId // Kecuali admin yang sedang diupdate itu sendiri
                        }
                    }
                });
                if (nipAdminExists > 0) {
                    throw new response_error_1.ResponseError(400, "NIP Admin already in use by another admin.");
                }
            }
            const updatedAdmin = yield database_1.prismaClient.admin.update({
                where: {
                    id: adminId // ID admin yang akan diupdate
                },
                data: {
                    nipAdmin: (_a = updateRequest.nipAdmin) !== null && _a !== void 0 ? _a : existingAdmin.nipAdmin, // Gunakan ?? untuk update parsial
                    jabatan: (_b = updateRequest.jabatan) !== null && _b !== void 0 ? _b : existingAdmin.jabatan,
                    phoneNumber: (_c = updateRequest.phoneNumber) !== null && _c !== void 0 ? _c : existingAdmin.phoneNumber,
                    address: (_d = updateRequest.address) !== null && _d !== void 0 ? _d : existingAdmin.address,
                }
            });
            return (0, admin_model_1.toAdminResponse)(updatedAdmin);
        });
    }
    // --- METODE BARU: DELETE ---
    static remove(user, adminId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validasi adminId
            adminId = validation_1.Validation.validate(admin_validation_1.AdminValidation.ADMIN_ID, adminId);
            // Pastikan admin yang akan dihapus ada dan dimiliki oleh user yang bersangkutan (otorisasi)
            const existingAdmin = yield database_1.prismaClient.admin.findUnique({
                where: {
                    id: adminId,
                    userId: user.id // Hanya user yang merupakan admin ini yang bisa menghapus profilnya sendiri
                }
            });
            if (!existingAdmin) {
                throw new response_error_1.ResponseError(404, "Admin not found or unauthorized");
            }
            // Lakukan penghapusan Admin. Karena onDelete: Cascade di relasi User,
            // user yang terkait juga akan terhapus.
            yield database_1.prismaClient.admin.delete({
                where: {
                    id: adminId
                }
            });
        });
    }
    // --- METODE BARU: SEARCH/LIST ---
    static search(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchRequest = validation_1.Validation.validate(admin_validation_1.AdminValidation.SEARCH, request);
            const skip = (searchRequest.page - 1) * searchRequest.size; // Kalkulasi skip untuk pagination
            const filters = [];
            if (searchRequest.nipAdmin) {
                filters.push({
                    nipAdmin: {
                        contains: searchRequest.nipAdmin, // Cari yang mengandung substring
                        mode: 'insensitive' // Opsional: case-insensitive search
                    }
                });
            }
            if (searchRequest.jabatan) {
                filters.push({
                    jabatan: {
                        contains: searchRequest.jabatan,
                        mode: 'insensitive'
                    }
                });
            }
            const admins = yield database_1.prismaClient.admin.findMany({
                where: {
                    AND: filters // Gabungkan semua filter dengan AND
                },
                take: searchRequest.size,
                skip: skip,
                // Order by (opsional, tapi bagus untuk list)
                orderBy: {
                    nipAdmin: 'asc' // Urutkan berdasarkan NIP Admin secara ascending
                },
                include: {
                    user: {
                        select: {
                            username: true,
                            email: true,
                            full_name: true,
                            user_type: true
                        }
                    }
                }
            });
            const total = yield database_1.prismaClient.admin.count({
                where: {
                    AND: filters
                }
            });
            // Transformasi hasil dari Prisma ke AdminResponse
            const adminResponses = admins.map(admin => {
                return (0, admin_model_1.toAdminResponse)(admin);
            });
            return [adminResponses, total];
        });
    }
}
exports.AdminService = AdminService;
