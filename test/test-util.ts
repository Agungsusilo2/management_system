import {prismaClient} from "../src/application/database";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid';
import {User} from "../generated/prisma";


export class UserTest{

    static async delete(){
        await prismaClient.user.deleteMany({
            where:{
                username:"test"
            }
        })
    }


    static async create(){
        await prismaClient.user.create({
            data:{
                id: "test",
                username: "test",
                password_hash: await bcrypt.hash("test1234",10),
                email: "test100@example.com",
                full_name: "Test",
                user_type: "Mahasiswa",
                token:"test"
            }
        })
    }


    static async get():Promise<User>{
        const user = await prismaClient.user.findFirst({
            where:{
                username:"test"
            }
        });

        if(!user){
            throw new Error("User is not found")
        }

        return user;
    }
}


export class AdminTest{
    static async deleteAll(){
        prismaClient.admin.deleteMany({
            where:{
                user:{
                    username:"test"
                }
            }
        })
    }

    static async create(){
        await prismaClient.admin.create({
            data:{
                id:"test",
                userId:"test",
                jabatan:"atasan",
                address:"jl swadaya",
                phoneNumber:"023232"
            }
        })
    }


    static async get(){
        const contact = await prismaClient.admin.findFirst({
            where:{
                userId:"test"
            }
        })

        if(!contact){
            throw new Error("Contact is not found")
        }

        return contact
    }
}