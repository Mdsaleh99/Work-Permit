import { db } from "../db/db.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createCompany = asyncHandler(async (req, res) => {
    const { compName, description, email, mobileNo } = req.body
    const userId = req.user.id

    if (!userId) {
        throw new ApiError(401, "user id is required")
    }

    const user = await db.user.findUnique({
        where: {
            id: userId
        }
    })

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    // Check if company name already exists
    const existingCompany = await db.company.findFirst({
        where: {
            compName
        }
    })

    if (existingCompany) {
        throw new ApiError(409, "Company name already exists")
    }

    // Check if email already exists
    const existingEmail = await db.company.findFirst({
        where: {
            email
        }
    })

    if (existingEmail) {
        throw new ApiError(409, "Email already exists")
    }

    const existingMobileNo = await db.company.findFirst({
        where: {
            mobileNo
        }
    })

    if (existingMobileNo) {
        throw new ApiError(409, "Mobile No already exists")
    }

    try {
        const company = await db.company.create({
            data: {
                compName,
                email,
                mobileNo,
                description,
                userId: user.id
            }
        })

        return res
            .status(201)
            .json(new ApiResponse(201, company, "company created successfully"));
    } catch (error) {
        if (error.code === 'P2002') {
            // Handle unique constraint violations
            if (error.meta?.target?.includes('compName')) {
                throw new ApiError(409, "Company name already exists")
            }
            if (error.meta?.target?.includes('email')) {
                throw new ApiError(409, "Email already exists")
            }
            throw new ApiError(409, "Company with this information already exists")
        }
        throw error
    }
})

export const getCompanyByUser = asyncHandler(async (req, res) => {
    const userId = req.user.id
    if (!userId) {
        throw new ApiError(401, "User id is required")
    }

    const user = await db.user.findUnique({
        where: {
            id: userId
        }
    })

    if (!user) {
        throw new ApiError(404, "user not found")
    }

    const company = await db.company.findMany({
        where: {
            userId: user.id
        }
    })

    if (!company) {
        throw new ApiError(404, "No company found")
    }

    return res.status(200).json(new ApiResponse(200, company, "company fetched successfully"))
})

export const deleteCompany = asyncHandler(async (req, res) => {
    const { id } = req.params
    const userId = req.user.id
    
    if (!id) {
        throw new ApiError(401, "please provide company id")
    }
    if (!userId) {
        throw new ApiError(401, "user id required")
    }

    const user = await db.user.findUnique({
        where: {
            id: userId
        }
    })

    if (!user) {
        throw new ApiError(404, "user not found");
    }

    const company = await db.company.findUnique({
        where: {
            id,
            userId
        }
    })

    if (!company) {
        throw new ApiError(404, "company not found")
    }

    const deletedCompany = await db.company.delete({
        where: {
            id: company.id
        }
    })

    if (!deletedCompany) {
        throw new ApiError(401, "company deletion failed")
    }


    return res.status(200).json(new ApiResponse(200, {}, "Company deleted successfully"))
})