"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toUserResponse = toUserResponse;
function toUserResponse(user) {
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
