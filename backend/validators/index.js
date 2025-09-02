import { body } from "express-validator";

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
            .withMessage("username should be at least 3 character")
            .isLength({ max: 20 })
            .withMessage("username cannot exceed 13 character"),
        body("password")
            .trim()
            .notEmpty()
            .isLength({ min: 8 })
            .withMessage("password should be at least 8 character")
            .isLength({ max: 16 })
            .withMessage("password cannot exceed 13 character"),
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

export {
    userAssignRoleValidator,
    userChangeCurrentPasswordValidator,
    userForgotPasswordValidator,
    userLoginValidator,
    userRegisterValidator,
    userResetForgottenPasswordValidator,
};
