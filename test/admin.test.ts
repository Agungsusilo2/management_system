
import supertest from "supertest";
import {web} from "../src/application/web";
import {logger} from "../src/application/logging";
import {cleanDatabase, createTestUser, createTestAdmin} from "./test-util";
import {prismaClient} from "../src/application/database";

describe("Admin API Endpoints",()=>{
    beforeEach(async ()=>{
        await cleanDatabase();
        await createTestUser("testuser", "testpassword", "Admin");
    });

    afterEach(async ()=>{
        await cleanDatabase();
    });

    it('should create new admin successfully', async () => {
        const response = await supertest(web)
            .post("/api/admins")
            .set("X-API-KEY","testpassword")
            .send({
                nipAdmin:"1231232123",
                jabatan:"Kepala Departemen",
                phoneNumber:"081234567890",
                address:"Jl. Test Admin No. 1"
            });

        logger.debug(response.body);
        expect(response.status).toBe(201);
        expect(response.body.data).toBeDefined();
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.userId).toBeDefined();
        expect(response.body.data.nipAdmin).toBe("1231232123");
    });

    it('should reject create new admin if authenticated user already has an admin profile', async () => {
        await createTestAdmin("testuser", "testpassword", { nipAdmin: "FIRST_NIP" });

        const response = await supertest(web)
            .post("/api/admins")
            .set("X-API-KEY","testpassword")
            .send({
                nipAdmin:"NEW_NIP",
                jabatan:"Staf",
            });

        logger.debug(response.body);
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors).toContain("User already has an admin profile.");
    });


    it('should be able to get admin by ID', async () => {
        const testAdmin = await createTestAdmin("anotheruser", "anotherpass");

        const response = await supertest(web)
            .get(`/api/admins/${testAdmin.id}`)
            .set("X-API-KEY","testpassword");

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.errors).toBeUndefined();
        expect(response.body.data).toBeDefined();
        expect(response.body.data.id).toBe(testAdmin.id);
        expect(response.body.data.userId).toBe(testAdmin.userId);
        expect(response.body.data.nipAdmin).toBe(testAdmin.nipAdmin);
    });

    it('should reject get admin if admin not found', async () => {
        const response = await supertest(web)
            .get(`/api/admins/invalid-admin-id`)
            .set("X-API-KEY","testpassword");

        logger.debug(response.body);
        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors).toContain("Admin not found");
    });

    it('should be able to update admin successfully', async () => {
        const testAdmin = await createTestAdmin("updatableadmin", "pass123");

        const response = await supertest(web)
            .patch(`/api/admins/${testAdmin.id}`)
            .set("X-API-KEY","testpassword")
            .send({
                jabatan: "Direktur IT",
                phoneNumber: "08987654321"
            });

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.errors).toBeUndefined();
        expect(response.body.data).toBeDefined();
        expect(response.body.data.id).toBe(testAdmin.id);
        expect(response.body.data.jabatan).toBe("Direktur IT");
        expect(response.body.data.phoneNumber).toBe("08987654321");
        expect(response.body.data.nipAdmin).toBe(testAdmin.nipAdmin);
    });

    it('should reject update admin if admin not found or unauthorized', async () => {
        const response = await supertest(web)
            .patch(`/api/admins/non-existent-id`)
            .set("X-API-KEY","testpassword")
            .send({ jabatan: "New Jabatan" });

        logger.debug(response.body);
        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors).toContain("Admin not found or unauthorized");
    });

    it('should reject update admin if nipAdmin already in use', async () => {
        const admin1 = await createTestAdmin("admin1", "pass", { nipAdmin: "NIP001" });
        await createTestAdmin("admin2", "pass", { nipAdmin: "NIP002" });

        const response = await supertest(web)
            .patch(`/api/admins/${admin1.id}`)
            .set("X-API-KEY","testpassword")
            .send({ nipAdmin: "NIP002" });

        logger.debug(response.body);
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors).toContain("NIP Admin already in use by another admin.");
    });


    it('should be able to delete admin successfully', async () => {
        const adminToDelete = await createTestAdmin("deletableadmin", "passfordel");

        const response = await supertest(web)
            .delete(`/api/admins/${adminToDelete.id}`)
            .set("X-API-KEY","testpassword");

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.errors).toBeUndefined();
        expect(response.body.data).toBe("OK");

        const deletedAdmin = await prismaClient.admin.findUnique({ where: { id: adminToDelete.id } });
        expect(deletedAdmin).toBeNull();
        const deletedUser = await prismaClient.user.findUnique({ where: { id: adminToDelete.userId } });
        expect(deletedUser).toBeNull();
    });

    it('should reject delete admin if admin not found or unauthorized', async () => {
        const response = await supertest(web)
            .delete(`/api/admins/non-existent-id`)
            .set("X-API-KEY","testpassword");

        logger.debug(response.body);
        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors).toContain("Admin not found or unauthorized");
    });

    it('should be able to search admins with default paging', async () => {
        await createTestAdmin("admin1", "pass", { nipAdmin: "NIP-001", jabatan: "Staff IT" });
        await createTestAdmin("admin2", "pass", { nipAdmin: "NIP-002", jabatan: "Manager" });
        await createTestAdmin("admin3", "pass", { nipAdmin: "NIP-003", jabatan: "Staff IT" });

        const response = await supertest(web)
            .get("/api/admins")
            .set("X-API-KEY","testpassword");

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.errors).toBeUndefined();
        expect(response.body.data).toBeDefined();
        expect(response.body.data.length).toBe(3);
        expect(response.body.paging).toBeDefined();
        expect(response.body.paging.total_item).toBe(3);
    });

    it('should be able to search admins by nipAdmin', async () => {
        await createTestAdmin("admin1", "pass", { nipAdmin: "NIP-AA1" });
        await createTestAdmin("admin2", "pass", { nipAdmin: "NIP-BB2" });

        const response = await supertest(web)
            .get("/api/admins")
            .query({ nipAdmin: "AA" })
            .set("X-API-KEY","testpassword");

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data).toBeDefined();
        expect(response.body.data.length).toBe(1);
        expect(response.body.data[0].nipAdmin).toBe("NIP-AA1");
    });

    it('should be able to search admins by jabatan and paging', async () => {
        await createTestAdmin("admin_staff_it_1", "pass", { nipAdmin: "NIP-STAFF-1", jabatan: "Staff IT" });
        await createTestAdmin("admin_manager_1", "pass", { nipAdmin: "NIP-MGR-1", jabatan: "Manager" });
        await createTestAdmin("admin_staff_it_2", "pass", { nipAdmin: "NIP-STAFF-2", jabatan: "Staff IT" });
        await createTestAdmin("admin_staff_it_3", "pass", { nipAdmin: "NIP-STAFF-3", jabatan: "Staff IT" });

        const response = await supertest(web)
            .get("/api/admins")
            .query({ jabatan: "Staff IT", page: 1, size: 2 })
            .set("X-API-KEY","testpassword");

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data).toBeDefined();
        expect(response.body.data.length).toBe(2);
        expect(response.body.paging.total_item).toBe(3);
        expect(response.body.paging.total_page).toBe(2);
    });
});