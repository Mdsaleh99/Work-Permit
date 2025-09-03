import express from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
    createCompany,
    deleteCompany,
    getCompanyByUser,
} from "../controllers/company.controllers.js";
import { createCompanyValidator } from "../validators/index.js";

const router = express.Router();

router
    .route("/create")
    .post(createCompanyValidator(), verifyJWT, createCompany);
router.route("/get-company").get(verifyJWT, getCompanyByUser);
router.route("/:compId").delete(verifyJWT, deleteCompany);

export default router;
