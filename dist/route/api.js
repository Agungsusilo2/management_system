"use strict";
// src/routes/api-router.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth-middleware");
const user_controller_1 = require("../controller/user-controller");
const admin_controller_1 = require("../controller/admin-controller");
const profesi_controller_1 = require("../controller/profesi-controller");
const profil_lulusan_controller_1 = require("../controller/profil-lulusan-controller");
const aspek_controller_1 = require("../controller/aspek-controller");
const referensi_controller_1 = require("../controller/referensi-controller");
const bahan_kajian_controller_1 = require("../controller/bahan-kajian-controller");
const mata_kuliah_controller_1 = require("../controller/mata-kuliah-controller");
const sub_cpmk_controller_1 = require("../controller/sub-cpmk-controller");
const cpmk_controller_1 = require("../controller/cpmk-controller");
const cpl_pl_controller_1 = require("../controller/cpl-pl-controller");
const cpl_bk_controller_1 = require("../controller/cpl-bk-controller");
const bkmk_controller_1 = require("../controller/bkmk-controller");
const cpl_mk_controller_1 = require("../controller/cpl-mk-controller");
const cpl_bkmk_controller_1 = require("../controller/cpl-bkmk-controller");
const ml_cpmk_submk_controller_1 = require("../controller/ml-cpmk-submk-controller");
const cpl_cpmk_mk_controller_1 = require("../controller/cpl-cpmk-mk-controller");
const cpl_prodi_controller_1 = require("../controller/cpl-prodi-controller");
exports.apiRouter = express_1.default.Router();
exports.apiRouter.use(auth_middleware_1.authMiddleware);
exports.apiRouter.get("/api/users/current", user_controller_1.UserController.get);
exports.apiRouter.patch("/api/users/current", user_controller_1.UserController.update);
exports.apiRouter.delete("/api/users/current", user_controller_1.UserController.logout);
exports.apiRouter.post("/api/admins", admin_controller_1.AdminController.create); // Membuat Admin baru
exports.apiRouter.get("/api/admins", admin_controller_1.AdminController.search); // Mencari/Melihat daftar Admin
exports.apiRouter.get("/api/admins/:adminId", admin_controller_1.AdminController.get); // Mendapatkan detail Admin berdasarkan ID
exports.apiRouter.patch("/api/admins/:adminId", admin_controller_1.AdminController.update); // Mengupdate Admin berdasarkan ID
exports.apiRouter.delete("/api/admins/:adminId", admin_controller_1.AdminController.remove); // Menghapus Admin berdasarkan ID
exports.apiRouter.patch("/api/profesi/:kodeProfesi", profesi_controller_1.ProfesiController.update); // UPDATE Profesi
exports.apiRouter.delete("/api/profesi/:kodeProfesi", profesi_controller_1.ProfesiController.remove); // DELETE Profesi
// Opsional: Jika admin bisa CREATE dan GET (misal untuk dropdown)
exports.apiRouter.post("/api/profesi", profesi_controller_1.ProfesiController.create); // CREATE Profesi
exports.apiRouter.get("/api/profesi/:kodeProfesi", profesi_controller_1.ProfesiController.get); // GET Profesi by ID
exports.apiRouter.get("/api/profesi", profesi_controller_1.ProfesiController.getAll); // GET Profesi by ID
// apiRouter.get("/api/profesi", ProfesiController.search); // Jika ada search/list untuk profesi
exports.apiRouter.post("/api/profil-lulusan", profil_lulusan_controller_1.ProfilLulusanController.create);
exports.apiRouter.patch("/api/profil-lulusan/:plId", profil_lulusan_controller_1.ProfilLulusanController.update);
exports.apiRouter.delete("/api/profil-lulusan/:plId", profil_lulusan_controller_1.ProfilLulusanController.remove);
exports.apiRouter.get("/api/profil-lulusan/:plId", profil_lulusan_controller_1.ProfilLulusanController.get);
exports.apiRouter.get("/api/profil-lulusan", profil_lulusan_controller_1.ProfilLulusanController.search);
exports.apiRouter.post("/api/aspeks", aspek_controller_1.AspekController.create);
exports.apiRouter.get("/api/aspeks", aspek_controller_1.AspekController.search);
exports.apiRouter.get("/api/aspeks/:kodeAspek", aspek_controller_1.AspekController.get);
exports.apiRouter.patch("/api/aspeks/:kodeAspek", aspek_controller_1.AspekController.update);
exports.apiRouter.delete("/api/aspeks/:kodeAspek", aspek_controller_1.AspekController.remove);
exports.apiRouter.post("/api/cpl-prodi", cpl_prodi_controller_1.CPLProdiController.create);
exports.apiRouter.patch("/api/cpl-prodi/:kodeCPL", cpl_prodi_controller_1.CPLProdiController.update);
exports.apiRouter.delete("/api/cpl-prodi/:kodeCPL", cpl_prodi_controller_1.CPLProdiController.remove);
exports.apiRouter.get("/api/cpl-prodi/:kodeCPL", cpl_prodi_controller_1.CPLProdiController.get);
exports.apiRouter.get("/api/cpl-prodi", cpl_prodi_controller_1.CPLProdiController.search);
exports.apiRouter.post("/api/referensi", referensi_controller_1.ReferensiController.create);
exports.apiRouter.get("/api/referensi", referensi_controller_1.ReferensiController.search);
exports.apiRouter.get("/api/referensi/:kodeReferensi", referensi_controller_1.ReferensiController.get);
exports.apiRouter.patch("/api/referensi/:kodeReferensi", referensi_controller_1.ReferensiController.update);
exports.apiRouter.delete("/api/referensi/:kodeReferensi", referensi_controller_1.ReferensiController.remove);
exports.apiRouter.post("/api/bahan-kajian", bahan_kajian_controller_1.BahanKajianController.create);
exports.apiRouter.get("/api/bahan-kajian", bahan_kajian_controller_1.BahanKajianController.search);
exports.apiRouter.get("/api/bahan-kajian/:kodeBK", bahan_kajian_controller_1.BahanKajianController.get);
exports.apiRouter.patch("/api/bahan-kajian/:kodeBK", bahan_kajian_controller_1.BahanKajianController.update);
exports.apiRouter.delete("/api/bahan-kajian/:kodeBK", bahan_kajian_controller_1.BahanKajianController.remove);
exports.apiRouter.post("/api/mata-kuliah", mata_kuliah_controller_1.MataKuliahController.create);
exports.apiRouter.get("/api/mata-kuliah", mata_kuliah_controller_1.MataKuliahController.search);
exports.apiRouter.get("/api/mata-kuliah/:idmk", mata_kuliah_controller_1.MataKuliahController.get);
exports.apiRouter.patch("/api/mata-kuliah/:idmk", mata_kuliah_controller_1.MataKuliahController.update);
exports.apiRouter.delete("/api/mata-kuliah/:idmk", mata_kuliah_controller_1.MataKuliahController.remove);
exports.apiRouter.post("/api/sub-cpmk", sub_cpmk_controller_1.SubCPMKController.create);
exports.apiRouter.get("/api/sub-cpmk", sub_cpmk_controller_1.SubCPMKController.search);
exports.apiRouter.get("/api/sub-cpmk/:subCPMKId", sub_cpmk_controller_1.SubCPMKController.get);
exports.apiRouter.patch("/api/sub-cpmk/:subCPMKId", sub_cpmk_controller_1.SubCPMKController.update);
exports.apiRouter.delete("/api/sub-cpmk/:subCPMKId", sub_cpmk_controller_1.SubCPMKController.remove);
exports.apiRouter.post("/api/cpmks", cpmk_controller_1.CPMKController.create);
exports.apiRouter.get("/api/cpmks", cpmk_controller_1.CPMKController.search);
exports.apiRouter.get("/api/cpmks/:kodeCPMK", cpmk_controller_1.CPMKController.get);
exports.apiRouter.patch("/api/cpmks/:kodeCPMK", cpmk_controller_1.CPMKController.update);
exports.apiRouter.delete("/api/cpmks/:kodeCPMK", cpmk_controller_1.CPMKController.remove);
exports.apiRouter.post("/api/cpl-pl", cpl_pl_controller_1.CPLPLController.create);
exports.apiRouter.delete("/api/cpl-pl", cpl_pl_controller_1.CPLPLController.remove);
exports.apiRouter.get("/api/cpl-pl", cpl_pl_controller_1.CPLPLController.search);
exports.apiRouter.post("/api/cpl-bk", cpl_bk_controller_1.CPLBKController.create); // Membuat tautan
exports.apiRouter.delete("/api/cpl-bk", cpl_bk_controller_1.CPLBKController.remove); // Menghapus tautan (via body)
exports.apiRouter.get("/api/cpl-bk", cpl_bk_controller_1.CPLBKController.search);
exports.apiRouter.post("/api/bkmk", bkmk_controller_1.BKMKController.create); // Membuat tautan
exports.apiRouter.delete("/api/bkmk", bkmk_controller_1.BKMKController.remove); // Menghapus tautan (via body)
exports.apiRouter.get("/api/bkmk", bkmk_controller_1.BKMKController.search);
exports.apiRouter.post("/api/cpl-mk", cpl_mk_controller_1.CPLMKController.create); // Membuat tautan
exports.apiRouter.delete("/api/cpl-mk", cpl_mk_controller_1.CPLMKController.remove); // Menghapus tautan (via body)
exports.apiRouter.get("/api/cpl-mk", cpl_mk_controller_1.CPLMKController.search);
exports.apiRouter.post("/api/cpl-bkmk", cpl_bkmk_controller_1.CPLBKMKController.create); // Membuat tautan
exports.apiRouter.delete("/api/cpl-bkmk", cpl_bkmk_controller_1.CPLBKMKController.remove); // Menghapus tautan (via body)
exports.apiRouter.get("/api/cpl-bkmk", cpl_bkmk_controller_1.CPLBKMKController.search);
exports.apiRouter.post("/api/ml-cpmk-submk", ml_cpmk_submk_controller_1.MLCPMKSubMKController.create); // Membuat tautan
exports.apiRouter.delete("/api/ml-cpmk-submk", ml_cpmk_submk_controller_1.MLCPMKSubMKController.remove); // Menghapus tautan (via body)
exports.apiRouter.get("/api/ml-cpmk-submk", ml_cpmk_submk_controller_1.MLCPMKSubMKController.search);
exports.apiRouter.post("/api/cpl-cpmk-mk", cpl_cpmk_mk_controller_1.CPLCPMKMKController.create); // Membuat tautan
exports.apiRouter.delete("/api/cpl-cpmk-mk", cpl_cpmk_mk_controller_1.CPLCPMKMKController.remove); // Menghapus tautan (via body)
exports.apiRouter.get("/api/cpl-cpmk-mk", cpl_cpmk_mk_controller_1.CPLCPMKMKController.search);
