import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"


// * routes
import userRouters from "./routes/user.routes.js";
import companyRouters from "./routes/company.routes.js"
import workPermitFormRouters from "./routes/workPermitForm.routes.js"
import { ApiError } from "./utils/ApiError.js"

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

// * 404 handler
app.use((req, res, next) => {
    const notFoundError = new ApiError(404, `Route ${req.originalUrl} not found`)
    next(notFoundError)
})

// * Centralized error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    const isKnownApiError = err instanceof ApiError
    const statusCode = isKnownApiError ? err.statusCode : 500
    const message = isKnownApiError ? err.message : "Internal Server Error"
    const errors = isKnownApiError ? err.errors : []

    // Log server-side for observability
    if (process.env.NODE_ENV !== "test") {
        console.error(`[${new Date().toISOString()}]`, err)
    }

    return res.status(statusCode).json({
        success: false,
        message,
        errors,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    })
})