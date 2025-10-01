import express from "express";
import {
    verifyJWT,
    verifyEitherJWT,
    companyMemberVerifyJWT,
    authorizeRoles,
} from "../middlewares/auth.middlewares.js";
import {
    createWorkPermitForm,
    duplicateWorkPermitForm,
    getAllWorkPermitForm,
    getCompanyWorkPermits,
    getWorkPermitFormById,
    updateWorkPermitForm,
    createWorkPermitSubmission,
    listWorkPermitSubmissions,
    updateWorkPermitSubmission,
    approveWorkPermitForm,
    closeWorkPermitForm,
    getFormsPendingApproval,
    resetFormsToPending,
} from "../controllers/workPermitForm.controllers.js";
import { UserRolesEnum } from "../utils/constants.js";

const router = express.Router();

router
    .route("/:companyId/create")
    .post(
        verifyJWT,
        authorizeRoles(UserRolesEnum.ADMIN, UserRolesEnum.SUPER_ADMIN),
        createWorkPermitForm
    );

router
    .route("/get-all")
    .get(
        verifyJWT,
        authorizeRoles(UserRolesEnum.ADMIN, UserRolesEnum.SUPER_ADMIN),
        getAllWorkPermitForm
    );

router
    .route("/company/:companyId/all")
    .get(verifyEitherJWT, getCompanyWorkPermits);

// SUPER_ADMIN only actions - MUST come before parameterized routes
router
    .route("/pending-approval")
    .get(verifyJWT, authorizeRoles("SUPER_ADMIN"), getFormsPendingApproval);

// TEMPORARY: Reset forms to PENDING for testing
router
    .route("/reset-to-pending")
    .post(verifyJWT, authorizeRoles("SUPER_ADMIN"), resetFormsToPending);

// Parameterized routes - MUST come after specific routes
router.route("/:workPermitFormId").get(verifyEitherJWT, getWorkPermitFormById);
// router.route("/:workPermitFormId").delete(verifyJWT, deleteWorkPermitForm);
router
    .route("/:workPermitFormId/duplicate")
    .post(verifyJWT, duplicateWorkPermitForm);
// Place submissions route BEFORE parameterized companyId route to avoid conflicts
router
    .route("/:workPermitFormId/submissions")
    .get(verifyEitherJWT, listWorkPermitSubmissions)
    .post(companyMemberVerifyJWT, createWorkPermitSubmission)
    .patch(companyMemberVerifyJWT, updateWorkPermitSubmission);

router
    .route("/company/:companyId/:workPermitFormId")
    .patch(verifyJWT, updateWorkPermitForm);

// SUPER_ADMIN only actions
router
    .route("/:workPermitFormId/approve")
    .post(verifyJWT, authorizeRoles("SUPER_ADMIN"), approveWorkPermitForm);

router
    .route("/:workPermitFormId/close")
    .post(verifyJWT, authorizeRoles("SUPER_ADMIN"), closeWorkPermitForm);

export default router;
