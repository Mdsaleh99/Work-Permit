import { useEffect } from "react";
import { toast } from "sonner";
import { PTW_SECTION_TEMPLATES } from "../lib/constants";
import { generateId } from "../lib/utils";

/**
 * Custom hook for managing draft operations
 */
export const useDraftOperations = ({
    formData,
    setFormData,
    companyData,
    createOrUpdateDraft,
    getAllDrafts,
    getDraftById,
    deleteDraft,
    duplicateDraft,
    currentDraftId,
    setCurrentDraftId,
    isCreatingNewForm,
    setIsCreatingNewForm,
    saveTimerRef,
    setLastSavedTime,
    workPermitId,
}) => {
    
    // Auto-save to database every 2 seconds (only for new forms, not edit mode)
    useEffect(() => {
        if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
        
        // Don't auto-save if we're in edit mode (workPermitId exists)
        if (workPermitId) return;
        
        // Don't auto-save if we're creating a new form
        if (isCreatingNewForm) return;
        
        // Only auto-save if we have company data and form data
        if (!companyData?.id || !formData?.title) {
            console.log("Auto-save skipped: Missing company data or form title");
            return;
        }
        
        // Don't auto-save if form is empty (no components)
        const hasComponents = formData.sections.some(section => section.components.length > 0);
        if (!hasComponents) {
            console.log("Auto-save skipped: No components to save");
            return;
        }
        
        saveTimerRef.current = setTimeout(async () => {
            try {
                const draftData = {
                    title: formData.title,
                    sections: formData.sections.map(section => ({
                        title: section.title,
                        enabled: section.enabled !== false,
                        components: section.components.map(component => ({
                            label: component.label,
                            type: component.type,
                            required: component.required || false,
                            enabled: component.enabled !== false,
                            options: component.options || []
                        }))
                    }))
                };

                console.log("Auto-saving draft data:", draftData);
                
                // Always overwrite current draft (over draft behavior)
                const savedDraft = await createOrUpdateDraft(draftData, companyData.id, true);
                if (!currentDraftId) {
                    setCurrentDraftId(savedDraft.id);
                }
                
                // Show subtle auto-save indicator
                const saveTime = new Date();
                setLastSavedTime(saveTime);
                console.log("✅ Auto-saved successfully at", saveTime.toLocaleTimeString());
            } catch (error) {
                console.error("Auto-save failed:", error);
                // Don't show toast for auto-save failures to avoid spam
            }
        }, 2000); // Auto-save every 2 seconds
        
        return () => saveTimerRef.current && clearTimeout(saveTimerRef.current);
    }, [formData, companyData, createOrUpdateDraft, currentDraftId, workPermitId, isCreatingNewForm]);

    const createNewDraft = async () => {
        if (!companyData?.id) {
            toast.error("Company information is required to create a draft");
            return;
        }

        // Set flag to prevent auto-save conflicts
        setIsCreatingNewForm(true);
        
        // 1) Save the current form as a manual draft (so it appears in Drafts)
        try {
            const hasComponents = formData?.sections?.some(section => section.components.length > 0);
            if (formData?.title && hasComponents) {
                const previousDraftData = {
                    title: formData.title,
                    sections: formData.sections.map(section => ({
                        title: section.title,
                        enabled: section.enabled !== false,
                        components: section.components.map(component => ({
                            label: component.label,
                            type: component.type,
                            required: component.required || false,
                            enabled: component.enabled !== false,
                            options: component.options || []
                        }))
                    }))
                };

                await createOrUpdateDraft(previousDraftData, companyData.id, false);
                toast.success("Current form saved to Drafts");
            }
        } catch (e) {
            console.error("Failed to save current form to drafts before creating new:", e);
        }

        // Clear current draft ID to prevent auto-save from overwriting the new template draft
        setCurrentDraftId(null);

        // Start with template that includes all sections and components
        const templateForm = {
            title: formData.title || "GENERAL WORK PERMIT",
            sections: PTW_SECTION_TEMPLATES || [],
            selectedSection: "work-description",
        };
        
        setFormData(templateForm);
        
        try {
            const draftData = {
                title: templateForm.title,
                sections: templateForm.sections.map(section => ({
                    title: section.title,
                    enabled: section.enabled !== false,
                    components: section.components.map(component => ({
                        label: component.label,
                        type: component.type,
                        required: component.required || false,
                        enabled: component.enabled !== false,
                        options: component.options || []
                    }))
                }))
            };

            console.log("Creating new draft with data:", draftData);
            const savedDraft = await createOrUpdateDraft(draftData, companyData.id, true);
            setCurrentDraftId(savedDraft.id);
            // Refresh drafts list so the previous manual draft appears immediately
            try { await getAllDrafts?.(); } catch {}
            toast.success("New form created with template");
        } catch (error) {
            console.error("Error creating new draft:", error);
            toast.error("Failed to create new draft");
        } finally {
            // Reset flag after a short delay to allow form data to settle
            setTimeout(() => setIsCreatingNewForm(false), 1000);
        }
    };

    const loadDraft = async (draftId) => {
        if (!draftId) return;
        
        setIsCreatingNewForm(true);
        
        try {
            const draft = await getDraftById(draftId);
            console.log("Loading draft:", draft);
            
            if (draft) {
                // Map draft data to form data structure
                const mappedFormData = {
                    title: draft.title,
                    sections: draft.sections.map(section => ({
                        id: section.id || generateId(),
                        title: section.title,
                        enabled: section.enabled !== false,
                        components: section.components.map(component => ({
                            id: component.id || generateId(),
                            label: component.label,
                            type: component.type,
                            required: component.required || false,
                            enabled: component.enabled !== false,
                            options: component.options || []
                        }))
                    })),
                    selectedSection: draft.sections[0]?.id || "work-description"
                };
                
                console.log("Mapped form data:", mappedFormData);
                setFormData(mappedFormData);
                setCurrentDraftId(draft.id);
                toast.success("Draft loaded successfully");
            }
        } catch (error) {
            console.error("Error loading draft:", error);
            toast.error("Failed to load draft");
        } finally {
            setTimeout(() => setIsCreatingNewForm(false), 1000);
        }
    };

    const clearDraft = async () => {
        if (!currentDraftId) return;
        
        try {
            await deleteDraft(currentDraftId);
            setCurrentDraftId(null);
            setLastSavedTime(null);
            toast.success("Draft removed");
        } catch (error) {
            console.error("Error deleting draft:", error);
            toast.error("Failed to delete draft");
        }
    };

    const duplicateDraftAction = async (draftId) => {
        if (!draftId) return;
        
        try {
            const duplicatedDraft = await duplicateDraft(draftId);
            setCurrentDraftId(duplicatedDraft.id);
            toast.success("Draft duplicated successfully");
        } catch (error) {
            console.error("Error duplicating draft:", error);
            toast.error("Failed to duplicate draft");
        }
    };

    const restoreLatestDraft = async () => {
        try {
            if (!companyData?.id) {
                console.log("No company data available for restoring draft");
                return;
            }

            // Prevent repeated restores/toasts within a session per company
            const restoreGuardKey = `ptw_restored_latest_${companyData.id}`;
            if (sessionStorage.getItem(restoreGuardKey)) {
                return;
            }

            // Get all drafts for the company
            const allDrafts = await getAllDrafts(companyData.id);
            if (!allDrafts || allDrafts.length === 0) {
                console.log("No drafts found to restore");
                return;
            }

            // Find the latest draft (most recent)
            const latestDraft = allDrafts.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0];
            
            if (latestDraft) {
                await loadDraft(latestDraft.id);
                setCurrentDraftId(latestDraft.id);
                // Mark restored for this session
                sessionStorage.setItem(restoreGuardKey, "1");
            }
        } catch (error) {
            console.error("Error restoring latest draft:", error);
            // Don't show error toast on page load to avoid spam
        }
    };

    // Debug function to test auto-save
    const testAutoSave = () => {
        console.log("🔍 Auto-save Debug Info:");
        console.log("- Company Data:", companyData?.id ? "✅ Present" : "❌ Missing");
        console.log("- Form Title:", formData?.title ? "✅ Present" : "❌ Missing");
        console.log("- Has Components:", formData?.sections?.some(s => s.components.length > 0) ? "✅ Yes" : "❌ No");
        console.log("- Is Creating New Form:", isCreatingNewForm ? "❌ Yes (blocking)" : "✅ No");
        console.log("- Work Permit ID:", workPermitId ? "❌ Present (blocking)" : "✅ None");
        console.log("- Current Draft ID:", currentDraftId || "None");
        console.log("- Last Saved:", lastSavedTime ? lastSavedTime.toLocaleTimeString() : "Never");
    };

    return {
        createNewDraft,
        loadDraft,
        clearDraft,
        duplicateDraftAction,
        restoreLatestDraft,
        testAutoSave,
    };
};
