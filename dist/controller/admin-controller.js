"use strict";
// src/controller/admin-controller.ts
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
exports.AdminController = void 0;
const admin_service_1 = require("../service/admin-service");
const logging_1 = require("../application/logging");
class AdminController {
    static create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const request = req.body;
                const response = yield admin_service_1.AdminService.create(req.user, request); // req.user! adalah user yang sedang login
                logging_1.logger.debug(response);
                res.status(201).json({
                    data: response
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
    // Metode GET (sudah ada)
    // Endpoint: GET /api/admins/:adminId
    static get(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const adminId = req.params.adminId; // Ambil ID dari params
                const response = yield admin_service_1.AdminService.get(req.user, adminId);
                logging_1.logger.debug(response);
                res.status(200).json({
                    data: response
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
    // --- METODE BARU: UPDATE ---
    // Endpoint: PATCH /api/admins/:adminId
    static update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const adminId = req.params.adminId;
                const request = req.body;
                const response = yield admin_service_1.AdminService.update(req.user, adminId, request);
                logging_1.logger.debug(response);
                res.status(200).json({
                    data: response
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
    // --- METODE BARU: DELETE ---
    // Endpoint: DELETE /api/admins/:adminId
    static remove(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const adminId = req.params.adminId;
                yield admin_service_1.AdminService.remove(req.user, adminId);
                logging_1.logger.debug("Admin removed successfully");
                res.status(200).json({
                    data: "OK" // Atau pesan sukses lainnya
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
    // --- METODE BARU: SEARCH/LIST ---
    // Endpoint: GET /api/admins
    static search(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Ambil query params dari request
                const request = {
                    nipAdmin: req.query.nipAdmin,
                    jabatan: req.query.jabatan,
                    page: req.query.page ? Number(req.query.page) : undefined,
                    size: req.query.size ? Number(req.query.size) : undefined,
                };
                const [response, total] = yield admin_service_1.AdminService.search(request);
                logging_1.logger.debug(response);
                res.status(200).json({
                    data: response,
                    paging: {
                        page: request.page || 1,
                        size: request.size || 10,
                        total_item: total,
                        total_page: Math.ceil(total / (request.size || 10))
                    }
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
}
exports.AdminController = AdminController;
