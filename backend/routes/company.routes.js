import express from "express";
import {
    authorizeRoles,
    companyMemberVerifyJWT,
    verifyJWT,
} from "../middlewares/auth.middlewares.js";
import {
    createCompany,
    // deleteCompany,
    getCompanyByUser,
    createCompanyMember,
    getAllCompanyMembers,
    deleteCompanyMember,
    updateCompanyMemberRole,
    updateCompanyMemberAllowedPermits,
    companyMemberSignIn,
    companyMemberSignOut,
    getCurrentCompanyMember,
} from "../controllers/company.controllers.js";
import {
    companyMemberSignInValidator,
    createCompanyMemberValidator,
    createCompanyValidator,
} from "../validators/index.js";
import { UserRolesEnum } from "../utils/constants.js";
import { validate } from "../middlewares/validate.middlewares.js";

const router = express.Router();

router
    .route("/member-signin/:companyId")
    .post(companyMemberSignInValidator(), validate, companyMemberSignIn);

router.route("/member-signout").post(companyMemberVerifyJWT, companyMemberSignOut);

router.route("/member").get(companyMemberVerifyJWT, getCurrentCompanyMember);

router
    .route("/create")
    .post(
        createCompanyValidator(),
        validate,
        verifyJWT,
        authorizeRoles(UserRolesEnum.SUPER_ADMIN),
        createCompany
    );

router
    .route("/get-company")
    .get(
        verifyJWT,
        authorizeRoles(UserRolesEnum.ADMIN, UserRolesEnum.SUPER_ADMIN),
        getCompanyByUser
    );

router
    .route("/:companyId/create-member")
    .post(
        createCompanyMemberValidator(),
        validate,
        verifyJWT,
        authorizeRoles(UserRolesEnum.ADMIN, UserRolesEnum.SUPER_ADMIN),
        createCompanyMember
    );

router
    .route("/:companyId/get-members")
    .get(
        verifyJWT,
        authorizeRoles(UserRolesEnum.ADMIN, UserRolesEnum.SUPER_ADMIN),
        getAllCompanyMembers
    );

router
    .route("/:companyId/:memberId/role")
    .put(
        verifyJWT,
        authorizeRoles(UserRolesEnum.ADMIN, UserRolesEnum.SUPER_ADMIN),
        updateCompanyMemberRole
    );

router
    .route("/:companyId/:memberId/allowed-permits")
    .put(
        verifyJWT,
        authorizeRoles(UserRolesEnum.ADMIN, UserRolesEnum.SUPER_ADMIN),
        updateCompanyMemberAllowedPermits
    );

router
    .route("/:companyId/:memberId")
    .delete(
        verifyJWT,
        authorizeRoles(UserRolesEnum.ADMIN, UserRolesEnum.SUPER_ADMIN),
        deleteCompanyMember
    );

export default router;
