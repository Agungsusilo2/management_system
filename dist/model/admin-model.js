"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toAdminResponse = toAdminResponse;
function toAdminResponse(admin) {
    return {
        id: admin.id,
        userId: admin.userId,
        nipAdmin: admin.nipAdmin,
        jabatan: admin.jabatan,
        phoneNumber: admin.phoneNumber,
        address: admin.address,
    };
}
