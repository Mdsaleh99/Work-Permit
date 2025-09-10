import jwt from "jsonwebtoken"
import { ApiError } from "../utils/ApiError.js";
import { db } from "../db/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyJWT = async (req, res, next) => {
    const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

    if (!token) {
        throw new ApiError(401, "Unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await db.user.findUnique({
            where: {
                id: decodedToken.id
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true
            }
        })

        if (!user) {
            throw new ApiError(401, "Invalid access token")
        }

        req.user = user
        next()
    } catch (error) {
        if (error?.name === "TokenExpiredError") {
            // 419 Authentication Timeout (commonly used for expired sessions)
            throw new ApiError(419, "Access token expired");
        }
        throw new ApiError(401, "Invalid access token");
    }
}

export const authorizeRoles = (...roles) => {
    return asyncHandler((req, res, next) => {
        if (!req.user?.id) {
            throw new ApiError(401, "Unauthorized request");
        }

        if (roles.includes(req.user?.role)) {
            next()
        } else {
            throw new ApiError(
                401,
                "You are not allowed to perform this action"
            );
        }
    }) 
}