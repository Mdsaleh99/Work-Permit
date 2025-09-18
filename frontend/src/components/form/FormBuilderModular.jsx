import React, { useEffect } from "react";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { cn } from "../../lib/utils";
import { X } from "lucide-react";

// Custom hooks
import { useFormBuilder } from "../../hooks/useFormBuilder";
import { useDraftOperations } from "../../hooks/useDraftOperations";
import { useFormOperations } from "../../hooks/useFormOperations";

// Components
import FormBuilderHeader from "./FormBuilderHeader";
import FormBuilderSidebar from "./FormBuilderSidebar";
import DraftsModal from "./DraftsModal";
import DeclarationModal from "./DeclarationModal";
import PrintView from "./PrintView";
import FormSection from "./FormSection";
import ComponentPalette from "../drag-drop/ComponentPalette";

/**
 * Modular Form Builder Component
 * 
 * This component is broken down into smaller, focused components and custom hooks
 * for better maintainability and readability.
 */
const FormBuilderModular = ({ 
    title, 
    sectionsTemplate, 
    startWithTemplate = true, 
    workPermitId = null,
    permitType = "work"
}) => {
    // console.log("FormBuilder props:", { title, sectionsTemplate, startWithTemplate, workPermitId, isReadOnly, permitType });
    
    const navigate = useNavigate();
    const isEditingMode = Boolean(workPermitId);

    // Main form builder hook
    const formBuilderState = useFormBuilder({ 
        title, 
        sectionsTemplate, 
        startWithTemplate, 
        workPermitId,
        permitType
    });

    // Destructure state for easier access
    const {
        formData,
        setFormData,
        editingComponent,
        setEditingComponent,
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
        currentDraftId,
        setCurrentDraftId,
        showDraftsModal,
        setShowDraftsModal,
        saveTimerRef,
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
        createWorkPermit,
        updateWorkPermit,
        getWorkPermitById,
        createOrUpdateDraft,
        getAllDrafts,
        getDraftById,
        deleteDraft,
        duplicateDraft,
        getCompanyByUser,
    } = formBuilderState;

    // Draft operations hook
    const draftOperations = useDraftOperations({
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
    });

    // Form operations hook
    const formOperations = useFormOperations({
        formData,
        setFormData,
        editingComponent,
        setEditingComponent,
        declarationChecks,
        setDeclarationChecks,
        showAgreeModal,
        setShowAgreeModal,
    });

    // Propagate workPermitId to formData for header disable logic
    useEffect(() => {
        if (workPermitId && !formData.workPermitId) {
            setFormData(prev => ({ ...prev, workPermitId }));
        }
    }, [workPermitId]);

    // Load drafts on mount
    useEffect(() => {
        getAllDrafts();
    }, [getAllDrafts]);

    // Restore latest draft on component mount (only for new forms, not edit mode)
    useEffect(() => {
        if (!workPermitId && companyData?.id) {
            const timer = setTimeout(() => {
                draftOperations.restoreLatestDraft();
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [companyData?.id, workPermitId, draftOperations.restoreLatestDraft]);

    // Handle form submission
    const handleSubmitForm = async () => {
        if (!companyData?.id) {
            toast.error("Company information is required");
            return;
        }

        try {
            const workPermitData = {
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

            if (workPermitId) {
                await updateWorkPermit(workPermitData, companyData.id, workPermitId);
                toast.success("Work permit updated successfully");
            } else {
                await createWorkPermit(workPermitData, companyData.id);
                toast.success("Work permit created successfully");
            }

            // Navigate to dashboard or work permit list
            navigate({ to: "/page/app/permit" });
        } catch (error) {
            console.error("Error submitting form:", error);
            toast.error("Failed to submit form");
        }
    };

    // Handle save button click
    const handleSave = () => {
        toast.success("Draft saved");
    };

    // Handle reset form
    const handleResetForm = () => {
        formOperations.resetForm();
    };

    // Handle show drafts modal
    const handleShowDraftsModal = () => {
        setShowDraftsModal(true);
    };

    // Handle clear draft
    const handleClearDraft = () => {
        draftOperations.clearDraft();
    };

    // Handle test auto-save
    const handleTestAutoSave = () => {
        draftOperations.testAutoSave();
    };

    // Auto-save logic is handled centrally (same for create/edit). No edit-specific autosave here.

    // Handle load draft
    const handleLoadDraft = (draftId) => {
        draftOperations.loadDraft(draftId);
    };

    // Handle delete draft
    const handleDeleteDraft = async (draftId) => {
        try {
            await deleteDraft(draftId);
            toast.success("Draft deleted successfully");
            getAllDrafts(); // Refresh drafts list
        } catch (error) {
            console.error("Error deleting draft:", error);
            toast.error("Failed to delete draft");
        }
    };

    // Handle duplicate draft
    const handleDuplicateDraft = async (draftId) => {
        try {
            await duplicateDraft(draftId);
            toast.success("Draft duplicated successfully");
            getAllDrafts(); // Refresh drafts list
        } catch (error) {
            console.error("Error duplicating draft:", error);
            toast.error("Failed to duplicate draft");
        }
    };

    // Handle submit button click
    const handleSubmit = () => {
        if (isEditingMode) {
            // In edit mode, skip declaration modal and submit directly
            handleSubmitForm();
            return;
        }
        formOperations.initDeclarationChecks();
        setShowAgreeModal(true);
    };

    // Handle declaration submission
    const handleDeclarationSubmit = () => {
        if (formOperations.areAllDeclarationsChecked()) {
            handleSubmitForm();
        } else {
            toast.error("Please check all declaration boxes");
        }
    };

    // Render print view
    if (showPrintView) {
        return (
            <div className="min-h-screen bg-white">
                <PrintView formData={formData} onToggleView={() => setShowPrintView(false)} />
            </div>
        );
    }

    // Render main form builder
    return (
        <div className="h-screen bg-gray-50 flex flex-col">
            {/* Mobile overlays */}
            {isMobile && !sidebarCollapsed && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={() => setSidebarCollapsed(true)}
                />
            )}
            {isMobile && showComponentsPanel && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={() => setShowComponentsPanel(false)}
                />
            )}

            {/* Header */}
            <FormBuilderHeader
                formData={formData}
                setFormData={setFormData}
                sidebarCollapsed={sidebarCollapsed}
                setSidebarCollapsed={setSidebarCollapsed}
                showPrintView={showPrintView}
                setShowPrintView={setShowPrintView}
                showComponentsPanel={showComponentsPanel}
                setShowComponentsPanel={setShowComponentsPanel}
                isAutoSaving={isAutoSaving}
                lastSavedTime={lastSavedTime}
                onSave={handleSave}
                onSubmit={handleSubmit}
                onResetForm={handleResetForm}
                onShowDraftsModal={handleShowDraftsModal}
                onClearDraft={handleClearDraft}
                onTestAutoSave={handleTestAutoSave}
                drafts={drafts}
                isMobile={isMobile}
                isEditingMode={isEditingMode}
            />

            {/* Main content */}
            <div className="flex flex-1 overflow-hidden">
                {/* Left Sidebar - Sections */}
                <FormBuilderSidebar
                    sidebarCollapsed={sidebarCollapsed}
                    setSidebarCollapsed={setSidebarCollapsed}
                    formData={formData}
                    setFormData={setFormData}
                    editingComponent={editingComponent}
                    setEditingComponent={setEditingComponent}
                    onAddComponent={formOperations.addComponentToSection}
                    onUpdateComponent={formOperations.updateComponent}
                    onDeleteComponent={formOperations.deleteComponent}
                    onToggleSectionEnabled={formOperations.toggleSectionEnabled}
                    onUpdateSectionTitle={formOperations.updateSectionTitle}
                    onReorderSections={formOperations.reorderSections}
                    onReorderComponents={formOperations.reorderComponents}
                    onResetForm={isEditingMode ? undefined : draftOperations.createNewDraft}
                    onShowDraftsModal={isEditingMode ? undefined : handleShowDraftsModal}
                    onInitDeclarationChecks={formOperations.initDeclarationChecks}
                    onShowDeclarationModal={() => setShowAgreeModal(true)}
                    onLoadDraft={handleLoadDraft}
                    onDeleteDraft={handleDeleteDraft}
                    onDuplicateDraft={handleDuplicateDraft}
                    drafts={drafts}
                    isMobile={isMobile}
                    isEditingMode={isEditingMode}
                />

                {/* Center - Main form area */}
                <div className="flex-1 overflow-hidden">
                    <div className="h-full overflow-y-auto">
                        <FormSection
                            formData={formData}
                            editingComponent={editingComponent}
                            setEditingComponent={setEditingComponent}
                            onAddComponent={formOperations.addComponentToSection}
                            onUpdateComponent={formOperations.updateComponent}
                            onDeleteComponent={formOperations.deleteComponent}
                            onReorderComponents={formOperations.reorderComponents}
                        />
                    </div>
                </div>

                {/* Right Sidebar - Component Palette */}
                (
                    <div className={cn(
                        "bg-white border-l border-gray-200 flex flex-col",
                        isMobile 
                            ? (showComponentsPanel ? "fixed right-0 top-0 h-full w-80 z-50 shadow-lg" : "hidden")
                            : "w-80 flex-shrink-0"
                    )}>
                        <div className="p-4 flex-shrink-0">
                            <div className="flex items-center justify-between">
                                <div>
                                    {/* <h3 className="text-lg font-semibold text-gray-800 mb-2">Components</h3>
                                    <p className="text-sm text-gray-600">
                                        Drag components to the form or click to add them to the selected section.
                                    </p> */}
                                </div>
                                {isMobile && (
                                    <button
                                        onClick={() => setShowComponentsPanel(false)}
                                        className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                                    >
                                        <X className="w-5 h-5 text-gray-600" />
                                    </button>
                                )}
                            </div>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto px-4 pb-4">
                            <ComponentPalette />
                        </div>
                    </div>
                )
            </div>

            {/* Modals */}
            <DraftsModal
                showDraftsModal={showDraftsModal}
                setShowDraftsModal={setShowDraftsModal}
                drafts={drafts}
                onLoadDraft={handleLoadDraft}
                onDeleteDraft={handleDeleteDraft}
                onDuplicateDraft={handleDuplicateDraft}
                isLoading={isCreatingDraft}
            />

            <DeclarationModal
                showAgreeModal={showAgreeModal}
                setShowAgreeModal={setShowAgreeModal}
                declarationChecks={declarationChecks}
                updateDeclarationCheck={formOperations.updateDeclarationCheck}
                areAllDeclarationsChecked={formOperations.areAllDeclarationsChecked}
                getDeclarationComponents={formOperations.getDeclarationComponents}
                onSubmitForm={handleDeclarationSubmit}
                isSubmitting={isCreating || isUpdating}
            />
        </div>
    );
};

export default FormBuilderModular;
