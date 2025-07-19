import {
    CreateUserRequest,
    LoginUserRequest,
    toUserResponse,
    UpdateUserRequest,
    UserResponse
} from "../model/user-model";
import {Validation} from "../validation/validation";
import {UserValidation} from "../validation/user-validation";
import {prismaClient} from "../application/database";
import {ResponseError} from "../error/response-error";
import bcrypt from "bcrypt"
import { v4 as uuidv4 } from 'uuid';
import {$Enums, User} from "../../generated/prisma";
import UserType = $Enums.UserType;

export class UserService{
    static async register(request:CreateUserRequest):Promise<UserResponse>{
        const registerRequest = Validation.validate(UserValidation.REGISTER,request)

        const totalUserWithSameUsername = await prismaClient.user.count({
            where:{
                username: registerRequest.username
            }
        })

        if (totalUserWithSameUsername != 0){
            throw new ResponseError(400,"Username already exists")
        }


        registerRequest.password_hash = await bcrypt.hash(registerRequest.password_hash,10)

        registerRequest.id = uuidv4()

        const user = await prismaClient.user.create({
            data: registerRequest
        });


        return toUserResponse(user)
    }


    static async login(request:LoginUserRequest):Promise<UserResponse>{
        const loginRequest = Validation.validate(UserValidation.LOGIN,request)

        let user = await prismaClient.user.findUnique({
            where:{
                username: loginRequest.username
            }
        })

        if(!user){
            throw new ResponseError(401,"Username or password is wrong")
        }

        const isValidPassword = await bcrypt.compare(loginRequest.password_hash,user.password_hash)

        if(!isValidPassword){
            throw new ResponseError(401,"Username or password is wrong")
        }

        user = await prismaClient.user.update({
            where: {
                username: loginRequest.username
            },
            data:{
                token : uuidv4()
            }
        })

        const response = toUserResponse(user)
        response.token = user.token!
        return response;
    }

    static async get(user:User):Promise<UserResponse>{
        return toUserResponse(user)
    }

    static async delete(user: User): Promise<UserResponse> {
        const updatedUser = await prismaClient.user.update({
            where: { id: user.id },
            data: { token: null },
        });

        return toUserResponse(updatedUser);
    }



    static async update(user:User,req:UpdateUserRequest):Promise<UserResponse>{
        const updateRequest = Validation.validate(UserValidation.UPDATE,req)

        if(updateRequest.email){
            user.email = updateRequest.email
        }


        if(updateRequest.full_name){
            user.full_name = updateRequest.full_name
        }

        if(updateRequest.password_hash){
            user.password_hash = await bcrypt.hash(updateRequest.password_hash,10)
        }


        if(updateRequest.username){
            user.username = updateRequest.username
        }


        const result = await  prismaClient.user.update({
            where:{
                id:user.id
            },
            data:user
        })

        return toUserResponse(result)
    }

    static async getAll(page: number = 1, size: number = 10): Promise<[UserResponse[], number]> {
        page = Math.max(1, page);
        size = Math.max(1, Math.min(100, size));

        const skip = (page - 1) * size;

        const filters = {
            user_type: {
                // <--- CAST THE ARRAY TO UserType[]
                in: ["Admin", "Dosen"] as UserType[]
            }
        };

        const [users, total] = await prismaClient.$transaction([
            prismaClient.user.findMany({
                where: filters,
                take: size,
                skip: skip,
                orderBy: {
                    username: 'asc'
                },
            }),
            prismaClient.user.count({ where: filters })
        ]);

        const responses = users.map(user => {
            const userResponse = toUserResponse(user);
            delete userResponse.token;
            return userResponse;
        });

        return [responses, total];
    }
}