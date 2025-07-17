import supertest from "supertest"
import {web} from "../src/application/web";
import {logger} from "../src/application/logging";
import {prismaClient} from "../src/application/database";
import {UserTest} from "./test-util";
import bcrypt from "bcrypt";

describe("POST /api/users",()=>{

    it('should reject register new user if request is invalid', async () => {
        const response = await supertest(web)
            .post("/api/users")
            .send({
                username:"",
                password:"",
            })


        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    });


    it('should register new user successfully', async () => {
        const response = await supertest(web)
            .post("/api/users")
            .send({
                username: "testuser123",
                password_hash: "Password123!",
                email: "test@example.com",
                full_name: "Test User Account",
                user_type: "Mahasiswa"
            });

        logger.debug(response.body);
        expect(response.status).toBe(200); // 200 OK atau 201 Created
        expect(response.body.data).toBeDefined();
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.username).toBe("testuser123");
        expect(response.body.data.email).toBe("test@example.com");
        expect(response.body.data.full_name).toBe("Test User Account");
        expect(response.body.data.user_type).toBe("Mahasiswa");
        expect(response.body.data.is_active).toBe(true);

        const userInDb = await prismaClient.user.findUnique({
            where: { username: "testuser123" }
        });
        expect(userInDb).toBeDefined();
        expect(userInDb?.email).toBe("test@example.com");
    });

    it('should reject register new user if username already exists', async () => {
        await supertest(web)
            .post("/api/users")
            .send({
                username: "existinguser",
                password_hash: "password123",
                email: "existing@example.com",
                full_name: "Existing User",
                user_type: "Mahasiswa"
            });

        const response = await supertest(web)
            .post("/api/users")
            .send({
                username: "existinguser",
                password_hash: "anotherpassword",
                email: "new@example.com",
                full_name: "New User",
                user_type: "Mahasiswa"
            });

        logger.debug(response.body);
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined()
        expect(response.body.errors).toContain("Username already exists"); // Pesan error spesifik dari backend
    });


    it('should reject register new user if email already exists', async () => {
        await supertest(web)
            .post("/api/users")
            .send({
                username: "userone",
                password_hash: "password123",
                email: "duplicate@example.com",
                full_name: "User One",
                user_type: "Mahasiswa"
            });

        const response = await supertest(web)
            .post("/api/users")
            .send({
                username: "usertwo",
                password_hash: "anotherpassword",
                email: "duplicate@example.com",
                full_name: "User Two",
                user_type: "Dosen"
            });

        logger.debug(response.body);
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors).toContain("Email already exists"); // Pesan error spesifik dari backend
    });
})

describe("POST /api/users/login",()=>{
    beforeEach(async ()=>{
        await UserTest.create()
    })


    afterEach(async ()=>{
        await UserTest.delete()
    })


    it('should be able to login',async () => {
        const response = await supertest(web)
            .post("/api/users/login")
            .send({
                username:"test",
                password_hash:"test1234"
            })

        logger.debug(response.body)
        expect(response.status).toBe(200)
        expect(response.body.data.username).toBe("test")
    });

    it('should reject to login',async () => {
        const response = await supertest(web)
            .post("/api/users/login")
            .send({
                username:"",
                password_hash:"test1234"
            })

        logger.debug(response.body)
        expect(response.status).toBe(400)
    });

    it('should reject to login because invalid username',async () => {
        const response = await supertest(web)
            .post("/api/users/login")
            .send({
                username:"test1",
                password_hash:"test1234"
            })

        logger.debug(response.body)
        expect(response.status).toBe(401)
    });
})


describe("POST /api/users/current",()=>{
    beforeEach(async ()=>{
        await UserTest.create()
    })


    afterEach(async ()=>{
        await UserTest.delete()
    })


    it('should be able to get user current',async () => {
        const response = await supertest(web)
            .get("/api/users/current")
            .set("X-API-KEY","test")

        logger.debug(response.body)
        expect(response.status).toBe(200)
    });

    it('should be able to not get user current',async () => {
        const response = await supertest(web)
            .get("/api/users/current")
            .set("X-API-KEY","salah")

        logger.debug(response.body)
        expect(response.status).toBe(401)
    });



})


describe("PATCH /api/users/current",()=>{
    beforeEach(async ()=>{
        await UserTest.create()
    })


    afterEach(async ()=>{
        await UserTest.delete()
    })


    it('should reject update user if request is blank',async () => {
        const response = await supertest(web)
            .patch("/api/users/current")
            .set("X-API-KEY","test")
            .send({
                username:""
            })

        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    });


    it('should reject update user success',async () => {
        const response = await supertest(web)
            .patch("/api/users/current")
            .set("X-API-KEY","test")
            .send({
                full_name:"test1"
            })

        logger.debug(response.body)
        expect(response.status).toBe(200)
        expect(response.body.errors).toBeUndefined()
    });

    it('should reject update user if request token is wrong',async () => {
        const response = await supertest(web)
            .patch("/api/users/current")
            .set("X-API-KEY","salah")
            .send({
                full_name:"test1"
            })

        logger.debug(response.body)
        expect(response.status).toBe(401)
        expect(response.body.errors).toBeDefined()
    });

    it('should reject update user success change password',async () => {
        const response = await supertest(web)
            .patch("/api/users/current")
            .set("X-API-KEY","test")
            .send({
                password_hash:"test12345"
            })

        logger.debug(response.body)
        expect(response.status).toBe(200)
        expect(response.body.errors).toBeUndefined()


        const user = await UserTest.get()

        expect(await bcrypt.compare("test12345",user.password_hash)).toBe(true)
    });
})