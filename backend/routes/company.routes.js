import express from "express";
import { authorizeRoles, companyMemberVerifyJWT, verifyJWT } from "../middlewares/auth.middlewares.js";
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
import { companyMemberSignInValidator, createCompanyMemberValidator, createCompanyValidator } from "../validators/index.js";
import { UserRolesEnum } from "../utils/constants.js";

const router = express.Router();

router
    .route("/create")
    .post(createCompanyValidator(), verifyJWT, createCompany);
router.route("/get-company").get(verifyJWT, authorizeRoles(UserRolesEnum.ADMIN, UserRolesEnum.SUPER_ADMIN), getCompanyByUser);
// router.route("/:compId").delete(verifyJWT, deleteCompany);
router.route("/:companyId/create-member").post(createCompanyMemberValidator(), verifyJWT, createCompanyMember);
router.route("/:companyId/get-members").get(verifyJWT, getAllCompanyMembers);
router.route("/:companyId/:memberId/role").put(verifyJWT, updateCompanyMemberRole);
router.route("/:companyId/:memberId/allowed-permits").put(verifyJWT, updateCompanyMemberAllowedPermits);
router.route("/:companyId/:memberId").delete(verifyJWT, deleteCompanyMember);
router.route("/member-signin/:companyId").post(companyMemberSignInValidator(), companyMemberSignIn);
router.route("/member-signout").post(companyMemberVerifyJWT, companyMemberSignOut);
router.route("/member").get(companyMemberVerifyJWT, getCurrentCompanyMember);

export default router;
