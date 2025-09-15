import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { PTW_SECTIONS, PTW_SECTION_TEMPLATES } from "../lib/constants";
import { useWorkPermitStore } from "@/store/useWorkPermitStore";
import { useCompanyStore } from "@/store/useCompanyStore";
import { useWorkPermitDraftStore } from "@/store/useWorkPermitDraftStore";

/**
 * Custom hook for managing form builder state and operations
 */
export const useFormBuilder = ({ title, sectionsTemplate, startWithTemplate = true, workPermitId = null, isReadOnly = false, permitType = "work" }) => {
    // Store hooks
    const { 
        createWorkPermit, 
        updateWorkPermit, 
        getWorkPermitById,
        currentWorkPermit,
        isCreating, 
        isUpdating, 
        isFetching,
        workPermitError 
    } = useWorkPermitStore();
    
    const { companyData, getCompanyByUser, isGetCompany } = useCompanyStore();
    
    const { 
        createOrUpdateDraft, 
        getAllDrafts, 
        getDraftById, 
        deleteDraft, 
        duplicateDraft,
        drafts,
        currentDraft,
        isAutoSaving,
        isCreating: isCreatingDraft,
        isDeleting: isDeletingDraft,
        draftError
    } = useWorkPermitDraftStore();

    // Form state
    const [formData, setFormData] = useState({
        title: title || "GENERAL WORK PERMIT",
        sections: startWithTemplate
            ? (sectionsTemplate || PTW_SECTIONS.map((section) => ({
                id: section.id,
                title: section.title,
                enabled: true,
                components: [],
            })))
            : [],
        selectedSection: startWithTemplate
            ? ((sectionsTemplate && sectionsTemplate[0]?.id) || "work-description")
            : null,
    });

    // UI state
    const [editingComponent, setEditingComponent] = useState(null);
    const [showPrintView, setShowPrintView] = useState(false);
    const [showComponentsPanel, setShowComponentsPanel] = useState(false);
    const [declarationChecks, setDeclarationChecks] = useState({});
    const [showAgreeModal, setShowAgreeModal] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isCreatingNewForm, setIsCreatingNewForm] = useState(false);
    const [lastSavedTime, setLastSavedTime] = useState(null);

    // Draft system state
    const [currentDraftId, setCurrentDraftId] = useState(null);
    const [showDraftsModal, setShowDraftsModal] = useState(false);
    const saveTimerRef = useRef(null);

    // Initialize company data
    useEffect(() => {
        if (!companyData && !isGetCompany) {
            getCompanyByUser();
        }
    }, [companyData, isGetCompany, getCompanyByUser]);

    // Update formData when sectionsTemplate changes (for edit mode)
    useEffect(() => {
        if (workPermitId && sectionsTemplate && sectionsTemplate.length > 0) {
            setFormData({
                title: title || "GENERAL WORK PERMIT",
                sections: sectionsTemplate,
                selectedSection: sectionsTemplate[0]?.id || null,
            });
        }
    }, [workPermitId, sectionsTemplate, title]);

    // Mobile detection
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth < 1024) {
                setSidebarCollapsed(true);
            }
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return {
        // Form state
        formData,
        setFormData,
        editingComponent,
        setEditingComponent,
        
        // UI state
        showPrintView,
        setShowPrintView,
        showComponentsPanel,
        setShowComponentsPanel,
        declarationChecks,
        setDeclarationChecks,
        showAgreeModal,
        setShowAgreeModal,
        sidebarCollapsed,
        setSidebarCollapsed,
        isMobile,
        isCreatingNewForm,
        setIsCreatingNewForm,
        lastSavedTime,
        setLastSavedTime,
        
        // Draft state
        currentDraftId,
        setCurrentDraftId,
        showDraftsModal,
        setShowDraftsModal,
        saveTimerRef,
        
        // Store data
        companyData,
        drafts,
        currentDraft,
        isAutoSaving,
        isCreatingDraft,
        isDeletingDraft,
        draftError,
        currentWorkPermit,
        isCreating,
        isUpdating,
        isFetching,
        workPermitError,
        
        // Store actions
        createWorkPermit,
        updateWorkPermit,
        getWorkPermitById,
        createOrUpdateDraft,
        getAllDrafts,
        getDraftById,
        deleteDraft,
        duplicateDraft,
        getCompanyByUser,
    };
};
