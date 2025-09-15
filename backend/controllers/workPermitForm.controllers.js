import { asyncHandler } from "../utils/asyncHandler.js";
import { db } from "../db/db.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const createWorkPermitForm = asyncHandler(async (req, res) => {
    const { title, sections = [] } = req.body;
    const userId = req.user.id;
    const { companyId } = req.params;

    if (!title || !sections) {
        throw new ApiError(401, "All fields are required");
    }

    if (!userId) {
        throw new ApiError(401, "user id is required");
    }

    if (!companyId) {
        throw new ApiError(401, "company id is required");
    }

    const company = await db.company.findUnique({
        where: {
            id: companyId,
        },
    });

    if (!company) {
        throw new ApiError(404, "company not found");
    }

    /*
        Removed workPermitFormId inside sections.create. Prisma automatically links sections to the parent workPermitForm.

        Removed workPermitSectionId inside components.create. Prisma automatically links components to their parent section.
    */
    const workPermitForm = await db.workPermitForm.create({
        data: {
            title,
            userId,
            companyId: company.id,
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

    if (!workPermitForm) {
        throw new ApiError(401, "work permit form creation failed");
    }

    res.status(201).json(
        new ApiResponse(
            201,
            workPermitForm,
            "work permit form created successfully"
        )
    );
});


export const getAllWorkPermitForm = asyncHandler(async (req, res) => {
    const workPermitForm = await db.workPermitForm.findMany({
        orderBy: {
            createdAt: "desc"
        },
        include: {
            sections: {
                include: {
                    components: true
                }
            }
        }
    })

    if (!workPermitForm || workPermitForm.length === 0) {
        throw new ApiError(404, "No work permit form found")
    }

    res.status(200).json(new ApiResponse(200, workPermitForm, "All work permit form fetched successfully"))
})


export const getWorkPermitFormById = asyncHandler(async (req, res) => {
    const { workPermitFormId } = req.params;

    if (!workPermitFormId) {
        throw new ApiError(401, "work permit id is required");
    }

    const workPermitForm = await db.workPermitForm.findUnique({
        where: {
            id: workPermitFormId
        },
        include: {
            sections: {
                include: {
                    components: true
                }
            }
        }
    })

    if (!workPermitForm) {
        throw new ApiError(404, "No work permit found")
    }

    res.status(200).json(new ApiResponse(200, workPermitForm, "work permit fetched successfully"))
})

export const updateWorkPermitForm = asyncHandler(async (req, res) => {
    const { workPermitFormId, companyId } = req.params;
    const { title, sections = [] } = req.body;
    const userId = req.user.id;

    if (!workPermitFormId) {
        throw new ApiError(401, "work permit id is required");
    }
    if (!title) {
        throw new ApiError(401, "Title is required");
    }
    if (!userId) {
        throw new ApiError(401, "user id is required");
    }
    if (!companyId) {
        throw new ApiError(401, "company id is required");
    }

    const company = await db.company.findUnique({
        where: { id: companyId },
    });

    if (!company) {
        throw new ApiError(404, "company not found");
    }


    // Check if form exists and user has permission
    const existingForm = await db.workPermitForm.findUnique({
        where: { id: workPermitFormId },
        include: {
            sections: {
                include: { components: true },
                orderBy: { createdAt: "asc" },
            },
        },
    });

    if (!existingForm) {
        return res.status(404).json({ message: "Form not found" });
    }

    if (existingForm.userId !== userId) {
        return res
            .status(403)
            .json({ message: "Unauthorized to update this form" });
    }

    // Use transaction for data consistency
    const result = await db.$transaction(async (tx) => {
        // 1. Update form basic info
        const updatedForm = await tx.workPermitForm.update({
            where: { id: workPermitFormId },
            data: {
                ...(title && { title }),
                updatedAt: new Date(), // Ensure updatedAt is set
            },
        });

        // 2. Handle sections update
        if (sections && Array.isArray(sections)) {
            // Get existing section and component IDs for tracking
            const existingSectionIds = existingForm.sections.map((s) => s.id);
            const incomingSectionIds = sections
                .filter((s) => s.id)
                .map((s) => s.id);

            // Delete sections that are not in the incoming data
            const sectionsToDelete = existingSectionIds.filter(
                (id) => !incomingSectionIds.includes(id)
            );
            if (sectionsToDelete.length > 0) {
                // This will cascade delete components due to foreign key constraints
                await tx.workPermitSection.deleteMany({
                    where: { id: { in: sectionsToDelete } },
                });
            }

            // 3. Process each incoming section
            for (const sectionData of sections) {
                const {
                    id: sectionId,
                    title: sectionTitle,
                    enabled = true,
                    components = [],
                } = sectionData;

                if (sectionId && existingSectionIds.includes(sectionId)) {
                    // UPDATE existing section
                    await tx.workPermitSection.update({
                        where: { id: sectionId },
                        data: {
                            title: sectionTitle,
                            enabled: enabled,
                            updatedAt: new Date(),
                        },
                    });

                    // Handle components for this existing section
                    const existingSection = existingForm.sections.find(
                        (s) => s.id === sectionId
                    );
                    const existingComponentIds =
                        existingSection?.components.map((c) => c.id) || [];
                    const incomingComponentIds = components
                        .filter((c) => c.id)
                        .map((c) => c.id);

                    // Delete components that are not in the incoming data
                    const componentsToDelete = existingComponentIds.filter(
                        (id) => !incomingComponentIds.includes(id)
                    );
                    if (componentsToDelete.length > 0) {
                        await tx.workPermitSectionComponent.deleteMany({
                            where: { id: { in: componentsToDelete } },
                        });
                    }

                    // Process each component in this section
                    for (const componentData of components) {
                        const {
                            id: componentId,
                            label,
                            type = "text",
                            required = true,
                            enabled: componentEnabled = true,
                            options = [],
                        } = componentData;

                        if (!label) {
                            throw new Error(
                                `Component label is required in section: ${sectionTitle}`
                            );
                        }

                        if (
                            componentId &&
                            existingComponentIds.includes(componentId)
                        ) {
                            // UPDATE existing component
                            await tx.workPermitSectionComponent.update({
                                where: { id: componentId },
                                data: {
                                    label: label,
                                    type: type,
                                    required: required,
                                    enabled: componentEnabled,
                                    options: Array.isArray(options)
                                        ? options
                                        : [],
                                    updatedAt: new Date(),
                                },
                            });
                        } else {
                            // CREATE new component in existing section
                            await tx.workPermitSectionComponent.create({
                                data: {
                                    workPermitSectionId: sectionId,
                                    label: label,
                                    type: type,
                                    required: required,
                                    enabled: componentEnabled,
                                    options: Array.isArray(options)
                                        ? options
                                        : [],
                                },
                            });
                        }
                    }
                } else {
                    // CREATE new section with components
                    if (!sectionTitle) {
                        throw new Error(
                            "Section title is required for new sections"
                        );
                    }

                    await tx.workPermitSection.create({
                        data: {
                            workPermitFormId,
                            title: sectionTitle,
                            enabled: enabled,
                            components: {
                                create: components.map((componentData) => {
                                    const {
                                        label,
                                        type = "text",
                                        required = true,
                                        enabled: componentEnabled = true,
                                        options = [],
                                    } = componentData;

                                    if (!label) {
                                        throw new Error(
                                            `Component label is required in section: ${sectionTitle}`
                                        );
                                    }

                                    return {
                                        label: label,
                                        type: type,
                                        required: required,
                                        enabled: componentEnabled,
                                        options: Array.isArray(options)
                                            ? options
                                            : [],
                                    };
                                }),
                            },
                        },
                    });
                }
            }
        } else if (sections.length === 0) {
            // If sections array is empty, delete all existing sections
            await tx.workPermitSection.deleteMany({
                where: { workPermitFormId: workPermitFormId },
            });
        }

        // 4. Return updated form with all relations
        return await tx.workPermitForm.findUnique({
            where: { id: workPermitFormId },
            include: {
                sections: {
                    include: {
                        components: {
                            orderBy: { createdAt: "asc" },
                        },
                    },
                    orderBy: { createdAt: "asc" },
                },
            },
        });
    });



    return res.status(200).json(
        new ApiResponse(
            200,
            result,
            "work permit form updated successfully"
        )
    );
});


export const duplicateWorkPermitForm = asyncHandler(async (req, res) => {
    const { workPermitFormId } = req.params
    const userId = req.user.id

    if (!workPermitFormId) {
        throw new ApiError(400, "work permit id is required");
    }

    // Get original work permit
    const originalWorkPermitForm = await db.workPermitForm.findUnique({
        where: { id: workPermitFormId },
        include: {
            sections: {
                include: {
                    components: true,
                },
            },
        },
    });

    if (!originalWorkPermitForm) {
        throw new ApiError(404, "work permit form not found");
    }

    // console.log("orignal userid", originalWorkPermitForm.userId); 
    // console.log("userid", userId); 
    if (originalWorkPermitForm.userId !== userId) {
        throw new ApiError(403, "Unauthorized to duplicate this work permit");
    }
    

    // Create duplicated work permit (create a new WorkPermitForm, not a Draft)
    const duplicatedWorkPermitForm = await db.workPermitForm.create({
        data: {
            title: `${originalWorkPermitForm.title} (Copy)`,
            userId,
            companyId: originalWorkPermitForm.companyId,
            sections: {
                create: originalWorkPermitForm.sections.map((section) => ({
                    title: section.title,
                    enabled: section.enabled,
                    components: {
                        create: section.components.map((component) => ({
                            label: component.label,
                            type: component.type,
                            required: component.required,
                            enabled: component.enabled,
                            options: component.options,
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

    res.status(201).json(
        new ApiResponse(201, duplicatedWorkPermitForm, "work permit duplicated successfully")
    );
})

// export const deleteWorkPermitForm = asyncHandler(async (req, res) => {
//     const { workPermitFormId } = req.params;
//     const userId = req.user.id;

//     if (!workPermitFormId) {
//         throw new ApiError(401, "work permit id is required");
//     }

//     if (!userId) {
//         throw new ApiError(401, "user id is required");
//     }

//     // Check if form exists and user has permission
//     const existingForm = await db.workPermitForm.findUnique({
//         where: { id: workPermitFormId },
//     });

//     if (!existingForm) {
//         throw new ApiError(404, "Work permit form not found");
//     }

//     if (existingForm.userId !== userId) {
//         throw new ApiError(403, "Unauthorized to delete this form");
//     }

//     // Delete the form (sections and components will be cascade deleted)
//     await db.workPermitForm.delete({
//         where: { id: workPermitFormId },
//     });

//     return res.status(200).json(
//         new ApiResponse(200, {}, "Work permit form deleted successfully")
//     );
// });