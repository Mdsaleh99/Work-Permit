import express from "express";
import {
    assignRole,
    changeCurrentPassword,
    forgotPasswordRequest,
    getAllUsers,
    getCurrentUser,
    googleCallback,
    createSuperAdmin,
    // new controller
    createAdmin,
    refreshAccessToken,
    resendEmailVerification,
    resetForgottenPassword,
    signIn,
    signOut,
    signUp,
    verifyEmail,
    getAllSuperAdmins,
    getCompanySuperAdmins,
    getCompanyAdmins,
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
import { authorizeRoles, verifyEitherJWT, verifyJWT } from "../middlewares/auth.middlewares.js";
import { UserRolesEnum } from "../utils/constants.js";
import passport from "passport";

const router = express.Router();

// Unsecured route
router.route("/signup").post(userRegisterValidator(), validate, signUp);
router.route("/signin").post(userLoginValidator(), validate, signIn);
// Super Admin scoped signin (companyId in params) -> reuses same controller
router.route("/signin/:companyId").post(userLoginValidator(), validate, signIn);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/verify-email/:verificationToken").get(verifyEmail);

// Bootstrap + managed creation of SUPER_ADMIN (scoped to a company)
// - If no SUPER_ADMIN exists: open (no auth) to create the first one
// - If at least one exists: must be called by an authenticated ADMIN or SUPER_ADMIN
router.route("/create-super-admin/:companyId").post(verifyJWT, createSuperAdmin);

// Create ADMIN under a company (SUPER_ADMIN only)
router.route("/create-admin/:companyId").post(verifyJWT, createAdmin);

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
    .route("/get-all-super-admins")
    .get(verifyJWT, authorizeRoles(UserRolesEnum.ADMIN, UserRolesEnum.SUPER_ADMIN), getAllSuperAdmins);
router
    .route("/company/:companyId/super-admins")
    .get(verifyEitherJWT, getCompanySuperAdmins);

router
    .route("/company/:companyId/admins")
    .get(verifyEitherJWT, getCompanyAdmins);
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
    
// SSO routes
router.route("/google").get( // this route for frontend to show the emails page to choose the email and when i click any email googleCallback() function triggers
    passport.authenticate("google", {
        scope: ["profile", "email"],
    }),
    (req, res) => {
        res.send("redirecting to google...");
    },
);

router
    .route("/google/callback")
    .get(
        passport.authenticate("google", {
            failureRedirect: `${process.env.FRONTEND_URL}/auth/signin`,
        }),
        googleCallback
    );

export default router;
