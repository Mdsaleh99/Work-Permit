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

export const CompanyMemberRolesEnum = {
    COMPANY_MEMBER: "COMPANY_MEMBER",
};

export const AvailableCompanyMemberRolesEnum = Object.values(CompanyMemberRolesEnum);

export const USER_TEMPORARY_TOKEN_EXPIRY = 20 * 60 * 1000;