// src/controller/profil-lulusan-controller.ts

// ... (imports)

import {UserRequest} from "../type/user-request";
import {ResponseError} from "../error/response-error";
import {NextFunction,Response} from "express";
import {
    CreateProfilLulusanRequest,
    SearchProfilLulusanRequest,
    UpdateProfilLulusanRequest
} from "../model/profile-lulusan-model";
import {ProfilLulusanService} from "../service/profil-lulusan-service";
import {logger} from "../application/logging";

export class ProfilLulusanController {

    private static authorizeAdmin(user: UserRequest['user']) {
        if (!user || user.user_type !== 'Admin') {
            throw new ResponseError(403, "Forbidden: Only administrators can perform this action.");
        }
    }

    // --- CREATE ---
    static async create(req: UserRequest, res: Response, next: NextFunction) {
        try {
            ProfilLulusanController.authorizeAdmin(req.user);
            const request: CreateProfilLulusanRequest = req.body as CreateProfilLulusanRequest;
            const response = await ProfilLulusanService.create(request);

            logger.debug(response);
            res.status(201).json({ data: response });
        } catch (e) {
            next(e);
        }
    }

    // --- GET by ID ---
    static async get(req: UserRequest, res: Response, next: NextFunction) {
        try {
            // ProfilLulusanController.authorizeAdmin(req.user); // Uncomment if only admin can GET
            const kodePL: string = req.params.kodePL; // Ambil ID dari params
            const response = await ProfilLulusanService.get(kodePL);

            logger.debug(response);
            res.status(200).json({ data: response });
        } catch (e) {
            next(e);
        }
    }

    // --- UPDATE ---
    static async update(req: UserRequest, res: Response, next: NextFunction) {
        try {
            ProfilLulusanController.authorizeAdmin(req.user);
            const kodePL: string = req.params.plId;            console.log("1223:",kodePL)
            const request: UpdateProfilLulusanRequest = req.body as UpdateProfilLulusanRequest;
            const response = await ProfilLulusanService.update(kodePL, request);

            logger.debug(response);
            res.status(200).json({ data: response });
        } catch (e) {
            next(e);
        }
    }

    // --- DELETE ---
    static async remove(req: UserRequest, res: Response, next: NextFunction) {
        try {
            ProfilLulusanController.authorizeAdmin(req.user);
            const kodePL: string = req.params.plId;
            await ProfilLulusanService.remove(kodePL);

            logger.debug("Profil Lulusan removed successfully");
            res.status(200).json({ data: "OK" });
        } catch (e) {
            next(e);
        }
    }

    // --- SEARCH / LIST ---
    static async search(req: UserRequest, res: Response, next: NextFunction) {
        try {
            // ProfilLulusanController.authorizeAdmin(req.user); // Uncomment if only admin can SEARCH
            const request: SearchProfilLulusanRequest = {
                deskripsi: req.query.deskripsi as string | undefined,
                kodeProfesi: req.query.kodeProfesi as string | undefined,
                page: req.query.page ? Number(req.query.page) : undefined,
                size: req.query.size ? Number(req.query.size) : undefined,
            };

            const [response, total] = await ProfilLulusanService.search(request);

            res.status(200).json({
                data: response,
                paging: {
                    page: request.page || 1,
                    size: request.size || 10,
                    total_item: total,
                    total_page: Math.ceil(total / (request.size || 10))
                }
            });
        } catch (e) {
            next(e);
        }
    }
}