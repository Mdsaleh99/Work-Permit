import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"


// * routes
import userRouters from "./routes/user.routes.js";
import companyRouters from "./routes/company.routes.js"
import workPermitFormRouters from "./routes/workPermitForm.routes.js"

dotenv.config()

export const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors({
    origin: process.env.FRONTEND_URL,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true
}))

// * user Routes
app.use("/api/v1/auth", userRouters)

// * company routes
app.use("/api/v1/company", companyRouters);

// * work Permit Form routes
app.use("/api/v1/work-permit", workPermitFormRouters);