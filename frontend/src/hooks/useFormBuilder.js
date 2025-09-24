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
    const [permitNumberGenerated, setPermitNumberGenerated] = useState(false);

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

    // In edit mode, if backend has a workPermitNo, inject it into the 'Work Permit No' component and disable it
    useEffect(() => {
        if (!workPermitId) return;
        const wpNo = currentWorkPermit?.workPermitNo;
        if (!wpNo) return;
        if (!formData?.sections?.length) return;

        const targetSectionIndex = formData.sections.findIndex(sec =>
            (sec.components || []).some(c => /work\s*permit\s*no/i.test(c.label))
        );
        if (targetSectionIndex === -1) return;
        const section = formData.sections[targetSectionIndex];
        const componentIndex = (section.components || []).findIndex(c => /work\s*permit\s*no/i.test(c.label));
        if (componentIndex === -1) return;

        setFormData(prev => {
            const next = { ...prev };
            const sec = { ...next.sections[targetSectionIndex] };
            const comps = [...sec.components];
            const existingVal = comps[componentIndex]?.value;
            if (existingVal === wpNo && comps[componentIndex]?.enabled === false) return prev;
            comps[componentIndex] = { ...comps[componentIndex], value: wpNo, enabled: false };
            sec.components = comps;
            next.sections = [...next.sections];
            next.sections[targetSectionIndex] = sec;
            return next;
        });
    }, [workPermitId, currentWorkPermit?.workPermitNo, formData.sections]);

    // Auto-generate 6-digit unique Work Permit No for new forms (once)
    useEffect(() => {
        if (workPermitId) return; // don't generate on edit
        if (permitNumberGenerated) return; // only once
        if (!formData?.sections?.length) return;
        // find a component whose label includes 'Work Permit No'
        const targetSectionIndex = formData.sections.findIndex(sec =>
            (sec.components || []).some(c => /work\s*permit\s*no/i.test(c.label))
        );
        if (targetSectionIndex === -1) return;
        const section = formData.sections[targetSectionIndex];
        const componentIndex = (section.components || []).findIndex(c => /work\s*permit\s*no/i.test(c.label));
        if (componentIndex === -1) return;

        const generateSixDigit = () => Math.floor(100000 + Math.random() * 900000).toString();
        const newNumber = generateSixDigit();

        setFormData(prev => {
            const next = { ...prev };
            const sec = { ...next.sections[targetSectionIndex] };
            const comps = [...sec.components];
            comps[componentIndex] = { ...comps[componentIndex], value: newNumber, enabled: false };
            sec.components = comps;
            next.sections = [...next.sections];
            next.sections[targetSectionIndex] = sec;
            return next;
        });
        setPermitNumberGenerated(true);
    }, [formData.sections, workPermitId, permitNumberGenerated]);

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
