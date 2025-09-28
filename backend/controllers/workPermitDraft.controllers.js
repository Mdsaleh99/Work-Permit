import { db } from "../db/db.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Create or Update Draft (Auto-save)
export const createOrUpdateDraft = asyncHandler(async (req, res) => {
    const { title, sections, isAutoSave = false } = req.body;
    const { companyId } = req.params;
    const userId = req.user.id;

    if (!title) {
        throw new ApiError(400, "Title is required");
    }

    if (!sections || !Array.isArray(sections)) {
        throw new ApiError(400, "Sections are required");
    }

    // Verify company exists and user has access to it
    const company = await db.company.findUnique({
        where: { id: companyId },
    });

    if (!company) {
        throw new ApiError(404, "Company not found");
    }

    // Check if user has access to this company
    // 1. Direct owner (company.userId === userId)
    // 2. Super Admin linked via CompanyAdmin table
    const isOwner = company.userId === userId;
    const isSuperAdmin = await db.companyAdmin.findFirst({
        where: {
            userId,
            companyId,
            role: "SUPER_ADMIN"
        }
    });

    if (!isOwner && !isSuperAdmin) {
        throw new ApiError(403, "Unauthorized to create draft for this company");
    }

    // For auto-save, find existing auto-save draft or create new one
    let draft;
    if (isAutoSave) {
        console.log(`🔍 Looking for existing auto-save draft for user ${userId}, company ${companyId}`);
        
        // Find existing auto-save draft for this user/company
        const existingAutoSaveDraft = await db.workPermitDraft.findFirst({
            where: {
                userId,
                companyId,
                isAutoSave: true,
            },
        });
        
        console.log(`📋 Existing auto-save draft:`, existingAutoSaveDraft ? `Found (ID: ${existingAutoSaveDraft.id})` : 'None found');

        if (existingAutoSaveDraft) {
            console.log(`🔄 Updating existing auto-save draft ${existingAutoSaveDraft.id}`);
            // Update existing auto-save draft
            draft = await db.workPermitDraft.update({
                where: { id: existingAutoSaveDraft.id },
                data: {
                    title,
                    updatedAt: new Date(),
                    sections: {
                        deleteMany: {}, // Delete all existing sections
                        create: sections.map((section) => ({
                            title: section.title,
                            enabled: section.enabled || true,
                            components: {
                                create: (section.components || []).map((component) => ({
                                    label: component.label,
                                    type: component.type,
                                    required: component.required,
                                    enabled: component.enabled,
                                    options: component.options || [],
                                })),
                            },
                        })),
                    },
                },
                include: {
                    sections: {
                        include: {
                            components: true,
                        },
                    },
                },
            });
        } else {
            console.log(`🆕 Creating new auto-save draft`);
            // Create new auto-save draft
            draft = await db.workPermitDraft.create({
                data: {
                    title,
                    userId,
                    companyId,
                    isAutoSave: true,
                    sections: {
                        create: sections.map((section) => ({
                            title: section.title,
                            enabled: section.enabled || true,
                            components: {
                                create: (section.components || []).map((component) => ({
                                    label: component.label,
                                    type: component.type,
                                    required: component.required,
                                    enabled: component.enabled,
                                    options: component.options || [],
                                })),
                            },
                        })),
                    },
                },
                include: {
                    sections: {
                        include: {
                            components: true,
                        },
                    },
                },
            });
        }
    } else {
        console.log(`📝 Creating new manual draft`);
        // Create new manual draft
        draft = await db.workPermitDraft.create({
            data: {
                title,
                userId,
                companyId,
                isAutoSave: false,
                sections: {
                    create: sections.map((section) => ({
                        title: section.title,
                        enabled: section.enabled || true,
                        components: {
                            create: (section.components || []).map((component) => ({
                                label: component.label,
                                type: component.type,
                                required: component.required,
                                enabled: component.enabled,
                                options: component.options || [],
                            })),
                        },
                    })),
                },
            },
            include: {
                sections: {
                    include: {
                        components: true,
                    },
                },
            },
        });
    }

    if (!draft) {
        throw new ApiError(500, "Failed to create/update draft");
    }

    // Log the final result
    console.log(`✅ Draft ${isAutoSave ? 'auto-saved' : 'saved'} successfully:`, {
        id: draft.id,
        title: draft.title,
        isAutoSave: draft.isAutoSave,
        userId: draft.userId,
        companyId: draft.companyId
    });

    res.status(201).json(
        new ApiResponse(
            201,
            draft,
            isAutoSave ? "Draft auto-saved successfully" : "Draft saved successfully"
        )
    );
});

// Get All Drafts for User
export const getAllDrafts = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const drafts = await db.workPermitDraft.findMany({
        where: { userId },
        include: {
            sections: {
                include: {
                    components: true,
                },
            },
            company: {
                select: {
                    id: true,
                    compName: true,
                },
            },
        },
        orderBy: { updatedAt: "desc" },
    });

    res.status(200).json(
        new ApiResponse(200, drafts, "Drafts retrieved successfully")
    );
});

// Get Draft by ID
export const getDraftById = asyncHandler(async (req, res) => {
    const { draftId } = req.params;
    const userId = req.user.id;

    if (!draftId) {
        throw new ApiError(400, "Draft ID is required");
    }

    const draft = await db.workPermitDraft.findUnique({
        where: { id: draftId },
        include: {
            sections: {
                include: {
                    components: {
                        orderBy: { createdAt: "asc" },
                    },
                },
                orderBy: { createdAt: "asc" },
            },
            company: {
                select: {
                    id: true,
                    compName: true,
                },
            },
        },
    });

    if (!draft) {
        throw new ApiError(404, "Draft not found");
    }

    if (draft.userId !== userId) {
        throw new ApiError(403, "Unauthorized to access this draft");
    }

    res.status(200).json(
        new ApiResponse(200, draft, "Draft retrieved successfully")
    );
});


// Delete Draft
export const deleteDraft = asyncHandler(async (req, res) => {
    const { draftId } = req.params;
    const userId = req.user.id;

    if (!draftId) {
        throw new ApiError(400, "Draft ID is required");
    }

    // Check if draft exists and belongs to user
    const existingDraft = await db.workPermitDraft.findUnique({
        where: { id: draftId },
    });

    if (!existingDraft) {
        throw new ApiError(404, "Draft not found");
    }

    if (existingDraft.userId !== userId) {
        throw new ApiError(403, "Unauthorized to delete this draft");
    }

    // Delete draft (sections and components will be cascade deleted)
    await db.workPermitDraft.delete({
        where: { id: draftId },
    });

    res.status(200).json(
        new ApiResponse(200, {}, "Draft deleted successfully")
    );
});


