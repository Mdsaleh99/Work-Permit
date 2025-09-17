import express from "express";
import { companyMemberVerifyJWT, verifyJWT } from "../middlewares/auth.middlewares.js";
import {
    createCompany,
    // deleteCompany,
    getCompanyByUser,
    createCompanyMember,
    getAllCompanyMembers,
    deleteCompanyMember,
    updateCompanyMemberRole,
    companyMemberSignIn,
    companyMemberSignOut,
    getCurrentCompanyMember,
} from "../controllers/company.controllers.js";
import { companyMemberSignInValidator, createCompanyMemberValidator, createCompanyValidator } from "../validators/index.js";

const router = express.Router();

router
    .route("/create")
    .post(createCompanyValidator(), verifyJWT, createCompany);
router.route("/get-company").get(verifyJWT, getCompanyByUser);
// router.route("/:compId").delete(verifyJWT, deleteCompany);
router.route("/:companyId/create-member").post(createCompanyMemberValidator(), verifyJWT, createCompanyMember);
router.route("/:companyId/get-members").get(verifyJWT, getAllCompanyMembers);
router.route("/:companyId/:memberId/role").put(verifyJWT, updateCompanyMemberRole);
router.route("/:companyId/:memberId").delete(verifyJWT, deleteCompanyMember);
router.route("/member-signin/:companyId").post(companyMemberSignInValidator(), companyMemberSignIn);
router.route("/member-signout").post(companyMemberVerifyJWT, companyMemberSignOut);
router.route("/member").get(companyMemberVerifyJWT, getCurrentCompanyMember);

export default router;
