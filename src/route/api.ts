
import express from "express";
import {authMiddleware} from "../middleware/auth-middleware";
import {UserController} from "../controller/user-controller";
import {AdminController} from "../controller/admin-controller";
import {ProfesiController} from "../controller/profesi-controller";
import {ProfilLulusanController} from "../controller/profil-lulusan-controller";
import {AspekController} from "../controller/aspek-controller";
import {ReferensiController} from "../controller/referensi-controller";
import {BahanKajianController} from "../controller/bahan-kajian-controller";
import {MataKuliahController} from "../controller/mata-kuliah-controller";
import {SubCPMKController} from "../controller/sub-cpmk-controller";
import {CPMKController} from "../controller/cpmk-controller";
import {CPLPLController} from "../controller/cpl-pl-controller";
import {CPLBKController} from "../controller/cpl-bk-controller";
import {BKMKController} from "../controller/bkmk-controller";
import {CPLMKController} from "../controller/cpl-mk-controller";
import {CPLBKMKController} from "../controller/cpl-bkmk-controller";
import {MLCPMKSubMKController} from "../controller/ml-cpmk-submk-controller";
import {CPLCPMKMKController} from "../controller/cpl-cpmk-mk-controller";
import {CPLProdiController} from "../controller/cpl-prodi-controller";

export const apiRouter = express.Router();

apiRouter.use(authMiddleware);

apiRouter.get("/api/users/current", UserController.get);
apiRouter.patch("/api/users/current", UserController.update);
apiRouter.delete("/api/users/current",UserController.logout)

apiRouter.post("/api/admins", AdminController.create);
apiRouter.get("/api/admins", AdminController.search);
apiRouter.get("/api/admins/:adminId", AdminController.get);
apiRouter.patch("/api/admins/:adminId", AdminController.update);
apiRouter.delete("/api/admins/:adminId", AdminController.remove);


apiRouter.patch("/api/profesi/:kodeProfesi", ProfesiController.update);
apiRouter.delete("/api/profesi/:kodeProfesi", ProfesiController.remove);

apiRouter.post("/api/profesi", ProfesiController.create);
apiRouter.get("/api/profesi/:kodeProfesi", ProfesiController.get);
apiRouter.get("/api/profesi", ProfesiController.getAll);
// apiRouter.get("/api/profesi", ProfesiController.search);

apiRouter.post("/api/profil-lulusan", ProfilLulusanController.create);
apiRouter.patch("/api/profil-lulusan/:plId", ProfilLulusanController.update);
apiRouter.delete("/api/profil-lulusan/:plId", ProfilLulusanController.remove);
apiRouter.get("/api/profil-lulusan/:plId", ProfilLulusanController.get);
apiRouter.get("/api/profil-lulusan", ProfilLulusanController.search);


apiRouter.post("/api/aspeks", AspekController.create);
apiRouter.get("/api/aspeks", AspekController.search);
apiRouter.get("/api/aspeks/:kodeAspek", AspekController.get);
apiRouter.patch("/api/aspeks/:kodeAspek", AspekController.update);
apiRouter.delete("/api/aspeks/:kodeAspek", AspekController.remove);


apiRouter.post("/api/cpl-prodi", CPLProdiController.create);
apiRouter.patch("/api/cpl-prodi/:kodeCPL", CPLProdiController.update);
apiRouter.delete("/api/cpl-prodi/:kodeCPL", CPLProdiController.remove);
apiRouter.get("/api/cpl-prodi/:kodeCPL", CPLProdiController.get);
apiRouter.get("/api/cpl-prodi", CPLProdiController.search);

apiRouter.post("/api/referensi", ReferensiController.create);
apiRouter.get("/api/referensi", ReferensiController.search);
apiRouter.get("/api/referensi/:kodeReferensi", ReferensiController.get);
apiRouter.patch("/api/referensi/:kodeReferensi", ReferensiController.update);
apiRouter.delete("/api/referensi/:kodeReferensi", ReferensiController.remove);


apiRouter.post("/api/bahan-kajian", BahanKajianController.create);
apiRouter.get("/api/bahan-kajian", BahanKajianController.search);
apiRouter.get("/api/bahan-kajian/:kodeBK", BahanKajianController.get);
apiRouter.patch("/api/bahan-kajian/:kodeBK", BahanKajianController.update);
apiRouter.delete("/api/bahan-kajian/:kodeBK", BahanKajianController.remove);


apiRouter.post("/api/mata-kuliah", MataKuliahController.create);
apiRouter.get("/api/mata-kuliah", MataKuliahController.search);
apiRouter.get("/api/mata-kuliah/:idmk", MataKuliahController.get);
apiRouter.patch("/api/mata-kuliah/:idmk", MataKuliahController.update);
apiRouter.delete("/api/mata-kuliah/:idmk", MataKuliahController.remove);


apiRouter.post("/api/sub-cpmk", SubCPMKController.create);
apiRouter.get("/api/sub-cpmk", SubCPMKController.search);
apiRouter.get("/api/sub-cpmk/:subCPMKId", SubCPMKController.get);
apiRouter.patch("/api/sub-cpmk/:subCPMKId", SubCPMKController.update);
apiRouter.delete("/api/sub-cpmk/:subCPMKId", SubCPMKController.remove);


apiRouter.post("/api/cpmks", CPMKController.create);
apiRouter.get("/api/cpmks", CPMKController.search);
apiRouter.get("/api/cpmks/:kodeCPMK", CPMKController.get);
apiRouter.patch("/api/cpmks/:kodeCPMK", CPMKController.update);
apiRouter.delete("/api/cpmks/:kodeCPMK", CPMKController.remove);


apiRouter.post("/api/cpl-pl", CPLPLController.create);
apiRouter.delete("/api/cpl-pl", CPLPLController.remove);
apiRouter.get("/api/cpl-pl", CPLPLController.search);

apiRouter.post("/api/cpl-bk", CPLBKController.create);
apiRouter.delete("/api/cpl-bk", CPLBKController.remove);
apiRouter.get("/api/cpl-bk", CPLBKController.search);

apiRouter.post("/api/bkmk", BKMKController.create);
apiRouter.delete("/api/bkmk", BKMKController.remove);
apiRouter.get("/api/bkmk", BKMKController.search);

apiRouter.post("/api/cpl-mk", CPLMKController.create);
apiRouter.delete("/api/cpl-mk", CPLMKController.remove);
apiRouter.get("/api/cpl-mk", CPLMKController.search)


apiRouter.post("/api/cpl-bkmk", CPLBKMKController.create);
apiRouter.delete("/api/cpl-bkmk", CPLBKMKController.remove);
apiRouter.get("/api/cpl-bkmk", CPLBKMKController.search);

apiRouter.post("/api/ml-cpmk-submk", MLCPMKSubMKController.create);
apiRouter.delete("/api/ml-cpmk-submk", MLCPMKSubMKController.remove);
apiRouter.get("/api/ml-cpmk-submk", MLCPMKSubMKController.search);

apiRouter.post("/api/cpl-cpmk-mk", CPLCPMKMKController.create);
apiRouter.delete("/api/cpl-cpmk-mk", CPLCPMKMKController.remove);
apiRouter.get("/api/cpl-cpmk-mk", CPLCPMKMKController.search);