import {UserRequest} from "../type/user-request";
import {NextFunction,Response} from "express";
import {
    CreateSKSMataKuliahRequest, SearchSKSMataKuliahRequest,
    SKSMataKuliahResponse,
    UpdateSKSMataKuliahRequest
} from "../model/sks-matakuliah-model";
import {SKSMataKuliahService} from "../service/sks-semester-service";
import {logger} from "../application/logging";
import {ResponseError} from "../error/response-error";

class AuthUtil {
    static authorizeAdmin(user: UserRequest['user']) {
        if (!user || user.user_type !== 'Admin') {
            throw new ResponseError(403, "Forbidden: Only administrators can perform this action.");
        }
    }
}


export class SKSMataKuliahController {
    static async create(req: UserRequest, res: Response, next: NextFunction) {
        try {
            AuthUtil.authorizeAdmin(req.user);
            const request: CreateSKSMataKuliahRequest = req.body as CreateSKSMataKuliahRequest;
            const response: SKSMataKuliahResponse = await SKSMataKuliahService.create(request);

            logger.debug(response);
            res.status(201).json({ data: response });
        } catch (e) {
            next(e);
        }
    }

    static async get(req: UserRequest, res: Response, next: NextFunction) {
        try {
            AuthUtil.authorizeAdmin(req.user);
            const kodeSKS: string = req.params.kodeSKS;
            const response: SKSMataKuliahResponse = await SKSMataKuliahService.get(kodeSKS);

            logger.debug(response);
            res.status(200).json({ data: response });
        } catch (e) {
            next(e);
        }
    }

    static async update(req: UserRequest, res: Response, next: NextFunction) {
        try {
            AuthUtil.authorizeAdmin(req.user);
            const kodeSKS: string = req.params.kodeSKS;
            const request: UpdateSKSMataKuliahRequest = req.body as UpdateSKSMataKuliahRequest;
            const response: SKSMataKuliahResponse = await SKSMataKuliahService.update(kodeSKS, request);

            logger.debug(response);
            res.status(200).json({ data: response });
        } catch (e) {
            next(e);
        }
    }

    static async remove(req: UserRequest, res: Response, next: NextFunction) {
        try {
            AuthUtil.authorizeAdmin(req.user);
            const kodeSKS: string = req.params.kodeSKS;
            await SKSMataKuliahService.remove(kodeSKS);

            logger.debug("SKS Mata Kuliah removed successfully");
            res.status(200).json({ data: "OK" });
        } catch (e) {
            next(e);
        }
    }

    static async search(req: UserRequest, res: Response, next: NextFunction) {
        try {
            AuthUtil.authorizeAdmin(req.user);
            const request: SearchSKSMataKuliahRequest = {
                idmk: req.query.idmk as string | undefined,
                page: req.query.page ? Number(req.query.page) : undefined,
                size: req.query.size ? Number(req.query.size) : undefined,
            };

            const [response, total] = await SKSMataKuliahService.search(request);

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
