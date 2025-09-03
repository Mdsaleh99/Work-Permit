export const UserRolesEnum = {
    ADMIN: "ADMIN",
    SUPER_ADMIN: "SUPER_ADMIN"
};

export const AvailableUserRoles = Object.values(UserRolesEnum);

export const USER_TEMPORARY_TOKEN_EXPIRY = 20 * 60 * 1000;