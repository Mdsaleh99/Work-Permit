import { asyncHandler } from "../utils/asyncHandler.js";
import { db } from "../db/db.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const createWorkPermitForm = asyncHandler(async (req, res) => {
    const { title, sections = [], workPermitNo } = req.body;
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
            ...(workPermitNo ? { workPermitNo } : {}),
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

    console.log("Work Permit Form", workPermitForm.sections.map((c) => c.components));
    

    res.status(201).json(
        new ApiResponse(
            201,
            workPermitForm,
            "work permit form created successfully"
        )
    );
});


export const getAllWorkPermitForm = asyncHandler(async (req, res) => {
    const userId = req.user.id
    if (!userId) {
        throw new ApiError(400, "user id is required")
    }

    // Determine the company scope for this user.
    // If the user directly owns a company (creator), use that.
    // Otherwise, if the user is linked via CompanyAdmin (ADMIN/SUPER_ADMIN), use that company.
    let company = await db.company.findFirst({ where: { userId } })
    if (!company) {
        const link = await db.companyAdmin.findFirst({ where: { userId }, include: { company: true } })
        company = link?.company || null
    }

    if (!company) {
        throw new ApiError(404, "No company found for current user")
    }

    const workPermits = await db.workPermitForm.findMany({
        where: {
            companyId: company.id,
        },
        orderBy: { createdAt: "desc" },
        include: {
            sections: { include: { components: true } },
        },
    })

    if (!workPermits || workPermits.length === 0) {
        throw new ApiError(404, "No work permit found")
    }

    res.status(200).json(new ApiResponse(200, workPermits, "All work permit form fetched successfully"))
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
    const { title, sections = [], workPermitNo } = req.body;
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
                ...(typeof workPermitNo !== 'undefined' ? { workPermitNo } : {}),
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
    

    // Generate a new unique 6-digit permit number
    const generateSixDigit = () => String(Math.floor(100000 + Math.random() * 900000));
    let newPermitNo = null;
    for (let i = 0; i < 10; i++) {
        const candidate = generateSixDigit();
        const exists = await db.workPermitForm.findFirst({ where: { workPermitNo: candidate } });
        if (!exists) {
            newPermitNo = candidate;
            break;
        }
    }

    // Create duplicated work permit (create a new WorkPermitForm, not a Draft)
    const duplicatedWorkPermitForm = await db.workPermitForm.create({
        data: {
            title: `${originalWorkPermitForm.title} (Copy)`,
            workPermitNo: newPermitNo, // may be null if uniqueness not found in attempts
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

export const createWorkPermitSubmission = asyncHandler(async (req, res) => {
    const { workPermitFormId } = req.params;
    const { answers } = req.body;
    // const primaryUserId = req.user?.id || null;
    const memberId = req.member?.id || null;

    if (!workPermitFormId) throw new ApiError(400, "workPermitFormId is required");
    if (!answers) throw new ApiError(400, "answers are required");

    const form = await db.workPermitForm.findUnique({ where: { id: workPermitFormId } });
    if (!form) throw new ApiError(404, "Form not found");

    // Authorization: allow
    // - company members belonging to the form's company
    // - primary users (ADMIN/SUPER_ADMIN) or the owner of the form
    if (memberId) {
        const member = await db.companyMember.findUnique({ where: { id: memberId } });
        if (!member || member.companyId !== form.companyId) {
            throw new ApiError(403, "Not allowed to submit for this company");
        }
    } else if (primaryUserId) {
        const user = req.user; // provided by middleware
        const isOwner = form.userId === primaryUserId;
        const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
        if (!isOwner && !isAdmin) {
            throw new ApiError(403, "Not allowed to submit for this company");
        }
    } else {
        throw new ApiError(401, "Unauthorized");
    }

    // Note: submittedById references CompanyMember now. Prefer member id; fallback to form owner mapping is removed.
    // const submittedById = memberId // for primary user submissions, this should be null unless model supports users

    const submission = await db.workPermitSubmission.create({
        data: {
            workPermitFormId: form.id,
            companyId: form.companyId,
            submittedById: memberId,
            answers: answers,
        },
    });

    return res.status(201).json(new ApiResponse(201, submission, "submission created"));
});

export const listWorkPermitSubmissions = asyncHandler(async (req, res) => {
    const { workPermitFormId } = req.params;
    if (!workPermitFormId) throw new ApiError(400, "workPermitFormId is required");

    const submissions = await db.workPermitSubmission.findMany({
        where: { workPermitFormId },
        orderBy: { createdAt: "desc" },
        include: { submittedBy: { select: { id: true, name: true, email: true } } },
    });

    return res.status(200).json(new ApiResponse(200, submissions, "submissions fetched"));
});

// SUPER_ADMIN only: Approve a work permit form
export const approveWorkPermitForm = asyncHandler(async (req, res) => {
    const { workPermitFormId } = req.params;
    const userId = req.user.id;
    const userName = req.user.name;

    console.log('=== Approving Work Permit Form ===');
    console.log('Form ID:', workPermitFormId);
    console.log('Approved by:', userName, '(ID:', userId, ')');

    if (!workPermitFormId) {
        throw new ApiError(400, "workPermitFormId is required");
    }

    const form = await db.workPermitForm.findUnique({ where: { id: workPermitFormId } });
    if (!form) {
        throw new ApiError(404, "Form not found");
    }

    console.log('Current form status:', form.status);
    console.log('Form title:', form.title);

    const updated = await db.workPermitForm.update({
        where: { id: workPermitFormId },
        data: { status: "APPROVED" },
    });

    console.log('Updated form status:', updated.status);
    console.log('Form approved successfully');

    return res.status(200).json(new ApiResponse(200, updated, "work permit approved"));
});

// SUPER_ADMIN only: Close a work permit form
export const closeWorkPermitForm = asyncHandler(async (req, res) => {
    const { workPermitFormId } = req.params;
    const { openingPTWData, workClearanceDescription } = req.body;
    const userId = req.user.id;
    const userName = req.user.name;

    console.log('=== Closing Work Permit Form ===');
    console.log('Form ID:', workPermitFormId);
    console.log('Closed by:', userName, '(ID:', userId, ')');
    console.log('Opening PTW Data:', openingPTWData);
    console.log('Work Clearance Description:', workClearanceDescription);

    if (!workPermitFormId) {
        throw new ApiError(400, "workPermitFormId is required");
    }

    const form = await db.workPermitForm.findUnique({ where: { id: workPermitFormId } });
    if (!form) {
        throw new ApiError(404, "Form not found");
    }

    console.log('Current form status:', form.status);
    console.log('Form title:', form.title);

    // Update form status to CLOSED
    const updated = await db.workPermitForm.update({
        where: { id: workPermitFormId },
        data: { 
            status: "CLOSED",
            // Store the Opening PTW data and work clearance description
            closureData: {
                openingPTW: openingPTWData,
                workClearanceDescription: workClearanceDescription,
                closedBy: userName,
                closedAt: new Date().toISOString()
            }
        },
    });

    console.log('Updated form status:', updated.status);
    console.log('Form closed successfully');

    return res.status(200).json(new ApiResponse(200, updated, "work permit closed"));
});

// SUPER_ADMIN only: Get forms pending approval for a specific super admin
export const getFormsPendingApproval = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const userName = req.user.name;
    const userRole = req.user.role;

    console.log('Super admin:', userName, 'looking for forms pending approval');

    try {
        // Test database connection first
        console.log('Testing database connection...');
        const testQuery = await db.workPermitSubmission.count();
        console.log('Total submissions in database:', testQuery);
        
        // Also check work permit forms
        const formCount = await db.workPermitForm.count();
        console.log('Total work permit forms in database:', formCount);
        
        // Check if there are any PENDING forms
        const pendingCount = await db.workPermitForm.count({
            where: { status: 'PENDING' }
        });
        console.log('Total PENDING work permit forms:', pendingCount);
        
        // Get all submissions and filter manually since JSON path queries can be tricky
        const allSubmissions = await db.workPermitSubmission.findMany({
        include: {
            workPermitForm: {
                include: {
                    user: {
                        select: { name: true, email: true }
                    },
                    company: {
                        select: { compName: true }
                    }
                }
            },
            submittedBy: {
                select: { name: true, email: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    console.log('Total submissions found:', allSubmissions.length);
    
    // Debug: Log a few sample answers to see the structure
    if (allSubmissions.length > 0) {
        console.log('Sample answers structure:', JSON.stringify(allSubmissions[0].answers, null, 2));
        console.log('Sample form status:', allSubmissions[0].workPermitForm.status);
        console.log('Sample form title:', allSubmissions[0].workPermitForm.title);
        console.log('Sample submitted by:', allSubmissions[0].submittedBy.name);
        
        // Check if any submission has opening-ptw section
        const hasOpeningPTW = allSubmissions.some(sub => {
            const answers = sub.answers;
            return answers && typeof answers === 'object' && answers['opening-ptw'];
        });
        console.log('Any submission has opening-ptw section:', hasOpeningPTW);
        
        if (hasOpeningPTW) {
            const sampleWithPTW = allSubmissions.find(sub => {
                const answers = sub.answers;
                return answers && typeof answers === 'object' && answers['opening-ptw'];
            });
            console.log('Sample opening-ptw data:', JSON.stringify(sampleWithPTW.answers['opening-ptw'], null, 2));
        } else {
            // Check if any submission has permit-issuing-authority-name in any section
            console.log('Checking for permit-issuing-authority-name in any section...');
            allSubmissions.forEach((sub, index) => {
                const answers = sub.answers;
                if (answers && typeof answers === 'object') {
                    // Look for any field that might contain the issuing authority name
                    Object.keys(answers).forEach(key => {
                        const value = answers[key];
                        if (typeof value === 'string' && value.includes('Mohammed Saleh')) {
                            console.log(`Found "Mohammed Saleh" in submission ${sub.id}, field ${key}:`, value);
                        }
                    });
                }
            });
        }
    } else {
        console.log('No submissions found in database');
    }

    // Filter submissions where this super admin is the issuing authority
    const relevantSubmissions = allSubmissions.filter(submission => {
        const answers = submission.answers;
        
        if (!answers || typeof answers !== 'object') {
            return false;
        }
        
        // First, try the new structure with opening-ptw section
        const openingPTW = answers['opening-ptw'];
        if (openingPTW && typeof openingPTW === 'object') {
            const issuingAuthority = openingPTW['permit-issuing-authority-name'];
            console.log('Checking submission:', submission.id, '(opening-ptw structure)');
            console.log('Found issuing authority:', issuingAuthority, 'Type:', typeof issuingAuthority);
            console.log('Looking for super admin:', userName, 'Type:', typeof userName);
            
            const isMatch = issuingAuthority === userName || 
                           (issuingAuthority && userName && issuingAuthority.includes(userName)) ||
                           (issuingAuthority && userName && userName.includes(issuingAuthority));
            
            console.log('Match result:', isMatch);
            console.log('---');
            return isMatch;
        }
        
        // Fallback: Check if any field contains the super admin name
        console.log('Checking submission:', submission.id, '(fallback search)');
        let foundMatch = false;
        
        Object.keys(answers).forEach(key => {
            const value = answers[key];
            if (typeof value === 'string' && value === userName) {
                console.log(`Found exact match in field ${key}:`, value);
                foundMatch = true;
            }
        });
        
        console.log('Fallback match result:', foundMatch);
        console.log('---');
        return foundMatch;
    });

    console.log('Submissions with this super admin as issuing authority:', relevantSubmissions.length);

    // Filter forms that are still pending approval
    const pendingForms = relevantSubmissions.filter(submission => 
        submission.workPermitForm.status === 'PENDING'
    );

    console.log('Pending forms:', pendingForms.length);
    console.log('All relevant forms (any status):', relevantSubmissions.length);
    
    // Debug: Show all form statuses
    const statusCounts = {};
    relevantSubmissions.forEach(sub => {
        const status = sub.workPermitForm.status;
        statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    console.log('Form status distribution:', statusCounts);
    
    // TEMPORARY: Return all relevant forms to show them
    // TODO: Create new test forms or reset existing forms to PENDING status
    console.log('Returning all relevant forms (temporary):', relevantSubmissions.length);
    
    return res.status(200).json(new ApiResponse(200, relevantSubmissions, "Forms pending approval fetched (showing all forms temporarily)"));
    } catch (error) {
        console.error('Error in getFormsPendingApproval:', error);
        throw new ApiError(500, `Failed to fetch pending forms: ${error.message}`);
    }
});

// TEMPORARY: Reset all forms to PENDING status for testing
export const resetFormsToPending = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const userName = req.user.name;

    console.log('=== Resetting Forms to PENDING Status ===');
    console.log('Reset by:', userName, '(ID:', userId, ')');

    try {
        // Get all forms that are APPROVED or CLOSED
        const formsToReset = await db.workPermitForm.findMany({
            where: {
                status: {
                    in: ['APPROVED', 'CLOSED']
                }
            }
        });

        console.log('Found forms to reset:', formsToReset.length);

        if (formsToReset.length === 0) {
            return res.status(200).json(new ApiResponse(200, [], "No forms found to reset"));
        }

        // Reset all forms to PENDING
        const updatedForms = await db.workPermitForm.updateMany({
            where: {
                status: {
                    in: ['APPROVED', 'CLOSED']
                }
            },
            data: {
                status: 'PENDING'
            }
        });

        console.log('Reset forms count:', updatedForms.count);

        return res.status(200).json(new ApiResponse(200, { count: updatedForms.count }, "Forms reset to PENDING status"));
    } catch (error) {
        console.error('Error resetting forms:', error);
        throw new ApiError(500, `Failed to reset forms: ${error.message}`);
    }
});

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