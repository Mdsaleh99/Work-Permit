import express from "express";
import { verifyJWT, verifyEitherJWT, companyMemberVerifyJWT, authorizeRoles } from "../middlewares/auth.middlewares.js";
import {
    createWorkPermitForm,
    duplicateWorkPermitForm,
    getAllWorkPermitForm,
    getWorkPermitFormById,
    updateWorkPermitForm,
    createWorkPermitSubmission,
    listWorkPermitSubmissions,
    approveWorkPermitForm,
    closeWorkPermitForm,
    getFormsPendingApproval,
} from "../controllers/workPermitForm.controllers.js";

const router = express.Router();

router.route("/:companyId/create").post(verifyJWT, createWorkPermitForm);
router.route("/get-all").get(verifyJWT, getAllWorkPermitForm);
router.route("/:workPermitFormId").get(verifyEitherJWT, getWorkPermitFormById);
// router.route("/:workPermitFormId").delete(verifyJWT, deleteWorkPermitForm);
router
    .route("/:workPermitFormId/duplicate")
    .post(verifyJWT, duplicateWorkPermitForm);
router
    .route("/:companyId/:workPermitFormId")
    .patch(verifyJWT, updateWorkPermitForm);

router
    .route("/:workPermitFormId/submissions")
    .get(verifyEitherJWT, listWorkPermitSubmissions)
    .post(companyMemberVerifyJWT, createWorkPermitSubmission);

// SUPER_ADMIN only actions
router
    .route("/:workPermitFormId/approve")
    .post(verifyJWT, authorizeRoles("SUPER_ADMIN"), approveWorkPermitForm);

router
    .route("/:workPermitFormId/close")
    .post(verifyJWT, authorizeRoles("SUPER_ADMIN"), closeWorkPermitForm);

router
    .route("/pending-approval")
    .get(verifyJWT, authorizeRoles("SUPER_ADMIN"), getFormsPendingApproval);

export default router;
