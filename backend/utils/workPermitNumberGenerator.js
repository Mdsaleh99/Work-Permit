import { db } from "../db/db.js";

/**
 * Generates a unique work permit number
 * Format: 6-digit number (100000-999999)
 * @returns {Promise<string>} Unique work permit number
 */
export const generateUniqueWorkPermitNumber = async () => {
    const maxAttempts = 10;
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        // Generate a 6-digit number between 100000 and 999999
        const workPermitNo = String(Math.floor(100000 + Math.random() * 900000));
        
        // Check if this number already exists
        const existing = await db.workPermitForm.findUnique({
            where: { workPermitNo },
            select: { id: true }
        });
        
        if (!existing) {
            return workPermitNo;
        }
    }
    
    // If we couldn't find a unique number after maxAttempts, throw an error
    throw new Error(`Failed to generate unique work permit number after ${maxAttempts} attempts`);
};

/**
 * Validates if a work permit number is unique
 * @param {string} workPermitNo - The work permit number to check
 * @param {string} excludeId - Optional ID to exclude from the check (for updates)
 * @returns {Promise<boolean>} True if unique, false otherwise
 */
export const isWorkPermitNumberUnique = async (workPermitNo, excludeId = null) => {
    if (!workPermitNo) return true; // Empty/null is considered unique
    
    const whereClause = { workPermitNo };
    if (excludeId) {
        whereClause.id = { not: excludeId };
    }
    
    const existing = await db.workPermitForm.findFirst({
        where: whereClause,
        select: { id: true }
    });
    
    return !existing;
};

/**
 * Generates a work permit number with company prefix
 * Format: {COMPANY_CODE}-{6-digit-number}
 * @param {string} companyCode - Company code/abbreviation
 * @returns {Promise<string>} Unique work permit number with company prefix
 */
export const generateCompanyPrefixedWorkPermitNumber = async (companyCode) => {
    if (!companyCode) {
        return await generateUniqueWorkPermitNumber();
    }
    
    const maxAttempts = 10;
    const cleanCompanyCode = companyCode.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 3);
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        // Generate a 6-digit number between 100000 and 999999
        const numberPart = String(Math.floor(100000 + Math.random() * 900000));
        const workPermitNo = `${cleanCompanyCode}-${numberPart}`;
        
        // Check if this number already exists
        const existing = await db.workPermitForm.findUnique({
            where: { workPermitNo },
            select: { id: true }
        });
        
        if (!existing) {
            return workPermitNo;
        }
    }
    
    // If we couldn't find a unique number after maxAttempts, fallback to simple number
    return await generateUniqueWorkPermitNumber();
};
