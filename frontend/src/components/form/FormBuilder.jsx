import React, { useEffect, useRef, useState } from "react";
import ReorderableList from "../drag-drop/ReorderableList";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
    Plus,
    GripVertical,
    Edit,
    Trash2,
    Save,
    Settings,
    FileText,
    Shield,
    HardHat,
    AlertTriangle,
    CheckCircle,
    Clock,
    UserCheck,
    FileCheck,
    Flame,
    Printer,
    Menu,
    X,
} from "lucide-react";
import ComponentPalette from "../drag-drop/ComponentPalette";
// DroppableSection no longer needed with pragmatic dnd
import PrintView from "./PrintView";
import { toast } from "sonner";
import { cn, generateId } from "../../lib/utils";
import { PTW_SECTIONS, PTW_SECTION_TEMPLATES } from "../../lib/constants";
import { useWorkPermitStore } from "@/store/useWorkPermitStore";
import { useCompanyStore } from "@/store/useCompanyStore";
import { useWorkPermitDraftStore } from "@/store/useWorkPermitDraftStore";
import { useNavigate } from "@tanstack/react-router";

const FormBuilder = ({ title, sectionsTemplate, startWithTemplate = true, workPermitId = null }) => {
    console.log("FormBuilder props:", { title, sectionsTemplate, startWithTemplate, workPermitId });
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
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: title || "GENERAL WORK PERMIT",
        sections:
            startWithTemplate && sectionsTemplate
                ? sectionsTemplate
                : PTW_SECTIONS.map((section) => ({
                      id: section.id,
                      title: section.title,
                      enabled: true,
                      components: [],
                  })),
        selectedSection:
            (startWithTemplate && sectionsTemplate && sectionsTemplate[0]?.id) ||
            "work-description",
    });

    // Update formData when sectionsTemplate changes (for edit mode)
    useEffect(() => {
        if (workPermitId && sectionsTemplate && sectionsTemplate.length > 0) {
            console.log("Updating formData with sectionsTemplate:", sectionsTemplate);
            setFormData(prevFormData => ({
                title: title || prevFormData.title,
                sections: sectionsTemplate,
                selectedSection: sectionsTemplate[0]?.id || "work-description"
            }));
            toast.success("Work permit data loaded successfully");
        }
    }, [workPermitId, sectionsTemplate, title]);

    const [editingComponent, setEditingComponent] = useState(null);
    const [showPrintView, setShowPrintView] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [declarationChecks, setDeclarationChecks] = useState({}); // key: componentId, value: boolean
    const [showAgreeModal, setShowAgreeModal] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isCreatingNewForm, setIsCreatingNewForm] = useState(false);
    const [lastSavedTime, setLastSavedTime] = useState(null);

    // Database-backed draft system
    const [currentDraftId, setCurrentDraftId] = useState(null);
    const [showDraftsModal, setShowDraftsModal] = useState(false);
    const saveTimerRef = useRef(null);

    // Responsive behavior
    useEffect(() => {
        const checkScreenSize = () => {
            const mobile = window.innerWidth < 768; // md breakpoint
            setIsMobile(mobile);
            // Auto-collapse sidebar on small screens to give more space to main content
            if (window.innerWidth < 1024) { // lg breakpoint
                setSidebarCollapsed(true);
            }
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    // Load company data when FormBuilder mounts
    useEffect(() => {
        const loadCompanyData = async () => {
            if (!companyData) {
                try {
                    await getCompanyByUser();
                } catch (error) {
                    console.error("Error loading company data:", error);
                    toast.error("Failed to load company information");
                }
            }
        };

        loadCompanyData();
    }, [companyData, getCompanyByUser]);


    // Load drafts from database when FormBuilder mounts (only for new forms, not edit mode)
    useEffect(() => {
        const loadDrafts = async () => {
            // Don't load drafts if we're in edit mode (workPermitId exists)
            if (workPermitId) return;
            
            try {
                await getAllDrafts();
                // Don't auto-load any draft - start with clean template
                // User can manually open drafts from the drafts modal
            } catch (error) {
                console.error("Error loading drafts:", error);
                toast.error("Failed to load drafts");
            }
        };

        loadDrafts();
    }, [getAllDrafts, workPermitId, sectionsTemplate]);

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
                const savedDraft = await createOrUpdateDraft(draftData, companyData.id, true); // Auto-save overwrites current draft
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

    const createNewDraft = async () => {
        if (!companyData?.id) {
            toast.error("Company information is required to create a draft");
            return;
        }

        // Set flag to prevent auto-save conflicts
        setIsCreatingNewForm(true);
        
        // Clear current draft ID to prevent auto-save from overwriting
        setCurrentDraftId(null);

        // Start with template that includes all sections and components
        const templateForm = {
            title: title || "GENERAL WORK PERMIT",
            sections: PTW_SECTION_TEMPLATES || PTW_SECTIONS.map((section) => ({
                id: section.id,
                title: section.title,
                enabled: true,
                components: [],
            })),
            selectedSection: "work-description",
        };
        
        setFormData(templateForm);
        setDeclarationChecks({});
        
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
            const savedDraft = await createOrUpdateDraft(draftData, companyData.id, true); // Auto-save (over draft)
            setCurrentDraftId(savedDraft.id);
            toast.success("New form created with template");
        } catch (error) {
            console.error("Error creating new draft:", error);
            toast.error("Failed to create new draft");
        } finally {
            // Reset flag after a short delay to allow form data to settle
            setTimeout(() => {
                setIsCreatingNewForm(false);
            }, 1000);
        }
    };

    const loadDraft = async (id) => {
        try {
            console.log("Loading draft with ID:", id);
            
            // Set flag to prevent auto-save conflicts
            setIsCreatingNewForm(true);
            
            const draft = await getDraftById(id);
            console.log("Draft data received:", draft);
            
            if (!draft) {
                console.log("No draft found");
                return;
            }
            
            setCurrentDraftId(id);
            
            // Load the actual draft data with proper structure mapping
            const convertedFormData = {
                title: draft.title || "GENERAL WORK PERMIT",
                sections: draft.sections.map(section => {
                    // Find the corresponding section from PTW_SECTIONS to get the correct ID
                    const baseSection = PTW_SECTIONS.find(s => s.title === section.title) || { id: section.title.toLowerCase().replace(/\s+/g, '-') };
                    
                    return {
                        id: baseSection.id,
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
                    };
                }),
                selectedSection: draft.sections[0] ? 
                    (PTW_SECTIONS.find(s => s.title === draft.sections[0].title)?.id || "work-description") : 
                    "work-description"
            };
            
            console.log("Converted form data:", convertedFormData);
            setFormData(convertedFormData);
            setDeclarationChecks({}); // Reset declaration checks
            toast.success("Draft loaded with saved data");
            setShowDraftsModal(false);
            
            // Reset flag after a short delay to allow form data to settle
            setTimeout(() => {
                setIsCreatingNewForm(false);
            }, 1000);
        } catch (error) {
            console.error("Error loading draft:", error);
            toast.error("Failed to load draft");
            setIsCreatingNewForm(false);
        }
    };

    const deleteDraftById = async (id) => {
        try {
            await deleteDraft(id);
            if (id === currentDraftId) {
                setCurrentDraftId(null);
                // Load the latest remaining draft if any
                if (drafts.length > 1) {
                    const remainingDrafts = drafts.filter(d => d.id !== id);
                    if (remainingDrafts.length > 0) {
                        await loadDraft(remainingDrafts[0].id);
                    }
                }
            }
            toast.success("Draft deleted");
        } catch (error) {
            console.error("Error deleting draft:", error);
            toast.error("Failed to delete draft");
        }
    };

    const duplicateForm = async () => {
        if (!currentDraftId) {
            toast.error("No draft to duplicate");
            return;
        }

        try {
            const duplicatedDraft = await duplicateDraft(currentDraftId);
            setCurrentDraftId(duplicatedDraft.id);
            
            // Convert duplicated draft to formData format
            const convertedFormData = {
                title: duplicatedDraft.title,
                sections: duplicatedDraft.sections.map(section => ({
                    id: section.id,
                    title: section.title,
                    enabled: section.enabled,
                    components: section.components.map(component => ({
                        id: component.id,
                        label: component.label,
                        type: component.type,
                        required: component.required,
                        enabled: component.enabled,
                        options: component.options || []
                    }))
                })),
                selectedSection: duplicatedDraft.sections[0]?.id || "work-description"
            };
            
            setFormData(convertedFormData);
            setDeclarationChecks({});
            toast.success("Form duplicated");
        } catch (error) {
            console.error("Error duplicating form:", error);
            toast.error("Failed to duplicate form");
        }
    };

    const getDeclarationComponents = () => {
        const sec = formData.sections.find((s) => s.id === "declaration");
        return (sec?.components || []).filter((c) => c.enabled !== false);
    };

    const initDeclarationChecks = () => {
        const comps = getDeclarationComponents();
        const next = { ...declarationChecks };
        comps.forEach((c) => {
            if (typeof next[c.id] !== "boolean") next[c.id] = false;
        });
        // prune removed
        Object.keys(next).forEach((key) => {
            if (!comps.find((c) => c.id === key)) delete next[key];
        });
        setDeclarationChecks(next);
    };

    const validateDeclaration = () => {
        const comps = getDeclarationComponents();
        const missing = comps.filter((c) => c.required && !declarationChecks[c.id]);
        if (missing.length > 0) {
            alert("Please agree to all mandatory declaration items before creating the form.");
            return false;
        }
        return true;
    };

    const submitForm = async () => {
        if (!validateDeclaration()) return;
        
        if (isGetCompany) {
            toast.error("Please wait while company information is being loaded...");
            return;
        }
        
        if (!companyData?.id) {
            toast.error("Company information is required. Please create a company first.");
            navigate({ to: "/company/" });
            return;
        }

        try {
            // Map unsupported component types to supported ones
            const mapComponentType = (type) => {
                const typeMapping = {
                    'signature': 'text',  // Map signature to text field
                    'table': 'textarea',  // Map table to textarea
                    'header': 'text',     // Map header to text field
                    'logo': 'text'        // Map logo to text field
                };
                return typeMapping[type] || type;
            };

            // Ensure unique labels within each section
            const ensureUniqueLabels = (sections) => {
                return sections.map(section => ({
                    ...section,
                    components: section.components.map((component, index) => {
                        // Check if this label already exists in the same section
                        const duplicateCount = section.components
                            .slice(0, index)
                            .filter(comp => comp.label === component.label).length;
                        
                        // If duplicate found, append a number to make it unique
                        const uniqueLabel = duplicateCount > 0 
                            ? `${component.label} (${duplicateCount + 1})`
                            : component.label;
                        
                        return {
                            ...component,
                            label: uniqueLabel
                        };
                    })
                }));
            };

            const payload = {
                title: formData.title,
                sections: ensureUniqueLabels(formData.sections).map(section => ({
                    title: section.title,
                    enabled: section.enabled,
                    components: section.components.map(component => ({
                        label: component.label,
                        type: mapComponentType(component.type),
                        required: component.required,
                        enabled: component.enabled,
                        options: component.options || []
                    }))
                }))
            };

            console.log("Submitting work permit with payload:", payload);

            if (workPermitId) {
                // Update existing work permit
                await updateWorkPermit(payload, companyData.id, workPermitId);
                toast.success("Work permit form updated successfully!");
            } else {
                // Create new work permit
                await createWorkPermit(payload, companyData.id);
                toast.success("Work permit form created successfully!");
            }

            clearDraft();
            setShowAgreeModal(false);
            
            // Navigate to work permits list
            setTimeout(() => {
                navigate({ to: "/page/app/work-permits" });
            }, 1000);

        } catch (error) {
            console.error("Error submitting form:", error);
            toast.error("Failed to submit form. Please try again.");
        }
    };

    const sectionIcons = {
        "work-description": FileText,
        "tools-equipment": Settings,
        ppe: Shield,
        "hazard-identification": AlertTriangle,
        ssow: CheckCircle,
        lmra: Clock,
        declaration: UserCheck,
        "opening-ptw": FileCheck,
        closure: FileCheck,
    };

    const reorderArray = (arr, from, to) => {
        const copy = [...arr];
        const [removed] = copy.splice(from, 1);
        copy.splice(to, 0, removed);
        return copy;
    };

    const handleDrop = (e, sectionId) => {
        e.preventDefault();
        setDragOver(false);
        const componentType = e.dataTransfer.getData("componentType");
        if (componentType) {
            addComponent(sectionId, componentType);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragOver(false);
    };

    const addComponent = (sectionId, componentType) => {
        const newSections = formData.sections.map((section) => {
            if (section.id === sectionId) {
                const getDefaultLabel = (type) => {
                    switch (type) {
                        case "text":
                            return "Text Field";
                        case "textarea":
                            return "Description";
                        case "date":
                            return "Date";
                        case "time":
                            return "Time";
                        case "checkbox":
                            return "Checklist";
                        case "radio":
                            return "Selection";
                        case "signature":
                            return "Signature";
                        case "table":
                            return "Table";
                        default:
                            return "Field";
                    }
                };

                const newComponent = {
                    id: generateId(),
                    type: componentType,
                    label: getDefaultLabel(componentType),
                    required: false,
                    enabled: true,
                    options:
                        componentType === "radio" ||
                        componentType === "checkbox"
                            ? ["Yes", "No", "N/A"]
                            : [],
                    value: "",
                };
                return {
                    ...section,
                    components: [...section.components, newComponent],
                };
            }
            return section;
        });
        setFormData({ ...formData, sections: newSections });
        toast.success(
            `Added ${componentType} to ${getSectionTitle(sectionId)}`,
        );
    };

    const updateComponent = (sectionId, componentId, updates) => {
        const newSections = formData.sections.map((section) => {
            if (section.id === sectionId) {
                return {
                    ...section,
                    components: section.components.map((component) =>
                        component.id === componentId
                            ? { ...component, ...updates }
                            : component,
                    ),
                };
            }
            return section;
        });
        setFormData({ ...formData, sections: newSections });
    };

    const deleteComponent = (sectionId, componentId) => {
        const newSections = formData.sections.map((section) => {
            if (section.id === sectionId) {
                return {
                    ...section,
                    components: section.components.filter(
                        (component) => component.id !== componentId,
                    ),
                };
            }
            return section;
        });
        setFormData({ ...formData, sections: newSections });
        toast.success("Component deleted");
    };

    const getSectionTitle = (sectionId) => {
        const inForm = formData.sections.find((s) => s.id === sectionId);
        if (inForm && typeof inForm.title === "string" && inForm.title.trim() !== "") {
            return inForm.title;
        }
        const base = PTW_SECTIONS.find((s) => s.id === sectionId);
        return base ? base.title : sectionId;
    };

    const selectedSectionData = formData.sections.find(
        (s) => s.id === formData.selectedSection,
    );

    // Show loading state while company data is being fetched
    if (isGetCompany && !companyData) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading company information...</p>
                </div>
            </div>
        );
    }

    // Show message if no company exists (after loading is complete)
    if (!isGetCompany && !companyData) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="text-center max-w-md">
                    <div className="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Company Required</h2>
                    <p className="text-gray-600 mb-4">You need to create a company before you can create work permit forms.</p>
                    <button
                        onClick={() => navigate({ to: "/company/" })}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                    >
                        Create Company
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="ptw-form-builder flex h-screen bg-gray-50">
            {/* Sidebar - Permit Sections */}
            {!showPrintView && (
                <>
                    {/* Mobile Overlay */}
                    {isMobile && !sidebarCollapsed && (
                        <div 
                            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                            onClick={() => setSidebarCollapsed(true)}
                        />
                    )}
                    
                    {/* Sidebar */}
                    <div className={cn(
                        "no-print bg-white text-gray-900 flex flex-col border-r transition-all duration-300 ease-in-out",
                        // Mobile: Fixed positioning with overlay
                        isMobile && !sidebarCollapsed && "fixed left-0 top-0 h-full w-80 z-50 shadow-lg",
                        // Mobile: Hidden when collapsed
                        isMobile && sidebarCollapsed && "hidden",
                        // Small screens: Narrower sidebar
                        !isMobile && sidebarCollapsed && "w-16",
                        !isMobile && !sidebarCollapsed && "w-64 lg:w-80"
                    )}>
                        {/* Sidebar Header with Toggle */}
                        <div className="flex items-center justify-between p-3 md:p-4 border-b">
                            {!sidebarCollapsed && (
                                <h3 className="text-lg font-semibold text-gray-800">Dashboard</h3>
                            )}
                            <button
                                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                {sidebarCollapsed ? (
                                    <Menu className="w-5 h-5 text-gray-600" />
                                ) : (
                                    <X className="w-5 h-5 text-gray-600" />
                                )}
                            </button>
                        </div>

                {/* Navigation */}
                <div className="flex-1 p-3 md:p-4 overflow-y-auto">
                    <nav className="space-y-2">
                        {!sidebarCollapsed && (
                        <div className="text-sm text-gray-600 uppercase tracking-wider mb-4">
                            Permit Sections
                                <div className="text-xs text-gray-500 mt-1 font-normal hidden md:block">
                                Drag to reorder sections
                            </div>
                        </div>
                        )}

                        <ReorderableList
                            items={formData.sections}
                            getId={(s) => s.id}
                            onReorder={(from, to) => {
                                const newSections = reorderArray(
                                    formData.sections,
                                    from,
                                    to,
                                );
                                setFormData({
                                    ...formData,
                                    sections: newSections,
                                });
                                toast.success("Sections reordered");
                            }}
                            className="space-y-2"
                            renderItem={(section, index) => {
                                const Icon =
                                    sectionIcons[section.id] || FileText;
                                const isSelected =
                                    formData.selectedSection === section.id;
                                const isEnabled =
                                    section.enabled !== false &&
                                    section.components.some((c) => c.enabled);

                                return (
                                    <div
                                        key={section.id}
                                        className={cn(
                                            "flex items-center rounded-lg cursor-pointer transition-colors border",
                                            sidebarCollapsed ? "p-2 justify-center" : "p-2 md:p-3",
                                            isSelected
                                                ? "bg-gray-100 text-gray-900 border-gray-200"
                                                : "text-gray-700 hover:bg-gray-50 border-transparent",
                                        )}
                                        onClick={() => {
                                            setFormData({
                                                ...formData,
                                                selectedSection: section.id,
                                            });
                                            if (section.id === "declaration") {
                                                initDeclarationChecks();
                                                setShowAgreeModal(true);
                                            }
                                            // Auto-close sidebar on mobile after selection
                                            if (isMobile) {
                                                setSidebarCollapsed(true);
                                            }
                                        }}
                                        title={sidebarCollapsed ? getSectionTitle(section.id) : ""}
                                    >
                                        {!sidebarCollapsed && (
                                            <GripVertical className="w-4 h-4 text-gray-400 mr-2 hidden md:block" />
                                        )}
                                        <Icon className={cn(
                                            "text-gray-600",
                                            sidebarCollapsed ? "w-5 h-5" : "w-5 h-5 mr-3"
                                        )} />
                                        {!sidebarCollapsed && (
                                            <>
                                        {isSelected ? (
                                            <input
                                                className="flex-1 bg-transparent outline-none text-sm"
                                                value={getSectionTitle(section.id)}
                                                onChange={(e) => {
                                                    const newSections = formData.sections.map((s) =>
                                                        s.id === section.id
                                                            ? { ...s, title: e.target.value }
                                                            : s,
                                                    );
                                                    setFormData({ ...formData, sections: newSections });
                                                }}
                                            />
                                        ) : (
                                                    <span className="flex-1 text-sm md:text-base">
                                                {getSectionTitle(section.id)}
                                            </span>
                                        )}
                                        <div className="flex items-center space-x-2">
                                            {isEnabled && (
                                                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                            )}
                                        </div>
                                            </>
                                        )}
                                    </div>
                                );
                            }}
                        />
                    </nav>

                    {!sidebarCollapsed && (
                        <div className="mt-4 md:mt-6">
                        <Button
                                className="w-full bg-gray-800 hover:bg-gray-700 text-white text-sm md:text-base"
                            onClick={() => {
                                const newSectionId = generateId();
                                const newSection = {
                                    id: newSectionId,
                                    title: "New Section",
                                    enabled: true,
                                    components: [],
                                };
                                const newSections = [...formData.sections, newSection];
                                setFormData({
                                    ...formData,
                                    sections: newSections,
                                    selectedSection: newSectionId,
                                });
                                toast.success("New section added");
                                    // Auto-close sidebar on mobile after adding
                                    if (isMobile) {
                                        setSidebarCollapsed(true);
                                    }
                            }}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                                <span className="hidden sm:inline">Add New Form</span>
                                <span className="sm:hidden">Add Form</span>
                        </Button>
                    </div>
                    )}
                </div>
            </div>
                </>
            )}

            {/* Main Content Area */}
            <div className={cn(
                "flex-1 flex flex-col transition-all duration-300 ease-in-out",
                // Adjust margin on mobile when sidebar is open
                isMobile && !sidebarCollapsed && "ml-0",
                // Adjust margin on desktop when sidebar is collapsed
                !isMobile && sidebarCollapsed && "ml-0"
            )}>
                {/* Top Header (visible on screen in both modes, hidden when printing) */}
                <div className="no-print bg-gray-100 border-b border-gray-200 px-4 md:px-6 py-3 md:py-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div className="flex items-center min-w-0">
                            {/* Show sidebar toggle on small screens when sidebar is collapsed */}
                            {sidebarCollapsed && (
                                <button
                                    onClick={() => setSidebarCollapsed(false)}
                                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors mr-2"
                                    title="Show Sections"
                                >
                                    <Menu className="w-5 h-5 text-gray-600" />
                                </button>
                            )}
                            <Flame className="w-6 h-6 text-orange-500 mr-3" />
                            <h2 className="text-lg md:text-xl font-semibold text-gray-800 truncate">
                                {formData.title}
                            </h2>
                            {isAutoSaving && (
                                <div className="ml-3 flex items-center text-xs text-blue-600">
                                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-1"></div>
                                    Auto-saving...
                                </div>
                            )}
                            {!isAutoSaving && lastSavedTime && (
                                <div className="ml-3 text-xs text-gray-500">
                                    Saved {lastSavedTime.toLocaleTimeString()}
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-2 md:gap-3 flex-wrap justify-end overflow-x-auto">
                            {/* Open declaration modal on submit instead of inline checkboxes */}
                            <Button
                                variant="outline"
                                size="sm"
                                className="rounded-full shadow-sm"
                                onClick={() => {
                                    setFormData({
                                        title: title || "GENERAL WORK PERMIT",
                                        sections: PTW_SECTIONS.map((section) => ({
                                            id: section.id,
                                            title: section.title,
                                            enabled: true,
                                            components: [],
                                        })),
                                        selectedSection: "work-description",
                                    });
                                    toast.success("Form reset to empty state");
                                }}
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Reset Form
                            </Button>
                            <Button size="sm" className="rounded-full shadow-sm" onClick={() => toast.success("Draft saved") }>
                                <Save className="w-4 h-4 mr-2" />
                                <span className="hidden sm:inline">Save</span>
                                {isAutoSaving && (
                                    <div className="ml-2 flex items-center">
                                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                                    </div>
                                )}
                            </Button>
                            <Button size="sm" className="rounded-full shadow-sm bg-blue-600 hover:bg-blue-700 text-white" onClick={() => { initDeclarationChecks(); setShowAgreeModal(true); }}>
                                <FileCheck className="w-4 h-4 mr-2" />
                                <span className="hidden sm:inline">Submit</span>
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="rounded-full shadow-sm"
                                onClick={() => setShowDraftsModal(true)}
                            >
                                <span className="hidden sm:inline">Drafts</span>
                                <span className="sm:hidden">Drfts</span>
                            </Button>
                            <Button size="sm" className="rounded-full shadow-sm" onClick={createNewDraft}>
                                <Plus className="w-4 h-4 mr-2" />
                                <span className="hidden sm:inline">New Form</span>
                                <span className="sm:hidden">New</span>
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="rounded-full shadow-sm"
                                onClick={() => {
                                    setFormData({
                                        title: title || "GENERAL WORK PERMIT",
                                        sections:
                                            sectionsTemplate ||
                                            PTW_SECTION_TEMPLATES,
                                        selectedSection: "work-description",
                                    });
                                    toast.success("Loaded predefined template");
                                }}
                            >
                                <FileText className="w-4 h-4 mr-2" />
                                <span className="hidden sm:inline">Load Template</span>
                                <span className="sm:hidden">Template</span>
                            </Button>
                            {/* Duplicate action will be shown on the list page, not here */}
                            <Button
                                variant="outline"
                                size="sm"
                                className="rounded-full shadow-sm"
                                onClick={() => setShowPrintView(!showPrintView)}
                            >
                                <Printer className="w-4 h-4 mr-2" />
                                <span className="hidden sm:inline">{showPrintView ? "Builder" : "Print View"}</span>
                                <span className="sm:hidden">{showPrintView ? "Build" : "Print"}</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="rounded-full" onClick={clearDraft}>
                                <span className="hidden sm:inline">Clear Draft</span>
                                <span className="sm:hidden">Clear</span>
                            </Button>
                            {/* Debug button - only show in development */}
                            {process.env.NODE_ENV === 'development' && (
                                <Button variant="ghost" size="sm" className="rounded-full text-xs" onClick={testAutoSave}>
                                    Debug
                                </Button>
                            )}
                            {showPrintView && (
                                <Button
                                    size="sm"
                                    className="rounded-full shadow-sm"
                                    onClick={() => window.print()}
                                >
                                    <Printer className="w-4 h-4 mr-2" />
                                    <span className="hidden sm:inline">Print</span>
                                </Button>
                            )}
                            {showPrintView && (
                                <div className="text-sm text-gray-600">
                                    {
                                        formData.sections.filter(
                                            (s) =>
                                                s.enabled !== false &&
                                                s.components.some(
                                                    (c) => c.enabled,
                                                ),
                                        ).length
                                    }{" "}
                                    sections,{" "}
                                    {formData.sections.reduce(
                                        (total, section) =>
                                            total +
                                            section.components.filter(
                                                (c) => c.enabled,
                                            ).length,
                                        0,
                                    )}{" "}
                                    fields enabled
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            

                {/* Main Content */}
                {showPrintView ? (
                <div className="flex-1 overflow-auto bg-gray-50">
                    <div className="ptw-preview-wrap">
                        <PrintView 
                            formData={formData} 
                            customSectionNames={{
                                'work-description': 'Work Description',
                                'tools-equipment': 'Tools & Equipment',
                                'ppe-checklist': 'PPE Checklist',
                                'hazard-identification': 'Hazard Identification',
                                'safe-system-work': 'Safe System of Work',
                                'last-minute-risk': 'Last Minute Risk Assessment',
                                'declaration': 'Declaration',
                                'opening-ptw': 'Opening PTW',
                                'closure': 'Closure'
                            }}
                        />
                    </div>
                    </div>
                ) : (
                <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                    {/* Agreement Modal */}
                    {showAgreeModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                            <div className="bg-white rounded-md shadow-lg w-full max-w-md p-6">
                                <h4 className="text-lg font-semibold mb-3">Declaration</h4>
                                <p className="text-sm text-gray-600 mb-3">Please confirm all declaration items. Items marked Mandatory must be checked.</p>
                                <div className="space-y-3 max-h-[60vh] overflow-y-auto mb-4">
                                    {getDeclarationComponents().map((c) => (
                                        <label key={c.id} className="text-sm inline-flex items-start space-x-2">
                                            <input
                                                type="checkbox"
                                                checked={!!declarationChecks[c.id]}
                                                onChange={(e) =>
                                                    setDeclarationChecks((prev) => ({
                                                        ...prev,
                                                        [c.id]: e.target.checked,
                                                    }))
                                                }
                                            />
                                            <span>
                                                {c.label}
                                                {c.required ? <span className="text-red-500 ml-1">(Mandatory)</span> : null}
                                            </span>
                                        </label>
                                        ))}
                                        {getDeclarationComponents().length === 0 && (
                                            <div className="text-xs text-gray-500">No declaration items configured in this section.</div>
                                    )}
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        {isAutoSaving && (
                                            <div className="flex items-center text-xs text-blue-500">
                                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-500 mr-1"></div>
                                                Auto-saving...
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Button variant="outline" size="sm" onClick={() => setShowAgreeModal(false)}>Cancel</Button>
                                        <Button 
                                            size="sm" 
                                            onClick={submitForm}
                                            disabled={isCreating || isUpdating}
                                        >
                                            {isCreating || isUpdating ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                    {workPermitId ? "Updating..." : "Creating..."}
                                                </>
                                            ) : (
                                                "Confirm & Submit"
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Drafts Modal */}
                    {showDraftsModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                            <div className="bg-white rounded-md shadow-lg w-full max-w-2xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h4 className="text-lg font-semibold">My Drafts</h4>
                                        <p className="text-sm text-gray-600">Open a draft to start creating a new form</p>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={() => setShowDraftsModal(false)}>Close</Button>
                                </div>
                                <div className="max-h-[60vh] overflow-y-auto divide-y">
                                    {drafts.map((draft) => (
                                        <div key={draft.id} className="py-4 flex items-center justify-between hover:bg-gray-50 rounded-lg p-3">
                                            <div className="flex-1">
                                                <div className="font-medium text-gray-900">{draft.title || "Untitled Draft"}</div>
                                                <div className="text-sm text-gray-500 mt-1">
                                                    Last updated: {new Date(draft.updatedAt).toLocaleDateString()} at {new Date(draft.updatedAt).toLocaleTimeString()}
                                                </div>
                                                <div className="text-xs text-gray-400 mt-1">
                                                    {draft.isAutoSave ? "Auto-saved draft" : "Manual draft"}
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Button 
                                                    variant="outline" 
                                                    size="sm" 
                                                    onClick={() => loadDraft(draft.id)}
                                                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                                >
                                                    Open
                                                </Button>
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm" 
                                                    onClick={() => deleteDraftById(draft.id)}
                                                    className="text-red-600 hover:bg-red-50"
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                    {drafts.length === 0 && (
                                        <div className="text-center py-8">
                                            <div className="text-gray-400 mb-2">📝</div>
                                            <div className="text-sm text-gray-500">No drafts yet.</div>
                                            <div className="text-xs text-gray-400 mt-1">Create your first draft by clicking "New Form"</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                        {/* Left Panel - Section Details */}
                        <div className="flex-1 lg:basis-3/4 min-w-0 p-4 md:p-6 lg:border-r border-gray-200 overflow-y-auto min-h-0">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    {getSectionTitle(formData.selectedSection)}
                                </h3>
                                <div className="flex items-center space-x-3">
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={
                                                selectedSectionData?.enabled !==
                                                false
                                            }
                                            onChange={(e) => {
                                                const newSections =
                                                    formData.sections.map(
                                                        (section) =>
                                                            section.id ===
                                                            formData.selectedSection
                                                                ? {
                                                                      ...section,
                                                                      enabled:
                                                                          e
                                                                              .target
                                                                              .checked,
                                                                  }
                                                                : section,
                                                    );
                                                setFormData({
                                                    ...formData,
                                                    sections: newSections,
                                                });
                                            }}
                                            className="rounded"
                                        />
                                        <span className="text-sm text-gray-600">
                                            Enable Section
                                        </span>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            const newSections =
                                                formData.sections.map(
                                                    (section) =>
                                                        section.id ===
                                                        formData.selectedSection
                                                            ? {
                                                                  ...section,
                                                                  components:
                                                                      [],
                                                              }
                                                            : section,
                                                );
                                            setFormData({
                                                ...formData,
                                                sections: newSections,
                                            });
                                            toast.success(
                                                "All components deleted from section",
                                            );
                                        }}
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete All
                                    </Button>
                                </div>
                            </div>

                            <div
                                className={cn(
                                    "space-y-4 min-h-32 border-2 border-dashed rounded-lg p-4 transition-colors",
                                    dragOver
                                        ? "border-blue-500 bg-blue-50"
                                        : "border-gray-300",
                                )}
                                onDrop={(e) =>
                                    handleDrop(e, formData.selectedSection)
                                }
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                            >
                                {selectedSectionData?.components.length ===
                                0 ? (
                                    <div className="text-center py-12 text-gray-500">
                                        <div className="text-2xl mb-4">📝</div>
                                        <div className="text-lg mb-2 font-medium">
                                            No components yet
                                        </div>
                                        <div className="text-sm mb-4">
                                            Drag components from the palette or
                                            use the buttons below
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            Tip: Start by adding a text field or
                                            checkbox
                                        </div>
                                    </div>
                                ) : (
                                    <ReorderableList
                                        items={
                                            selectedSectionData?.components ||
                                            []
                                        }
                                        getId={(c) => c.id}
                                        onReorder={(from, to) => {
                                            const newSections =
                                                formData.sections.map(
                                                    (section) => {
                                                        if (
                                                            section.id !==
                                                            formData.selectedSection
                                                        )
                                                            return section;
                                                        const comps = [
                                                            ...section.components,
                                                        ];
                                                        const [r] =
                                                            comps.splice(
                                                                from,
                                                                1,
                                                            );
                                                        comps.splice(to, 0, r);
                                                        return {
                                                            ...section,
                                                            components: comps,
                                                        };
                                                    },
                                                );
                                            setFormData({
                                                ...formData,
                                                sections: newSections,
                                            });
                                        }}
                                        renderItem={(component, index) => (
                                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                                                <div className="flex items-center justify-between mb-3">
                                                    <GripVertical className="w-4 h-4 text-gray-400" />
                                                    <div className="flex items-center space-x-2">
                                                        <input
                                                            type="checkbox"
                                                            checked={
                                                                component.enabled
                                                            }
                                                            onChange={(e) =>
                                                                updateComponent(
                                                                    formData.selectedSection,
                                                                    component.id,
                                                                    {
                                                                        enabled:
                                                                            e
                                                                                .target
                                                                                .checked,
                                                                    },
                                                                )
                                                            }
                                                            className="rounded"
                                                        />
                                                        <span className="text-sm text-gray-600">
                                                            Enable
                                                        </span>
                                                        <input
                                                            type="checkbox"
                                                            checked={
                                                                component.required
                                                            }
                                                            onChange={(e) =>
                                                                updateComponent(
                                                                    formData.selectedSection,
                                                                    component.id,
                                                                    {
                                                                        required:
                                                                            e
                                                                                .target
                                                                                .checked,
                                                                    },
                                                                )
                                                            }
                                                            className="rounded"
                                                        />
                                                        <span className="text-sm text-gray-600">
                                                            Mandatory
                                                        </span>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                setEditingComponent(
                                                                    component.id,
                                                                )
                                                            }
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                deleteComponent(
                                                                    formData.selectedSection,
                                                                    component.id,
                                                                )
                                                            }
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    <Input
                                                        value={component.label}
                                                        onChange={(e) =>
                                                            updateComponent(
                                                                formData.selectedSection,
                                                                component.id,
                                                                {
                                                                    label: e
                                                                        .target
                                                                        .value,
                                                                },
                                                            )
                                                        }
                                                        placeholder="Question label"
                                                        className="font-medium"
                                                    />

                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-sm text-gray-600">
                                                            Response Type:
                                                        </span>
                                                        <select
                                                            value={
                                                                component.type
                                                            }
                                                            onChange={(e) => {
                                                                const newType = e.target.value;
                                                                const updates = { type: newType };
                                                                if (newType === "radio") {
                                                                    updates.options = ["Yes", "No", "N/A"];
                                                                } else if (newType === "checkbox") {
                                                                    updates.options = ["Option 1", "Option 2", "Option 3"];
                                                                }
                                                                updateComponent(
                                                                    formData.selectedSection,
                                                                    component.id,
                                                                    updates,
                                                                );
                                                            }}
                                                            className="border border-gray-300 rounded px-2 py-1 text-sm"
                                                        >
                                                            <option value="text">
                                                                Text
                                                            </option>
                                                            <option value="textarea">
                                                                Text Area
                                                            </option>
                                                            <option value="checkbox">
                                                                Checkbox
                                                            </option>
                                                            <option value="radio">
                                                                Yes No N/A
                                                            </option>
                                                            <option value="date">
                                                                Date
                                                            </option>
                                                            <option value="time">
                                                                Time
                                                            </option>
                                                        </select>
                                                    </div>

                                                    {(component.type ===
                                                        "radio" ||
                                                        component.type ===
                                                            "checkbox") && (
                                                        <div className="space-y-2">
                                                            {(Array.isArray(component.options) ? component.options : []).map(
                                                                (
                                                                    option,
                                                                    optionIndex,
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            optionIndex
                                                                        }
                                                                        className="flex items-center space-x-2"
                                                                    >
                                                                        <Input
                                                                            value={
                                                                                option
                                                                            }
                                                                            onChange={(
                                                                                e,
                                                                            ) => {
                                                                                const newOptions =
                                                                                    [
                                                                                        ...component.options,
                                                                                    ];
                                                                                newOptions[
                                                                                    optionIndex
                                                                                ] =
                                                                                    e.target.value;
                                                                                updateComponent(
                                                                                    formData.selectedSection,
                                                                                    component.id,
                                                                                    {
                                                                                        options:
                                                                                            newOptions,
                                                                                    },
                                                                                );
                                                                            }}
                                                                            className="text-sm"
                                                                        />
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() => {
                                                                                const newOptions =
                                                                                    component.options.filter(
                                                                                        (
                                                                                            _,
                                                                                            i,
                                                                                        ) =>
                                                                                            i !==
                                                                                            optionIndex,
                                                                                    );
                                                                                updateComponent(
                                                                                    formData.selectedSection,
                                                                                    component.id,
                                                                                    {
                                                                                        options:
                                                                                            newOptions,
                                                                                    },
                                                                                );
                                                                            }}
                                                                        >
                                                                            <Trash2 className="w-3 h-3" />
                                                                        </Button>
                                                                    </div>
                                                                ),
                                                            )}
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => {
                                                                    const newOptions =
                                                                        Array.isArray(component.options)
                                                                            ? [
                                                                                  ...component.options,
                                                                                  "New Option",
                                                                              ]
                                                                            : ["New Option"];
                                                                    updateComponent(
                                                                        formData.selectedSection,
                                                                        component.id,
                                                                        {
                                                                            options:
                                                                                newOptions,
                                                                        },
                                                                    );
                                                                }}
                                                            >
                                                                <Plus className="w-3 h-3 mr-1" />
                                                                Add Option
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    />
                                )}
                            </div>

                            <div className="mt-6 space-y-3">
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => {
                                        const newComponent = {
                                            id: generateId(),
                                            type: "text",
                                            label: "New Field",
                                            required: false,
                                            enabled: true,
                                            options: [],
                                            value: "",
                                        };
                                        const newSections =
                                            formData.sections.map((section) =>
                                                section.id ===
                                                formData.selectedSection
                                                    ? {
                                                          ...section,
                                                          components: [
                                                              ...section.components,
                                                              newComponent,
                                                          ],
                                                      }
                                                    : section,
                                            );
                                        setFormData({
                                            ...formData,
                                            sections: newSections,
                                        });
                                        toast.success(
                                            "Added new field to section",
                                        );
                                    }}
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Field
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => {
                                        const newComponent = {
                                            id: generateId(),
                                            type: "radio",
                                            label: "New Question",
                                            required: false,
                                            enabled: true,
                                            options: ["Yes", "No", "N/A"],
                                            value: "",
                                        };
                                        const newSections =
                                            formData.sections.map((section) =>
                                                section.id ===
                                                formData.selectedSection
                                                    ? {
                                                          ...section,
                                                          components: [
                                                              ...section.components,
                                                              newComponent,
                                                          ],
                                                      }
                                                    : section,
                                            );
                                        setFormData({
                                            ...formData,
                                            sections: newSections,
                                        });
                                        toast.success(
                                            "Added new question to section",
                                        );
                                    }}
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Question
                                </Button>
                            </div>
                        </div>

                        {/* Right Panel - Component Palette */}
                        <div className="w-full lg:basis-1/4 lg:max-w-[420px] lg:min-w-[360px] p-4 md:p-6 overflow-y-auto border-t lg:border-t-0 border-gray-200 max-h-96 lg:max-h-none">
                            <div className="h-full">
                                <ComponentPalette />
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
        </div>
    );
};

export default FormBuilder;
