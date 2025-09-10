export const UserRolesEnum = {
    ADMIN: "ADMIN",
    SUPER_ADMIN: "SUPER_ADMIN"
};

export const AvailableUserRoles = Object.values(UserRolesEnum);

export const UserLoginType = {
    GOOGLE: "GOOGLE",
    MICROSOFT: "MICROSOFT",
    EMAIL_PASSWORD: "EMAIL_PASSWORD",
};

export const AvailableUserLoginType = Object.values(UserLoginType);

export const USER_TEMPORARY_TOKEN_EXPIRY = 20 * 60 * 1000;