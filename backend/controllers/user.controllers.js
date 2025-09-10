import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { db } from "../db/db.js";
import {
    emailVerificationMailgenContent,
    forgotPasswordMailgenContent,
    sendEmail,
} from "../utils/mail.js";
import {
    generateAccessToken,
    generateRefreshToken,
    generateTemporaryToken,
} from "../utils/generateToken.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const signUp = asyncHandler(async (req, res) => {
    const { email, name, password } = req.body;

    const existingUser = await db.user.findUnique({
        where: {
            email,
        },
    });

    if (existingUser) {
        throw new ApiError(
            409,
            "User with this email or username already exists"
        );
    }

    const { hashedToken, unHashedToken, tokenExpiry } =
        generateTemporaryToken();

    const newUser = await db.user.create({
        data: {
            name,
            email,
            password,
            emailVerificationToken: hashedToken,
            emailVerificationExpiry: tokenExpiry,
        },
    });

    if (!newUser) {
        throw new ApiError(403, "Failed to register user");
    }

    // newUser is already created in the database, and this assignment only mutates the JavaScript object in memory, not in the database. So those values are not persisted.
    // newUser.emailVerificationToken = hashedToken
    // newUser.emailVerificationExpiry = tokenExpiry
    //  --------------------------

    // logger.info("tokens: ", unHashedToken)

    const user = await db.user.findUnique({
        where: {
            id: newUser.id,
        },
        omit: {
            password: true,
            emailVerificationExpiry: true,
            emailVerificationToken: true,
        },
    });

    if (!user) {
        throw new ApiError(
            500,
            "Something went wrong while registering the user"
        );
    }

    const emailVerificationUrl = `${process.env.BASE_URL}/api/v1/auth/verify-email/${unHashedToken}`;

    await sendEmail({
        email: newUser.email,
        subject: "Verify your email address",
        mailgenContent: emailVerificationMailgenContent(
            newUser.name,
            emailVerificationUrl
        ),
    });

    return res
        .status(201)
        .json(new ApiResponse(201, user, "User registered successfully"));
});

const verifyEmail = asyncHandler(async (req, res) => {
    const { verificationToken } = req.params;

    if (!verificationToken) {
        throw new ApiError(400, "Token is required to verify email");
    }
    const hashedToken = crypto
        .createHash("sha256")
        .update(verificationToken)
        .digest("hex");

    const user = await db.user.findFirst({
        where: {
            emailVerificationToken: hashedToken,
            emailVerificationExpiry: {
                gt: new Date(), // it give current date and time
            },
        },
    });

    if (!user) {
        throw new ApiError(400, "Invalid or expired token");
    }

    await db.user.update({
        where: {
            id: user.id,
        },
        data: {
            emailVerificationToken: null,
            emailVerificationExpiry: null,
            isEmailVerified: true,
        },
    });

    return res
        .status(200)
        .json(
            new ApiResponse(200, { isEmailVerified: true }, "Email is verified")
        );
});

const signIn = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await db.user.findUnique({
        where: {
            email,
        },
    });

    if (!user) {
        throw new ApiError(404, "user not found with this given email");
    }

    if (!user.isEmailVerified) {
        throw new ApiError(400, "Please verify Email before login");
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
        throw new ApiError(400, "Email or Password is wrong.");
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // false in dev
        sameSite: "lax", // better for SPAs than "strict"
    };

    await db.user.update({
        where: {
            id: user.id,
        },
        data: {
            refreshToken,
        },
    });

    res.status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            new ApiResponse(
                200,
                {
                    email,
                    name: user.name,
                    isEmailVerified: user.isEmailVerified,
                },
                "user Logged in successfully"
            )
        );
});

const signOut = asyncHandler(async (req, res) => {
    const { id } = req.user;

    const user = await db.user.update({
        where: {
            id,
        },
        data: {
            refreshToken: null,
        },
    });

    if (!user) {
        throw new ApiError(401, "User Not authorized");
    }

    res.status(200)
        .clearCookie("accessToken")
        .clearCookie("refreshToken")
        .json(new ApiResponse(200, null, "Logged out successfully"));
});

// This controller is called when user is logged in and he has snackbar that your email is not verified
// In case he did not get the email or the email verification token is expired
// he will be able to resend the token while he is logged in
const resendEmailVerification = asyncHandler(async (req, res) => {
    const user = await db.user.findUnique({
        where: {
            id: req.user?.id,
        },
    });

    if (!user) {
        throw new ApiError(404, "user not found");
    }

    if (user.isEmailVerified) {
        throw new ApiError(409, "Email is already verified!");
    }

    const { hashedToken, unHashedToken, tokenExpiry } =
        generateTemporaryToken();
    await db.user.update({
        where: {
            id: user.id,
        },
        data: {
            emailVerificationToken: hashedToken,
            emailVerificationExpiry: tokenExpiry,
        },
    });

    const emailVerificationUrl = `${process.env.BASE_URL}/api/v1/auth/verify-email/${unHashedToken}`;

    await sendEmail({
        email: user.email,
        subject: "Verify your email address",
        mailgenContent: emailVerificationMailgenContent(
            user.name,
            emailVerificationUrl
        ),
    });

    return res
        .status(201)
        .json(new ApiResponse(201, {}, "Mail has been sent to your mail ID"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken;
    console.log(incomingRefreshToken);

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request");
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await db.user.findUnique({
            where: {
                id: decodedToken.id,
            },
        });

        if (!user) {
            throw new ApiError(401, "Invalid refresh token");
        }

        // check if incoming refresh token is same as the refresh token attached in the user document
        // This shows that the refresh token is used or not
        // Once it is used, we are replacing it with new refresh token below
        if (incomingRefreshToken !== user?.refreshToken) {
            // If token is valid but is used already
            throw new ApiError(401, "Refresh token is expired or used");
        }

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // false in dev
            sameSite: "lax", // better for SPAs than "strict"
        };

        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);

        await db.user.update({
            where: {
                id: user.id,
            },
            data: {
                refreshToken: newRefreshToken,
            },
        });

        return res
            .status(200)
            .cookie("accessToken", newAccessToken, cookieOptions)
            .cookie("refreshToken", newRefreshToken, cookieOptions)
            .json(
                new ApiResponse(
                    200,
                    {
                        tokens: {
                            accessToken: newAccessToken,
                            refreshToken: newRefreshToken,
                        },
                    },
                    "Access token refreshed"
                )
            );
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
});

const forgotPasswordRequest = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await db.user.findUnique({
        where: {
            email,
        },
    });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const { unHashedToken, hashedToken, tokenExpiry } =
        generateTemporaryToken();

    await db.user.update({
        where: {
            id: user.id,
        },
        data: {
            forgotPasswordToken: hashedToken,
            forgotPasswordExpiry: tokenExpiry,
        },
    });

    // const passwordResetUrl = `${process.env.BASE_URL}/api/v1/auth/reset-password/${user.id}/${unHashedToken}`;

    await sendEmail({
        email,
        subject: "Reset Password link",
        mailgenContent: forgotPasswordMailgenContent(
            user.name,
            // ! NOTE: Following link should be the link of the frontend page responsible to request password reset
            // ! Frontend will send the below token with the new password in the request body to the backend reset password endpoint
            `${process.env.FORGOT_PASSWORD_REDIRECT_URL}/${unHashedToken}`
        ),
    });

    return res.status(200).json(new ApiResponse(200, null, "Check Your Inbox"));
});

const resetForgottenPassword = asyncHandler(async (req, res) => {
    const { resetToken } = req.params;
    const { newPassword } = req.body;

    const hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    // See if user with hash similar to resetToken exists
    // If yes then check if token expiry is greater than current date
    const user = await db.user.findFirst({
        where: {
            forgotPasswordToken: hashedToken,
            forgotPasswordExpiry: {
                gt: new Date(),
            },
        },
    });

    if (!user) {
        throw new ApiError(400, "Invalid or expired token");
    }

    await db.user.update({
        where: {
            id: user.id,
        },
        data: {
            forgotPasswordExpiry: null,
            forgotPasswordToken: null,
            password: newPassword,
        },
    });

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password reset successfully"));
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const user = await db.user.findUnique({
        where: {
            id: req.user.id,
        },
        
    });

    if (!user) {
        throw new ApiError(404, "user not found");
    }

    const isOldPasswordCorrect = await bcrypt.compare(
        oldPassword,
        user.password
    );
    if (!isOldPasswordCorrect) {
        throw new ApiError(400, "Invalid old password");
    }

    await db.user.update({
        where: {
            id: user.id,
        },
        data: {
            password: newPassword,
        },
    });

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
    const { id } = req.user;
    if (!id) {
        throw new ApiError(400, "id is required");
    }

    const user = await db.user.findUnique({
        where: {
            id,
        },
        omit: {
            password: true,
            emailVerificationExpiry: true,
            emailVerificationToken: true,
            forgotPasswordExpiry: true,
            forgotPasswordToken: true,
            isEmailVerified: true,
            refreshToken: true,
        },
    });

    if (!user) {
        throw new ApiError(404, "user not found");
    }

    res.status(200).json(
        new ApiResponse(200, user, "fetched current user successfully")
    );
});

const assignRole = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { role } = req.body;

    if (!userId) {
        throw new ApiError(401, "userId is required");
    }

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    await db.user.update({
        where: {
            id: userId,
        },
        data: {
            role,
        },
    });

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Role changed for the user"));
});

const getAllUsers = asyncHandler(async (req, res) => {
    const allUsers = await db.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
            isEmailVerified: true,
        },
    });

    if (!allUsers || allUsers.length === 0) {
        throw new ApiError(401, "No user found");
    }

    res.status(200).json(
        new ApiResponse(200, allUsers, "all users fetched successfully")
    );
});

export {
    getAllUsers,
    changeCurrentPassword,
    forgotPasswordRequest,
    getCurrentUser,
    signIn,
    assignRole,
    signOut,
    refreshAccessToken,
    signUp,
    resendEmailVerification,
    resetForgottenPassword,
    verifyEmail,
};
