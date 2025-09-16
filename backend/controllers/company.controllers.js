import { db } from "../db/db.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createCompany = asyncHandler(async (req, res) => {
    const { compName, description, email, mobileNo } = req.body;
    const userId = req.user.id;

    if (!userId) {
        throw new ApiError(401, "user id is required");
    }

    const user = await db.user.findUnique({
        where: {
            id: userId,
        },
    });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Check if user already has a company
    const existingUserCompany = await db.company.findFirst({
        where: {
            userId: user.id,
        },
    });

    if (existingUserCompany) {
        throw new ApiError(409, "You can only create one company per account");
    }

    // Check if company name already exists
    const existingCompany = await db.company.findFirst({
        where: {
            compName,
        },
    });

    if (existingCompany) {
        throw new ApiError(409, "Company name already exists");
    }

    // Check if email already exists
    const existingEmail = await db.company.findFirst({
        where: {
            email,
        },
    });

    if (existingEmail) {
        throw new ApiError(409, "Email already exists");
    }

    const existingMobileNo = await db.company.findFirst({
        where: {
            mobileNo,
        },
    });

    if (existingMobileNo) {
        throw new ApiError(409, "Mobile No already exists");
    }

    const company = await db.company.create({
        data: {
            compName,
            email,
            mobileNo,
            description,
            userId: user.id,
        },
    });

    return res
        .status(201)
        .json(new ApiResponse(201, company, "company created successfully"));
});

export const getCompanyByUser = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    if (!userId) {
        throw new ApiError(401, "User id is required");
    }

    const user = await db.user.findUnique({
        where: {
            id: userId,
        },
    });

    if (!user) {
        throw new ApiError(404, "user not found");
    }

    const company = await db.company.findFirst({
        where: {
            userId: user.id,
        },
    });

    if (!company) {
        throw new ApiError(404, "No company found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, company, "company fetched successfully"));
});

export const createCompanyMember = asyncHandler(async (req, res) => {
    const { companyId } = req.params;
    const { name, email, password } = req.body;

    if (!companyId) {
        throw new ApiError(400, "companyId is required");
    }

    const company = await db.company.findUnique({
        where: {
            id: companyId
        }
    });

    if (!company) {
        throw new ApiError(404, "Company not found");
    }

    // const user = await db.user.findUnique({ where: { id: userId } });
    // if (!user) {
    //     throw new ApiError(404, "User not found");
    // }

    const member = await db.companyMember.create({
        data: {
            companyId,
            name,
            email,
            password,
        }
    });

    if (!member) {
        throw new ApiError(400, "Failed to add member")
    }

    const createdMember = await db.companyMember.findUnique({
        where: {
            id: member.id,
        },
        omit: {
            password: true,
            refreshToken: true,
        }
    })

    return res
        .status(201)
        .json(new ApiResponse(201, createdMember, "Member added to company"));
});

export const getAllCompanyMembers = asyncHandler(async (req, res) => {
    const { companyId } = req.params;
    if (!companyId) throw new ApiError(400, "companyId is required");

    const members = await db.companyMember.findMany({
        where: {
            companyId
        },
        omit: {
            password: true,
            refreshToken: true, 
        },
        orderBy: { createdAt: "desc" },
    });

    if (!members) {
        throw new ApiError(404, "No members found for this company");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, members, "Company members fetched"));
});

export const deleteCompanyMember = asyncHandler(async (req, res) => {
    const { companyId, memberId } = req.params
    if (!companyId || !memberId) {
        throw new ApiError(400, "companyId and memberId are required");
    }

    const company = await db.company.findUnique({
        where: { id: companyId }
    });

    if (!company) {
        throw new ApiError(404, "Company not found");
    }

    const member = await db.companyMember.findUnique({
        where: { id: memberId }
    });
    if (!member) {
        throw new ApiError(404, "Member not found");
    }

    await db.companyMember.delete({
        where: { id: memberId }
    });

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Member deleted successfully"));
})

export const updateCompanyMemberRole = asyncHandler(async (req, res) => {
    const { companyId, memberId } = req.params;
    const { role } = req.body;

    if (!companyId || !memberId) {
        throw new ApiError(400, "companyId and memberId are required");
    }

    if (!role) {
        throw new ApiError(400, "role is required");
    }

    const company = await db.company.findUnique({
        where: { id: companyId }
    });

    if (!company) {
        throw new ApiError(404, "Company not found");
    }

    const member = await db.companyMember.findUnique({
        where: { id: memberId }
    });
    
    if (!member) {
        throw new ApiError(404, "Member not found");
    }

    await db.companyMember.update({
        where: { id: memberId },
        data: { role }
    });

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Member role updated successfully"));
})


// export const deleteCompany = asyncHandler(async (req, res) => {
//     const { id } = req.params;
//     const userId = req.user.id;

//     if (!id) {
//         throw new ApiError(401, "please provide company id");
//     }
//     if (!userId) {
//         throw new ApiError(401, "user id required");
//     }

//     const user = await db.user.findUnique({
//         where: {
//             id: userId,
//         },
//     });

//     if (!user) {
//         throw new ApiError(404, "user not found");
//     }

//     const company = await db.company.findUnique({
//         where: {
//             id,
//             userId,
//         },
//     });

//     if (!company) {
//         throw new ApiError(404, "company not found");
//     }

//     const deletedCompany = await db.company.delete({
//         where: {
//             id: company.id,
//         },
//     });

//     if (!deletedCompany) {
//         throw new ApiError(401, "company deletion failed");
//     }

//     return res
//         .status(200)
//         .json(new ApiResponse(200, {}, "Company deleted successfully"));
// });
