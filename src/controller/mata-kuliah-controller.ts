// src/controller/mata-kuliah-controller.ts

import { NextFunction, Response } from "express";
import { CreateMataKuliahRequest, UpdateMataKuliahRequest, SearchMataKuliahRequest } from "../model/mata-kuliah-model";
import { MataKuliahService } from "../service/mata-kuliah-service";
import { logger } from "../application/logging";
import { ResponseError } from "../error/response-error";
import {UserRequest} from "../type/user-request";

export class MataKuliahController {

    private static authorizeAdmin(user: UserRequest['user']) {
        if (!user || user.user_type !== 'Admin') {
            throw new ResponseError(403, "Forbidden: Only administrators can perform this action.");
        }
    }

    // --- CREATE ---
    static async create(req: UserRequest, res: Response, next: NextFunction) {
        try {
            MataKuliahController.authorizeAdmin(req.user);
            const request: CreateMataKuliahRequest = req.body as CreateMataKuliahRequest;
            const response = await MataKuliahService.create(request);

            logger.debug(response);
            res.status(201).json({ data: response });
        } catch (e) {
            next(e);
        }
    }

    // --- GET by ID ---
    static async get(req: UserRequest, res: Response, next: NextFunction) {
        try {
            MataKuliahController.authorizeAdmin(req.user); // Admin-only GET
            const idmk: string = req.params.idmk;
            const response = await MataKuliahService.get(idmk);

            logger.debug(response);
            res.status(200).json({ data: response });
        } catch (e) {
            next(e);
        }
    }

    // --- UPDATE ---
    static async update(req: UserRequest, res: Response, next: NextFunction) {
        try {
            MataKuliahController.authorizeAdmin(req.user);
            const idmk: string = req.params.idmk;
            const request: UpdateMataKuliahRequest = req.body as UpdateMataKuliahRequest;
            const response = await MataKuliahService.update(idmk, request);

            logger.debug(response);
            res.status(200).json({ data: response });
        } catch (e) {
            next(e);
        }
    }

    // --- DELETE ---
    static async remove(req: UserRequest, res: Response, next: NextFunction) {
        try {
            MataKuliahController.authorizeAdmin(req.user);
            const idmk: string = req.params.idmk;
            await MataKuliahService.remove(idmk);

            logger.debug("Mata Kuliah removed successfully");
            res.status(200).json({ data: "OK" });
        } catch (e) {
            next(e);
        }
    }

    // --- SEARCH / LIST ---
    static async search(req: UserRequest, res: Response, next: NextFunction) {
        try {
            MataKuliahController.authorizeAdmin(req.user); // Admin-only SEARCH
            const request: SearchMataKuliahRequest = {
                namaMk: req.query.namaMk as string | undefined,
                page: req.query.page ? Number(req.query.page) : undefined,
                size: req.query.size ? Number(req.query.size) : undefined,
            };

            const [response, total] = await MataKuliahService.search(request);

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