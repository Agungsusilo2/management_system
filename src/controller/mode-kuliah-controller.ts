import {logger} from "../application/logging";
import {ModeKuliahService} from "../service/mode-kuliah-service";
import {
    CreateModeKuliahRequest,
    ModeKuliahResponse,
    SearchModeKuliahRequest,
    UpdateModeKuliahRequest
} from "../model/mode-kuliah";
import {NextFunction,Response} from "express";
import {UserRequest} from "../type/user-request";
import {ResponseError} from "../error/response-error";

class AuthUtil {
    static authorizeAdmin(user: UserRequest['user']) {
        if (!user || user.user_type !== 'Admin') {
            throw new ResponseError(403, "Forbidden: Only administrators can perform this action.");
        }
    }
}

export class ModeKuliahController {
    static async create(req: UserRequest, res: Response, next: NextFunction) {
        try {
            AuthUtil.authorizeAdmin(req.user);
            const request: CreateModeKuliahRequest = req.body as CreateModeKuliahRequest;
            const response: ModeKuliahResponse = await ModeKuliahService.create(request);

            logger.debug(response);
            res.status(201).json({ data: response });
        } catch (e) {
            next(e);
        }
    }

    static async get(req: UserRequest, res: Response, next: NextFunction) {
        try {
            AuthUtil.authorizeAdmin(req.user);
            const idModeKuliah: string = req.params.idModeKuliah;
            const response: ModeKuliahResponse = await ModeKuliahService.get(idModeKuliah);

            logger.debug(response);
            res.status(200).json({ data: response });
        } catch (e) {
            next(e);
        }
    }

    static async update(req: UserRequest, res: Response, next: NextFunction) {
        try {
            AuthUtil.authorizeAdmin(req.user);
            const idModeKuliah: string = req.params.idModeKuliah;
            const request: UpdateModeKuliahRequest = req.body as UpdateModeKuliahRequest;
            const response: ModeKuliahResponse = await ModeKuliahService.update(idModeKuliah, request);

            logger.debug(response);
            res.status(200).json({ data: response });
        } catch (e) {
            next(e);
        }
    }

    static async remove(req: UserRequest, res: Response, next: NextFunction) {
        try {
            AuthUtil.authorizeAdmin(req.user);
            const idModeKuliah: string = req.params.idModeKuliah;
            await ModeKuliahService.remove(idModeKuliah);

            logger.debug("Mode Kuliah removed successfully");
            res.status(200).json({ data: "OK" });
        } catch (e) {
            next(e);
        }
    }

    static async search(req: UserRequest, res: Response, next: NextFunction) {
        try {
            AuthUtil.authorizeAdmin(req.user);
            const request: SearchModeKuliahRequest = {
                namaModeKuliah: req.query.namaModeKuliah as string | undefined,
                page: req.query.page ? Number(req.query.page) : undefined,
                size: req.query.size ? Number(req.query.size) : undefined,
            };

            const [response, total] = await ModeKuliahService.search(request);

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