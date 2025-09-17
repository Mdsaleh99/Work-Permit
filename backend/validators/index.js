import { body } from "express-validator";

// https://github.com/validatorjs/validator.js?tab=readme-ov-file#validatorjs
const userRegisterValidator = () => {
    return [
        body("email")
            .trim()
            .notEmpty()
            .withMessage("Email is Required")
            .isEmail()
            .withMessage("Email is invalid"),
        body("name")
            .trim()
            .notEmpty()
            .withMessage("name is Required")
            .isLength({ min: 3 })
            .withMessage("name should be at least 3 character")
            .isLength({ max: 20 })
            .withMessage("name cannot exceed 20 character"),
        body("password")
            .trim()
            .notEmpty()
            .isLength({ min: 8 })
            .withMessage("password should be at least 8 character")
            .isLength({ max: 16 })
            .withMessage("password cannot exceed 16 character"),
        // body("role").trim().notEmpty().withMessage("Role is Required"),
    ];
};

const userLoginValidator = () => {
    return [
        body("email").isEmail().withMessage("Email is not valid"),
        body("password").notEmpty().withMessage("Password cannot be empty"),
    ];
};

const userChangeCurrentPasswordValidator = () => {
    return [
        body("oldPassword").notEmpty().withMessage("Old password is required"),
        body("newPassword").notEmpty().withMessage("New password is required"),
    ];
};

const userForgotPasswordValidator = () => {
    return [
        body("email")
            .notEmpty()
            .withMessage("Email is required")
            .isEmail()
            .withMessage("Email is invalid"),
    ];
};

const userResetForgottenPasswordValidator = () => {
    return [body("newPassword").notEmpty().withMessage("Password is required")];
};

const userAssignRoleValidator = () => {
    return [body("role").notEmpty().withMessage("Role is required")];
};

const createCompanyValidator = () => {
    return [
        body("compName")
            .trim()
            .notEmpty()
            .withMessage("please provide your company name")
            .isLength({ min: 3 })
            .withMessage("company name should be at least 3 character")
            .isLength({ max: 30 })
            .withMessage("company name can not exceed 30 character"),
        body("description")
            .trim()
            .optional()
            .isLength({ max: 200 })
            .withMessage("description can not be exceed 200 character"),
        body("email")
            .trim()
            .isEmail()
            .withMessage("please provide valid email")
            .notEmpty()
            .withMessage("please provide your company email"),
        body("mobileNo")
            .trim()
            .notEmpty()
            .withMessage("please provide your company mobile no")
            //  TODO: later change to saudi arbia to check mobile no
            .isMobilePhone(["any"])
            .withMessage("please provide valid mobile no")
    ];
}

const createCompanyMemberValidator = () => {
    return [
        body("email")
            .trim()
            .notEmpty()
            .withMessage("Email is Required")
            .isEmail()
            .withMessage("Email is invalid"),
        body("name")
            .trim()
            .notEmpty()
            .withMessage("name is Required")
            .isLength({ min: 3 })
            .withMessage("name should be at least 3 character")
            .isLength({ max: 20 })
            .withMessage("name cannot exceed 20 character"),
        body("password")
            .trim()
            .notEmpty()
            .isLength({ min: 8 })
            .withMessage("password should be at least 8 character")
            .isLength({ max: 16 })
            .withMessage("password cannot exceed 16 character"),
        // body("role").trim().notEmpty().withMessage("Role is Required"),
    ];
};

const companyMemberSignInValidator = () => {
    return [
        body("email").isEmail().withMessage("Email is not valid"),
        body("password").notEmpty().withMessage("Password cannot be empty"),
    ];
}

export {
    userAssignRoleValidator,
    createCompanyValidator,
    companyMemberSignInValidator,
    userChangeCurrentPasswordValidator,
    createCompanyMemberValidator,
    userForgotPasswordValidator,
    userLoginValidator,
    userRegisterValidator,
    userResetForgottenPasswordValidator,
};
