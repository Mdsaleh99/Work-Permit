import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"
import { ApiError } from "./utils/ApiError.js"
import session from "express-session"
import passport from "./passport/index.js"
import helmet from "helmet"
import requestIp from "request-ip"
import { rateLimit } from "express-rate-limit";

// * routes
import userRouters from "./routes/user.routes.js";
import companyRouters from "./routes/company.routes.js"
import workPermitFormRouters from "./routes/workPermitForm.routes.js"
import { workPermitDraftRouters } from "./routes/workPermitDraft.routes.js"

dotenv.config()

const app = express()
app.use(requestIp.mw())

const limiter = rateLimit({
    windowMs: 2 * 60 * 1000, // 2 mnt
    max: 110,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req, res) => {
        return req.clientIp;
    },
    handler: (_, __, ___, options) => {
        throw new ApiError(
            options.statusCode || 500,
            `There are too many requests. You are only allowed ${
                options.limit
            } requests per ${options.windowMs / 60000} minutes`
        );
    },
});

app.use(limiter)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors({
    origin: process.env.FRONTEND_URL,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    credentials: true
}))
// required for passport
app.use(
    session({
        secret: process.env.EXPRESS_SESSION_SECRET,
        resave: true,
        saveUninitialized: true,
    }),
); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(helmet())

// * user Routes
app.use("/api/v1/auth", userRouters)

// * company routes
app.use("/api/v1/company", companyRouters);

// * work Permit Form routes
app.use("/api/v1/work-permit", workPermitFormRouters);

// * work Permit Draft routes
app.use("/api/v1/work-permit-draft", workPermitDraftRouters);


// * basic route
app.get("/", (req, res) => {
    res.send("Server is Running")
})

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

export { app }
