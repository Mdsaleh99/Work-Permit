import express from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { validate } from "../middlewares/validate.middlewares.js";
import {
    createOrUpdateDraft,
    getAllDrafts,
    getDraftById,
    updateDraft,
    deleteDraft,
    duplicateDraft,
    publishDraft,
} from "../controllers/workPermitDraft.controllers.js";

const router = express.Router();

// All routes require authentication
router.use(verifyJWT);

// Create or Update Draft (Auto-save)
router.route("/:companyId/create-or-update").post(createOrUpdateDraft);

// Get All Drafts for User
router.route("/get-all").get(getAllDrafts);

// Get Draft by ID
router.route("/:draftId").get(getDraftById);

// Update Draft
router.route("/:draftId").patch(updateDraft);

// Delete Draft
router.route("/:draftId").delete(deleteDraft);

// Duplicate Draft
router.route("/:draftId/duplicate").post(duplicateDraft);

// Publish Draft (Convert to Work Permit Form)
router.route("/:draftId/publish").post(publishDraft);

export { router as workPermitDraftRouters };
