import express from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
    createWorkPermitForm,
    getAllWorkPermitForm,
    getWorkPermitFormById,
    updateWorkPermitForm,
} from "../controllers/workPermitForm.controllers.js";

const router = express.Router();

router.route("/:companyId/create").post(verifyJWT, createWorkPermitForm);
router.route("/get-all").get(verifyJWT, getAllWorkPermitForm);
router.route("/:workPermitFormId").get(verifyJWT, getWorkPermitFormById);
router
    .route("/:companyId/:workPermitFormId")
    .patch(verifyJWT, updateWorkPermitForm);

export default router;
