import express from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
    createCompany,
    // deleteCompany,
    getCompanyByUser,
    createCompanyMember,
    getAllCompanyMembers,
    deleteCompanyMember,
} from "../controllers/company.controllers.js";
import { createCompanyMemberValidator, createCompanyValidator } from "../validators/index.js";

const router = express.Router();

router
    .route("/create")
    .post(createCompanyValidator(), verifyJWT, createCompany);
router.route("/get-company").get(verifyJWT, getCompanyByUser);
// router.route("/:compId").delete(verifyJWT, deleteCompany);
router.route("/:companyId/create-member").post(createCompanyMemberValidator(), verifyJWT, createCompanyMember);
router.route("/:companyId/get-members").get(verifyJWT, getAllCompanyMembers);
router.route("/:companyId/:memberId").delete(verifyJWT, deleteCompanyMember);

export default router;
