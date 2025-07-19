"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_model_1 = require("../model/user-model");
const validation_1 = require("../validation/validation");
const user_validation_1 = require("../validation/user-validation");
const database_1 = require("../application/database");
const response_error_1 = require("../error/response-error");
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
class UserService {
    static register(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const registerRequest = validation_1.Validation.validate(user_validation_1.UserValidation.REGISTER, request);
            const totalUserWithSameUsername = yield database_1.prismaClient.user.count({
                where: {
                    username: registerRequest.username
                }
            });
            if (totalUserWithSameUsername != 0) {
                throw new response_error_1.ResponseError(400, "Username already exists");
            }
            registerRequest.password_hash = yield bcrypt_1.default.hash(registerRequest.password_hash, 10);
            registerRequest.id = (0, uuid_1.v4)();
            const user = yield database_1.prismaClient.user.create({
                data: registerRequest
            });
            return (0, user_model_1.toUserResponse)(user);
        });
    }
    static login(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const loginRequest = validation_1.Validation.validate(user_validation_1.UserValidation.LOGIN, request);
            let user = yield database_1.prismaClient.user.findUnique({
                where: {
                    username: loginRequest.username
                }
            });
            if (!user) {
                throw new response_error_1.ResponseError(401, "Username or password is wrong");
            }
            const isValidPassword = yield bcrypt_1.default.compare(loginRequest.password_hash, user.password_hash);
            if (!isValidPassword) {
                throw new response_error_1.ResponseError(401, "Username or password is wrong");
            }
            user = yield database_1.prismaClient.user.update({
                where: {
                    username: loginRequest.username
                },
                data: {
                    token: (0, uuid_1.v4)()
                }
            });
            const response = (0, user_model_1.toUserResponse)(user);
            response.token = user.token;
            return response;
        });
    }
    static get(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, user_model_1.toUserResponse)(user);
        });
    }
    static delete(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedUser = yield database_1.prismaClient.user.update({
                where: { id: user.id },
                data: { token: null },
            });
            return (0, user_model_1.toUserResponse)(updatedUser);
        });
    }
    static update(user, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateRequest = validation_1.Validation.validate(user_validation_1.UserValidation.UPDATE, req);
            if (updateRequest.email) {
                user.email = updateRequest.email;
            }
            if (updateRequest.full_name) {
                user.full_name = updateRequest.full_name;
            }
            if (updateRequest.password_hash) {
                user.password_hash = yield bcrypt_1.default.hash(updateRequest.password_hash, 10);
            }
            if (updateRequest.username) {
                user.username = updateRequest.username;
            }
            const result = yield database_1.prismaClient.user.update({
                where: {
                    id: user.id
                },
                data: user
            });
            return (0, user_model_1.toUserResponse)(result);
        });
    }
    static getAll() {
        return __awaiter(this, arguments, void 0, function* (page = 1, size = 10) {
            page = Math.max(1, page);
            size = Math.max(1, Math.min(100, size));
            const skip = (page - 1) * size;
            const filters = {
                user_type: {
                    // <--- CAST THE ARRAY TO UserType[]
                    in: ["Admin", "Dosen"]
                }
            };
            const [users, total] = yield database_1.prismaClient.$transaction([
                database_1.prismaClient.user.findMany({
                    where: filters,
                    take: size,
                    skip: skip,
                    orderBy: {
                        username: 'asc'
                    },
                }),
                database_1.prismaClient.user.count({ where: filters })
            ]);
            const responses = users.map(user => {
                const userResponse = (0, user_model_1.toUserResponse)(user);
                delete userResponse.token;
                return userResponse;
            });
            return [responses, total];
        });
    }
}
exports.UserService = UserService;
