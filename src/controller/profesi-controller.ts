// src/controller/profesi-controller.ts

import { NextFunction, Response } from "express";
import { UserRequest } from "../type/user-request"; // Asumsi Anda punya tipe ini
import { UpdateProfesiRequest } from "../model/profesi-model";
import { ProfesiService } from "../service/profesi-service";
import { logger } from "../application/logging";
import { ResponseError } from "../error/response-error";

export class ProfesiController {

    private static authorizeAdmin(user: UserRequest['user']) {
        if (!user || user.user_type !== 'Admin') {
            throw new ResponseError(403, "Forbidden: Only administrators can perform this action.");
        }
    }

    static async update(req: UserRequest, res: Response, next: NextFunction) {
        try {
            ProfesiController.authorizeAdmin(req.user);
            const kodeProfesi: string = req.params.kodeProfesi;
            const request: UpdateProfesiRequest = req.body as UpdateProfesiRequest;
            const response = await ProfesiService.update(kodeProfesi, request);

            logger.debug(response);
            res.status(200).json({
                data: response
            });
        } catch (e) {
            next(e);
        }
    }

    static async remove(req: UserRequest, res: Response, next: NextFunction) {
        try {
            ProfesiController.authorizeAdmin(req.user);
            const kodeProfesi: string = req.params.kodeProfesi;
            await ProfesiService.remove(kodeProfesi);

            logger.debug("Profesi removed successfully");
            res.status(200).json({
                data: "OK"
            });
        } catch (e) {
            next(e);
        }
    }

    static async create(req: UserRequest, res: Response, next: NextFunction) {
        try {
            ProfesiController.authorizeAdmin(req.user);
            const request = req.body as { KodeProfesi: string, Profesi: string };
            const response = await ProfesiService.create(request);

            logger.debug(response);
            res.status(201).json({ data: response });
        } catch (e) {
            next(e);
        }
    }


    static async getAll(req: UserRequest, res: Response, next: NextFunction) {
        try {

            const response = await ProfesiService.getAll();
            res.status(200).json({ data: response });
        } catch (e) {
            next(e);
        }
    }



    static async get(req: UserRequest, res: Response, next: NextFunction) {
        try {
            // Jika hanya admin: ProfesiController.authorizeAdmin(req.user);
            const kodeProfesi: string = req.params.kodeProfesi;
            const response = await ProfesiService.get(kodeProfesi);

            res.status(200).json({ data: response });
        } catch (e) {
            next(e);
        }
    }
}