import { NextFunction, Response } from "express";
import { CreateMataKuliahRequest, UpdateMataKuliahRequest, SearchMataKuliahRequest, MataKuliahResponse } from "../model/mata-kuliah-model"; // Adjust path as needed
import { MataKuliahService } from "../service/mata-kuliah-service";
import { logger } from "../application/logging";
import { ResponseError } from "../error/response-error";
import {UserRequest} from "../type/user-request";

export class MataKuliahController {

    // Helper method for authorization
    private static authorizeAdmin(user: UserRequest['user']) {
        if (!user || user.user_type !== 'Admin') {
            throw new ResponseError(403, "Forbidden: Only administrators can perform this action.");
        }
    }

    static async create(req: UserRequest, res: Response, next: NextFunction) {
        try {
            MataKuliahController.authorizeAdmin(req.user); // Authorize admin
            const request: CreateMataKuliahRequest = req.body as CreateMataKuliahRequest;
            const response: MataKuliahResponse = await MataKuliahService.create(request);

            logger.debug(response);
            res.status(201).json({ data: response });
        } catch (e) {
            next(e);
        }
    }

    static async get(req: UserRequest, res: Response, next: NextFunction) {
        try {
            MataKuliahController.authorizeAdmin(req.user);
            const idmk: string = req.params.idmk;
            const response: MataKuliahResponse = await MataKuliahService.get(idmk);

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
            const response: MataKuliahResponse = await MataKuliahService.update(idmk, request);

            logger.debug(response);
            res.status(200).json({ data: response });
        } catch (e) {
            next(e);
        }
    }

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

    static async search(req: UserRequest, res: Response, next: NextFunction) {
        try {
            MataKuliahController.authorizeAdmin(req.user);
            const request: SearchMataKuliahRequest = {
                idmk: req.query.idmk as string | undefined,
                namaMk: req.query.namaMk as string | undefined,
                kodeSemester: req.query.kodeSemester as string | undefined,
                jenisMKId: req.query.jenisMKId as string | undefined,
                kelompokMKId: req.query.kelompokMKId as string | undefined,
                lingkupKelasId: req.query.lingkupKelasId as string | undefined,
                modeKuliahId: req.query.modeKuliahId as string | undefined,
                metodePembelajaranId: req.query.metodePembelajaranId as string | undefined,
                page: req.query.page ? Number(req.query.page) : undefined,
                size: req.query.size ? Number(req.query.size) : undefined,
            };

            const [response, total] = await MataKuliahService.search(request); // Call service

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