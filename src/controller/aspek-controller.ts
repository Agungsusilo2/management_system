// src/controller/aspek-controller.ts

import { NextFunction, Response } from "express";
import { UserRequest } from "../type/user-request";
import { CreateAspekRequest, UpdateAspekRequest, SearchAspekRequest } from "../model/aspek-model";
import { AspekService } from "../service/aspek-service";
import { logger } from "../application/logging";
import { ResponseError } from "../error/response-error";

export class AspekController {

    private static authorizeAdmin(user: UserRequest['user']) {
        if (!user || user.user_type !== 'Admin') {
            throw new ResponseError(403, "Forbidden: Only administrators can perform this action.");
        }
    }

    // --- CREATE ---
    static async create(req: UserRequest, res: Response, next: NextFunction) {
        try {
            AspekController.authorizeAdmin(req.user);
            const request: CreateAspekRequest = req.body as CreateAspekRequest;
            const response = await AspekService.create(request);

            logger.debug(response);
            res.status(201).json({ data: response });
        } catch (e) {
            next(e);
        }
    }

    // --- GET by ID ---
    static async get(req: UserRequest, res: Response, next: NextFunction) {
        try {
            AspekController.authorizeAdmin(req.user); // Admin-only GET
            const kodeAspek: string = req.params.kodeAspek;
            const response = await AspekService.get(kodeAspek);

            logger.debug(response);
            res.status(200).json({ data: response });
        } catch (e) {
            next(e);
        }
    }

    // --- UPDATE ---
    static async update(req: UserRequest, res: Response, next: NextFunction) {
        try {
            AspekController.authorizeAdmin(req.user);
            const kodeAspek: string = req.params.kodeAspek;
            const request: UpdateAspekRequest = req.body as UpdateAspekRequest;
            const response = await AspekService.update(kodeAspek, request);

            logger.debug(response);
            res.status(200).json({ data: response });
        } catch (e) {
            next(e);
        }
    }

    // --- DELETE ---
    static async remove(req: UserRequest, res: Response, next: NextFunction) {
        try {
            AspekController.authorizeAdmin(req.user);
            const kodeAspek: string = req.params.kodeAspek;
            await AspekService.remove(kodeAspek);

            logger.debug("Aspek removed successfully");
            res.status(200).json({ data: "OK" });
        } catch (e) {
            next(e);
        }
    }

    // --- SEARCH / LIST ---
    static async search(req: UserRequest, res: Response, next: NextFunction) {
        try {
            AspekController.authorizeAdmin(req.user); // Admin-only SEARCH
            const request: SearchAspekRequest = {
                namaAspek: req.query.namaAspek as string | undefined,
                page: req.query.page ? Number(req.query.page) : undefined,
                size: req.query.size ? Number(req.query.size) : undefined,
            };

            const [response, total] = await AspekService.search(request);

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