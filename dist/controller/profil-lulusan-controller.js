"use strict";
// src/controller/profil-lulusan-controller.ts
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
exports.ProfilLulusanController = void 0;
const response_error_1 = require("../error/response-error");
const profil_lulusan_service_1 = require("../service/profil-lulusan-service");
const logging_1 = require("../application/logging");
class ProfilLulusanController {
    static authorizeAdmin(user) {
        if (!user || user.user_type !== 'Admin') {
            throw new response_error_1.ResponseError(403, "Forbidden: Only administrators can perform this action.");
        }
    }
    // --- CREATE ---
    static create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                ProfilLulusanController.authorizeAdmin(req.user);
                const request = req.body;
                const response = yield profil_lulusan_service_1.ProfilLulusanService.create(request);
                logging_1.logger.debug(response);
                res.status(201).json({ data: response });
            }
            catch (e) {
                next(e);
            }
        });
    }
    // --- GET by ID ---
    static get(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // ProfilLulusanController.authorizeAdmin(req.user); // Uncomment if only admin can GET
                const kodePL = req.params.kodePL; // Ambil ID dari params
                const response = yield profil_lulusan_service_1.ProfilLulusanService.get(kodePL);
                logging_1.logger.debug(response);
                res.status(200).json({ data: response });
            }
            catch (e) {
                next(e);
            }
        });
    }
    // --- UPDATE ---
    static update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                ProfilLulusanController.authorizeAdmin(req.user);
                const kodePL = req.params.plId;
                console.log("1223:", kodePL);
                const request = req.body;
                const response = yield profil_lulusan_service_1.ProfilLulusanService.update(kodePL, request);
                logging_1.logger.debug(response);
                res.status(200).json({ data: response });
            }
            catch (e) {
                next(e);
            }
        });
    }
    // --- DELETE ---
    static remove(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                ProfilLulusanController.authorizeAdmin(req.user);
                const kodePL = req.params.plId;
                yield profil_lulusan_service_1.ProfilLulusanService.remove(kodePL);
                logging_1.logger.debug("Profil Lulusan removed successfully");
                res.status(200).json({ data: "OK" });
            }
            catch (e) {
                next(e);
            }
        });
    }
    // --- SEARCH / LIST ---
    static search(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // ProfilLulusanController.authorizeAdmin(req.user); // Uncomment if only admin can SEARCH
                const request = {
                    deskripsi: req.query.deskripsi,
                    kodeProfesi: req.query.kodeProfesi,
                    page: req.query.page ? Number(req.query.page) : undefined,
                    size: req.query.size ? Number(req.query.size) : undefined,
                };
                const [response, total] = yield profil_lulusan_service_1.ProfilLulusanService.search(request);
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
exports.ProfilLulusanController = ProfilLulusanController;
