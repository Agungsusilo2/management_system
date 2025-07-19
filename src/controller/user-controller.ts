import {Request,Response,NextFunction} from "express"
import {CreateUserRequest, LoginUserRequest, UpdateUserRequest} from "../model/user-model";
import {UserService} from "../service/user-service";
import {UserRequest} from "../type/user-request";
import {logger} from "../application/logging";


export class UserController{
    static async register(req:Request,res:Response, next:NextFunction){
        try {
            const request:CreateUserRequest = req.body as CreateUserRequest
            const response = await UserService.register(request)
            res.status(200).json({
                data:response
            })
        }catch (e){
            next(e)
        }
    }


    static async login(req:Request,res:Response,next:NextFunction){
        try{
            const request:LoginUserRequest = req.body as LoginUserRequest
            const response = await UserService.login(request)
            res.status(200).json({
                data:response
            })
        }catch (e){
            next(e)
        }
    }

    static async get(req:UserRequest,res:Response,next:NextFunction){
        try{
            const response = await UserService.get(req.user!)
            res.status(200).json({
                data:response
            })
        }catch (e){
            next(e)
        }
    }


    static async update(req:UserRequest,res:Response,next:NextFunction){
        try{
            const request:UpdateUserRequest = req.body as UpdateUserRequest
            const response = await UserService.update(req.user!,request)
            res.status(200).json({
                data:response
            })
        }catch (e){
            next(e)
        }
    }

    static async logout(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const response = await UserService.delete(req.user!);
            res.status(200).json({ data: response });
        } catch (e) {
            next(e);
        }
    }

    static async getAll(req: UserRequest, res: Response, next: NextFunction) {
        try {

            const page = req.query.page ? Number(req.query.page) : undefined;
            const size = req.query.size ? Number(req.query.size) : undefined;

            const [response, total] = await UserService.getAll(page, size);

            logger.debug(response);
            res.status(200).json({
                data: response,
                paging: {
                    page: page || 1,
                    size: size || 10,
                    total_item: total,
                    total_page: Math.ceil(total / (size || 10))
                }
            });
        } catch (e) {
            next(e);
        }
    }
}