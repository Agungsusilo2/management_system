// src/controller/admin-controller.ts

import {UserRequest} from "../type/user-request";
import {NextFunction,Response} from "express";
import {CreateAdminRequest, UpdateAdminRequest, SearchAdminRequest} from "../model/admin-model"; // Import tipe baru
import {AdminService} from "../service/admin-service";
import {logger} from "../application/logging";

export class AdminController{
    static async create(req:UserRequest,res:Response,next:NextFunction){
        try{
            const request:CreateAdminRequest = req.body as CreateAdminRequest
            const response = await AdminService.create(req.user!,request) // req.user! adalah user yang sedang login

            logger.debug(response)
            res.status(201).json({ // Gunakan 201 Created untuk operasi pembuatan resource
                data: response
            })
        }catch (e){
            next(e)
        }
    }

    // Metode GET (sudah ada)
    // Endpoint: GET /api/admins/:adminId
    static async get(req:UserRequest,res:Response,next:NextFunction){
        try{
            const adminId: string = req.params.adminId; // Ambil ID dari params
            const response = await AdminService.get(req.user!, adminId);

            logger.debug(response);
            res.status(200).json({
                data: response
            });
        }catch (e){
            next(e);
        }
    }

    // --- METODE BARU: UPDATE ---
    // Endpoint: PATCH /api/admins/:adminId
    static async update(req:UserRequest,res:Response,next:NextFunction){
        try{
            const adminId: string = req.params.adminId;
            const request:UpdateAdminRequest = req.body as UpdateAdminRequest;
            const response = await AdminService.update(req.user!, adminId, request);

            logger.debug(response);
            res.status(200).json({
                data: response
            });
        }catch (e){
            next(e);
        }
    }

    // --- METODE BARU: DELETE ---
    // Endpoint: DELETE /api/admins/:adminId
    static async remove(req:UserRequest,res:Response,next:NextFunction){
        try{
            const adminId: string = req.params.adminId;
            await AdminService.remove(req.user!, adminId);

            logger.debug("Admin removed successfully");
            res.status(200).json({
                data: "OK" // Atau pesan sukses lainnya
            });
        }catch (e){
            next(e);
        }
    }

    // --- METODE BARU: SEARCH/LIST ---
    // Endpoint: GET /api/admins
    static async search(req:UserRequest,res:Response,next:NextFunction){
        try{
            // Ambil query params dari request
            const request:SearchAdminRequest = {
                nipAdmin: req.query.nipAdmin as string | undefined,
                jabatan: req.query.jabatan as string | undefined,
                page: req.query.page ? Number(req.query.page) : undefined,
                size: req.query.size ? Number(req.query.size) : undefined,
            };

            const [response, total] = await AdminService.search(request);

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
        }catch (e){
            next(e);
        }
    }
}