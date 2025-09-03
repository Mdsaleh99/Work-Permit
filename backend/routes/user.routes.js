import express from "express";
import {
    assignRole,
    changeCurrentPassword,
    forgotPasswordRequest,
    getAllUsers,
    getCurrentUser,
    refreshAccessToken,
    resendEmailVerification,
    resetForgottenPassword,
    signIn,
    signOut,
    signUp,
    verifyEmail,
} from "../controllers/user.controllers.js";
import {
    userAssignRoleValidator,
    userChangeCurrentPasswordValidator,
    userForgotPasswordValidator,
    userLoginValidator,
    userRegisterValidator,
    userResetForgottenPasswordValidator,
} from "../validators/index.js";
import { validate } from "../middlewares/validate.middlewares.js";
import { authorizeRoles, verifyJWT } from "../middlewares/auth.middlewares.js";
import { UserRolesEnum } from "../utils/constants.js";

const router = express.Router();

// Unsecured route
router.route("/signup").post(userRegisterValidator(), validate, signUp);
router.route("/signin").post(userLoginValidator(), validate, signIn);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/verify-email/:verificationToken").get(verifyEmail);

router
    .route("/forgot-password")
    .post(userForgotPasswordValidator(), validate, forgotPasswordRequest);

router
    .route("/reset-password/:resetToken")
    .post(
        userResetForgottenPasswordValidator(),
        validate,
        resetForgottenPassword
    );

// Secured routes
router.route("/signout").post(verifyJWT, signOut);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router
    .route("/get-all")
    .get(verifyJWT, authorizeRoles(UserRolesEnum.ADMIN), getAllUsers);
router
    .route("/change-password")
    .post(
        verifyJWT,
        userChangeCurrentPasswordValidator(),
        validate,
        changeCurrentPassword
    );

router
    .route("/resend-email-verification")
    .post(verifyJWT, resendEmailVerification);

router
    .route("/assign-role/:userId")
    .post(
        verifyJWT,
        userAssignRoleValidator(),
        validate,
        assignRole
    );

export default router;
