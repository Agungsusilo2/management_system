import {User} from "../../generated/prisma"

export type UserResponse = {
    id: string;
    username: string;
    email: string;
    full_name: string;
    user_type: 'Admin' | 'Dosen' | 'Mahasiswa';
    is_active: boolean;
    token?: string;
    created_at: Date;
    updated_at: Date;
}

export type CreateUserRequest = {
    id:string,
    username: string;
    password_hash: string;
    email: string;
    full_name: string;
    user_type: 'Admin' | 'Dosen' | 'Mahasiswa';
}

export type LoginUserRequest = {
    username: string;
    password_hash: string;
}

export type UpdateUserRequest = {
    username?: string;
    email?: string;
    password_hash?:string;
    full_name?: string;
    is_active?: boolean;
}


export function toUserResponse(user: User): UserResponse {
    return {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        user_type: user.user_type,
        is_active: user.is_active,
        created_at: user.created_at,
        updated_at: user.updated_at,
    };
}