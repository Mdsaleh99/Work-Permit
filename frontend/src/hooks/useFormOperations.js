import { useState } from "react";
import { toast } from "sonner";
import { generateId } from "../lib/utils";
import { PTW_SECTIONS, PREDEFINED_COMPONENT_OPTIONS } from "../lib/constants";

/**
 * Custom hook for managing form operations
 */
export const useFormOperations = ({
    formData,
    setFormData,
    editingComponent,
    setEditingComponent,
    declarationChecks,
    setDeclarationChecks,
    showAgreeModal,
    setShowAgreeModal,
}) => {
    
    // Helper function to reorder arrays
    const reorderArray = (arr, from, to) => {
        const copy = [...arr];
        const [removed] = copy.splice(from, 1);
        copy.splice(to, 0, removed);
        return copy;
    };

    const getSectionTitle = (sectionId) => {
        const inForm = formData.sections.find((s) => s.id === sectionId);
        if (inForm && typeof inForm.title === "string" && inForm.title.trim() !== "") {
            return inForm.title;
        }
        const base = PTW_SECTIONS.find((s) => s.id === sectionId);
        return base ? base.title : sectionId;
    };
    
    const addComponentToSection = (sectionId, componentType) => {
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
                case "ppe-checklist":
                    return "PERSONAL PROTECTIVE EQUIPMENT (CROSS WITH AN X):";
                case "hazard-checklist":
                    return "HAZARD IDENTIFICATION (CROSS WITH AN X):";
                case "lmra-checklist":
                    return "LAST MINUTE RISK ASSESSMENT";
                case "signature":
                    return "Signature";
                case "table":
                    return "Table";
                case "header":
                    return "Header";
                case "logo":
                    return "Logo";
                default:
                    return "Field";
            }
        };

        const getDefaultOptions = (type) => {
            // Check for predefined component types first
            if (PREDEFINED_COMPONENT_OPTIONS[type]) {
                return PREDEFINED_COMPONENT_OPTIONS[type];
            }
            
            // Fallback to generic options
            switch (type) {
                case "radio":
                    return ["Yes", "No", "N/A"];
                case "checkbox":
                    return ["Option 1", "Option 2", "Option 3"];
                default:
                    return [];
            }
        };

        const newComponent = {
            id: generateId(),
            label: getDefaultLabel(componentType),
            type: componentType,
            required: false,
            enabled: true,
            options: getDefaultOptions(componentType),
            value: "",
        };

        setFormData(prev => ({
            ...prev,
            sections: prev.sections.map(section =>
                section.id === sectionId
                    ? {
                          ...section,
                          components: [...section.components, newComponent],
                      }
                    : section
            ),
        }));

        toast.success(`Added ${getDefaultLabel(componentType)} to ${getSectionTitle(sectionId)}`);
    };

    const updateComponent = (sectionId, componentId, updates) => {
        // If updating component type, set predefined options
        if (updates.type) {
            const getDefaultOptions = (type) => {
                // Check for predefined component types first
                if (PREDEFINED_COMPONENT_OPTIONS[type]) {
                    updates.options = PREDEFINED_COMPONENT_OPTIONS[type];
                    return;
                }
                
                // Fallback to generic options
                switch (type) {
                    case "radio":
                        updates.options = ["Yes", "No", "N/A"];
                        break;
                    case "checkbox":
                        updates.options = ["Option 1", "Option 2", "Option 3"];
                        break;
                    default:
                        updates.options = [];
                        break;
                }
            };
            getDefaultOptions(updates.type);
        }

        setFormData(prev => ({
            ...prev,
            sections: prev.sections.map(section =>
                section.id === sectionId
                    ? {
                          ...section,
                          components: section.components.map(component =>
                              component.id === componentId
                                  ? { ...component, ...updates }
                                  : component
                          ),
                      }
                    : section
            ),
        }));
    };

    const deleteComponent = (sectionId, componentId) => {
        setFormData(prev => ({
            ...prev,
            sections: prev.sections.map(section =>
                section.id === sectionId
                    ? {
                          ...section,
                          components: section.components.filter(component => component.id !== componentId),
                      }
                    : section
            ),
        }));
    };

    const toggleSectionEnabled = (sectionId) => {
        setFormData(prev => ({
            ...prev,
            sections: prev.sections.map(section =>
                section.id === sectionId
                    ? { ...section, enabled: !section.enabled }
                    : section
            ),
        }));
    };

    const updateSectionTitle = (sectionId, newTitle) => {
        setFormData(prev => ({
            ...prev,
            sections: prev.sections.map(section =>
                section.id === sectionId
                    ? { ...section, title: newTitle }
                    : section
            ),
        }));
    };

    const reorderSections = (from, to) => {
        const newSections = reorderArray(formData.sections, from, to);
        setFormData(prev => ({
            ...prev,
            sections: newSections,
        }));
    };

    const reorderComponents = (sectionId, from, to) => {
        const section = formData.sections.find(s => s.id === sectionId);
        if (!section) return;
        
        const newComponents = reorderArray(section.components, from, to);
        setFormData(prev => ({
            ...prev,
            sections: prev.sections.map(s =>
                s.id === sectionId
                    ? { ...s, components: newComponents }
                    : s
            ),
        }));
    };

    const initDeclarationChecks = () => {
        const checks = {};
        const declarationSection = formData.sections.find(section => section.id === "declaration");
        if (declarationSection) {
            declarationSection.components.forEach(component => {
                checks[component.id] = false;
            });
        }
        setDeclarationChecks(checks);
    };

    const getDeclarationComponents = () => {
        const declarationSection = formData.sections.find(section => section.id === "declaration");
        return declarationSection ? declarationSection.components : [];
    };

    const updateDeclarationCheck = (componentId, checked) => {
        setDeclarationChecks(prev => ({
            ...prev,
            [componentId]: checked,
        }));
    };

    const areAllDeclarationsChecked = () => {
        const declarationKeys = Object.keys(declarationChecks);
        return declarationKeys.length > 0 && declarationKeys.every(key => declarationChecks[key]);
    };

    const resetForm = () => {
        setFormData({
            title: "GENERAL WORK PERMIT",
            sections: [],
            selectedSection: "work-description",
        });
        setDeclarationChecks({});
        setEditingComponent(null);
        toast.success("Form reset successfully");
    };

    return {
        addComponentToSection,
        updateComponent,
        deleteComponent,
        toggleSectionEnabled,
        updateSectionTitle,
        reorderSections,
        reorderComponents,
        initDeclarationChecks,
        updateDeclarationCheck,
        areAllDeclarationsChecked,
        getDeclarationComponents,
        resetForm,
    };
};
