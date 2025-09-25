import express from "express";
import { verifyJWT, verifyEitherJWT, companyMemberVerifyJWT } from "../middlewares/auth.middlewares.js";
import {
    createWorkPermitForm,
    duplicateWorkPermitForm,
    getAllWorkPermitForm,
    getWorkPermitFormById,
    updateWorkPermitForm,
    createWorkPermitSubmission,
    listWorkPermitSubmissions,
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

export default router;
