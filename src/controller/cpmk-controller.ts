// src/controller/cpmk-controller.ts

import { NextFunction, Response } from "express";
import { UserRequest } from "../type/user-request";
import { CreateCPMKRequest, UpdateCPMKRequest, SearchCPMKRequest } from "../model/cpmk-model";
import { CPMKService } from "../service/cpmk-service";
import { logger } from "../application/logging";
import { ResponseError } from "../error/response-error";

export class CPMKController {

    private static authorizeAdmin(user: UserRequest['user']) {
        if (!user || user.user_type !== 'Admin') {
            throw new ResponseError(403, "Forbidden: Only administrators can perform this action.");
        }
    }

    // --- CREATE ---
    static async create(req: UserRequest, res: Response, next: NextFunction) {
        try {
            CPMKController.authorizeAdmin(req.user);
            const request: CreateCPMKRequest = req.body as CreateCPMKRequest;
            const response = await CPMKService.create(request);

            logger.debug(response);
            res.status(201).json({ data: response });
        } catch (e) {
            next(e);
        }
    }

    // --- GET by ID ---
    static async get(req: UserRequest, res: Response, next: NextFunction) {
        try {
            CPMKController.authorizeAdmin(req.user); // Admin-only GET
            const kodeCPMK: string = req.params.kodeCPMK;
            const response = await CPMKService.get(kodeCPMK);

            logger.debug(response);
            res.status(200).json({ data: response });
        } catch (e) {
            next(e);
        }
    }

    // --- UPDATE ---
    static async update(req: UserRequest, res: Response, next: NextFunction) {
        try {
            CPMKController.authorizeAdmin(req.user);
            const kodeCPMK: string = req.params.kodeCPMK;
            const request: UpdateCPMKRequest = req.body as UpdateCPMKRequest;
            const response = await CPMKService.update(kodeCPMK, request);

            logger.debug(response);
            res.status(200).json({ data: response });
        } catch (e) {
            next(e);
        }
    }

    // --- DELETE ---
    static async remove(req: UserRequest, res: Response, next: NextFunction) {
        try {
            CPMKController.authorizeAdmin(req.user);
            const kodeCPMK: string = req.params.kodeCPMK;
            await CPMKService.remove(kodeCPMK);

            logger.debug("CPMK removed successfully");
            res.status(200).json({ data: "OK" });
        } catch (e) {
            next(e);
        }
    }

    // --- SEARCH / LIST ---
    static async search(req: UserRequest, res: Response, next: NextFunction) {
        try {
            CPMKController.authorizeAdmin(req.user); // Admin-only SEARCH
            const request: SearchCPMKRequest = {
                namaCPMK: req.query.namaCPMK as string | undefined,
                subCPMKId: req.query.subCPMKId as string | undefined,
                // idmk: req.query.idmk as string | undefined,
                page: req.query.page ? Number(req.query.page) : undefined,
                size: req.query.size ? Number(req.query.size) : undefined,
            };

            const [response, total] = await CPMKService.search(request);

            logger.debug(response);
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