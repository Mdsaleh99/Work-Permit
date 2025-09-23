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
                role: true,
                isEmailVerified: true
            }
        })

        if (!user) {
            throw new ApiError(401, "Invalid access token")
        }

        req.user = user
        next()
    } catch (error) {
        throw new ApiError(419, "Access token expired");
        // if (error?.name === "TokenExpiredError") {
        //     // 419 Authentication Timeout (commonly used for expired sessions)
        //     throw new ApiError(419, "Access token expired");
        // }
        // throw new ApiError(401, "Invalid access token");
    }
}

export const companyMemberVerifyJWT = async (req, res, next) => {
    const token = req.cookies.accessToken
    if (!token) {
        throw new ApiError(401, "Unauthorized request");
    }

    try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const member = await db.companyMember.findUnique({
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

        if (!member) {
            throw new ApiError(401, "Invalid access token");
        }

        req.member = member;
        next();
    } catch (error) {
        throw new ApiError(419, "Access token expired");
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

// Allow either primary user or company member to be authenticated
export const verifyEitherJWT = async (req, res, next) => {
    const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];
    if (!token) {
        throw new ApiError(401, "Unauthorized request");
    }

    try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        // Try as primary user first
        const user = await db.user.findUnique({
            where: { id: decodedToken.id },
            select: { id: true, name: true, email: true, role: true, isEmailVerified: true },
        });
        if (user) {
            req.user = user;
            return next();
        }

        // Fallback to company member
        const member = await db.companyMember.findUnique({
            where: { id: decodedToken.id },
            select: { id: true, name: true, email: true, role: true },
        });
        if (member) {
            req.member = member;
            return next();
        }

        throw new ApiError(401, "Invalid access token");
    } catch (error) {
        throw new ApiError(419, "Access token expired");
    }
}