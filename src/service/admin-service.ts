
import {User} from "../../generated/prisma";
import {
    AdminResponse,
    CreateAdminRequest,
    SearchAdminRequest,
    toAdminResponse,
    UpdateAdminRequest
} from "../model/admin-model"; // Import tipe baru
import {Validation} from "../validation/validation";
import {AdminValidation} from "../validation/admin-validation";
import {prismaClient} from "../application/database";
import {ResponseError} from "../error/response-error";

export class AdminService{
    static async create(user:User, request:CreateAdminRequest):Promise<AdminResponse>{
        const createRequest = Validation.validate(AdminValidation.CREATE, request);

        const existingAdmin = await prismaClient.admin.findUnique({
            where: { userId: user.id }
        });
        if (existingAdmin) {
            throw new ResponseError(400, "User already has an admin profile.");
        }

        const dataToCreate = {
            nipAdmin: createRequest.nipAdmin,
            jabatan: createRequest.jabatan,
            phoneNumber: createRequest.phoneNumber,
            address: createRequest.address,
            user: { 
                connect: {
                    id: user.id
                }
            }
        };

        const newAdmin = await prismaClient.admin.create({
            data: dataToCreate
        });

        return toAdminResponse(newAdmin);
    }

    static async get(user:User, adminId:string):Promise<AdminResponse>{
        adminId = Validation.validate(AdminValidation.ADMIN_ID, adminId);

        const admin = await prismaClient.admin.findUnique({
            where:{
                id: adminId,
            }
        });

        if(!admin){
            throw new ResponseError(404,"Admin not found");
        }
        return toAdminResponse(admin);
    }

    static async update(user:User, adminId:string, request:UpdateAdminRequest):Promise<AdminResponse>{
        adminId = Validation.validate(AdminValidation.ADMIN_ID, adminId);
        const updateRequest = Validation.validate(AdminValidation.UPDATE, request);

        const existingAdmin = await prismaClient.admin.findUnique({
            where:{
                id: adminId,
                userId: user.id
            }
        });

        if(!existingAdmin){
            throw new ResponseError(404,"Admin not found or unauthorized");
        }

        if (updateRequest.nipAdmin) {
            const nipAdminExists = await prismaClient.admin.count({
                where: {
                    nipAdmin: updateRequest.nipAdmin,
                    id: {
                        not: adminId
                    }
                }
            });
            if (nipAdminExists > 0) {
                throw new ResponseError(400, "NIP Admin already in use by another admin.");
            }
        }


        const updatedAdmin = await prismaClient.admin.update({
            where: {
                id: adminId
            },
            data: {
                nipAdmin: updateRequest.nipAdmin ?? existingAdmin.nipAdmin, // Gunakan ?? untuk update parsial
                jabatan: updateRequest.jabatan ?? existingAdmin.jabatan,
                phoneNumber: updateRequest.phoneNumber ?? existingAdmin.phoneNumber,
                address: updateRequest.address ?? existingAdmin.address,
            }
        });

        return toAdminResponse(updatedAdmin);
    }

    static async remove(user:User, adminId:string):Promise<void>{ // Mengembalikan void karena tidak ada data yang dikirim balik
        adminId = Validation.validate(AdminValidation.ADMIN_ID, adminId);

        const existingAdmin = await prismaClient.admin.findUnique({
            where:{
                id: adminId,
                userId: user.id
            }
        });

        if(!existingAdmin){
            throw new ResponseError(404,"Admin not found or unauthorized");
        }


        await prismaClient.admin.delete({
            where: {
                id: adminId
            }
        });
    }

    static async search(request: SearchAdminRequest): Promise<[AdminResponse[], number]> { // Mengembalikan array AdminResponse dan total data
        const searchRequest = Validation.validate(AdminValidation.SEARCH, request);

        const skip = (searchRequest.page! - 1) * searchRequest.size!; // Kalkulasi skip untuk pagination
        const filters = [];

        if (searchRequest.nipAdmin) {
            filters.push({
                nipAdmin: {
                    contains: searchRequest.nipAdmin,
                    mode: 'insensitive'
                }
            });
        }
        if (searchRequest.jabatan) {
            filters.push({
                jabatan: {
                    contains: searchRequest.jabatan,
                    mode: 'insensitive'
                }
            });
        }

        const admins = await prismaClient.admin.findMany({
            where: {
                AND: filters
            },
            take: searchRequest.size,
            skip: skip,
            orderBy: {
                nipAdmin: 'asc'
            },
            include: {
                user: {
                    select: {
                        username: true,
                        email: true,
                        full_name: true,
                        user_type: true
                    }
                }
            }
        });

        const total = await prismaClient.admin.count({
            where: {
                AND: filters
            }
        });

        const adminResponses: AdminResponse[] = admins.map(admin => {

            return toAdminResponse(admin);
        });

        return [adminResponses, total];
    }
}