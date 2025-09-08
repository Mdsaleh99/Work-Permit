import React, { useState } from "react";
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
} from "lucide-react";
import ComponentPalette from "../drag-drop/ComponentPalette";
// DroppableSection no longer needed with pragmatic dnd
import PrintView from "./PrintView";
import { toast } from "react-hot-toast";
import { cn, generateId } from "../../lib/utils";
import { PTW_SECTIONS, PTW_SECTION_TEMPLATES } from "../../lib/constants";

const FormBuilder = () => {
    const [formData, setFormData] = useState({
        title: "GENERAL WORK PERMIT",
        sections: PTW_SECTIONS.map((section) => ({
            id: section.id,
            title: section.title,
            enabled: true,
            components: [],
        })),
        selectedSection: "work-description",
    });

    const [editingComponent, setEditingComponent] = useState(null);
    const [showPrintView, setShowPrintView] = useState(false);
    const [dragOver, setDragOver] = useState(false);

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
        const section = PTW_SECTIONS.find((s) => s.id === sectionId);
        return section ? section.title : sectionId;
    };

    const selectedSectionData = formData.sections.find(
        (s) => s.id === formData.selectedSection,
    );

    return (
        <div className="ptw-form-builder flex h-screen bg-gray-50">
            {/* Sidebar - Permit Sections */}
            <div className="no-print w-80 bg-blue-900 text-white flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-blue-800">
                    <h1 className="text-xl font-bold">Safetymint</h1>
                </div>

                {/* Navigation */}
                <div className="flex-1 p-4">
                    <nav className="space-y-2">
                        <div className="text-sm text-blue-300 uppercase tracking-wider mb-4">
                            Permit Sections
                            <div className="text-xs text-blue-400 mt-1 font-normal">
                                Drag to reorder sections
                            </div>
                        </div>

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
                                            "flex items-center p-3 rounded-lg cursor-pointer transition-colors",
                                            isSelected
                                                ? "bg-blue-700 text-white"
                                                : "text-blue-200 hover:bg-blue-800",
                                        )}
                                        onClick={() =>
                                            setFormData({
                                                ...formData,
                                                selectedSection: section.id,
                                            })
                                        }
                                    >
                                        <GripVertical className="w-4 h-4 text-blue-400 mr-2" />
                                        <Icon className="w-5 h-5 mr-3" />
                                        <span className="flex-1">
                                            {getSectionTitle(section.id)}
                                        </span>
                                        <div className="flex items-center space-x-2">
                                            {isEnabled && (
                                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                            )}
                                        </div>
                                    </div>
                                );
                            }}
                        />
                    </nav>

                    <div className="mt-6">
                        <Button className="w-full bg-blue-700 hover:bg-blue-600 text-white">
                            <Plus className="w-4 h-4 mr-2" />
                            Add New Form
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col">
                {/* Top Header */}
                <div className="no-print bg-gray-100 border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Flame className="w-6 h-6 text-orange-500 mr-3" />
                            <h2 className="text-xl font-semibold text-gray-800">
                                {formData.title}
                            </h2>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setFormData({
                                        title: "GENERAL WORK PERMIT",
                                        sections: PTW_SECTIONS.map(
                                            (section) => ({
                                                id: section.id,
                                                title: section.title,
                                                enabled: true,
                                                components: [],
                                            }),
                                        ),
                                        selectedSection: "work-description",
                                    });
                                    toast.success("Form reset to empty state");
                                }}
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Reset Form
                            </Button>
                            <Button size="sm">
                                <Save className="w-4 h-4 mr-2" />
                                Save
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setFormData({
                                        title: "GENERAL WORK PERMIT",
                                        sections: PTW_SECTION_TEMPLATES,
                                        selectedSection: "work-description",
                                    });
                                    toast.success("Loaded predefined template");
                                }}
                            >
                                <FileText className="w-4 h-4 mr-2" />
                                Load Template
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowPrintView(!showPrintView)}
                            >
                                <Printer className="w-4 h-4 mr-2" />
                                {showPrintView ? "Builder" : "Print View"}
                            </Button>
                            {showPrintView && (
                                <Button
                                    size="sm"
                                    onClick={() => window.print()}
                                >
                                    <Printer className="w-4 h-4 mr-2" />
                                    Print
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
                    <div className="flex-1 p-6">
                        <PrintView formData={formData} />
                    </div>
                ) : (
                    <div className="flex-1 flex">
                        {/* Left Panel - Section Details */}
                        <div className="w-1/2 p-6 border-r border-gray-200">
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
                                                            onChange={(e) =>
                                                                updateComponent(
                                                                    formData.selectedSection,
                                                                    component.id,
                                                                    {
                                                                        type: e
                                                                            .target
                                                                            .value,
                                                                    },
                                                                )
                                                            }
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
                                                            {component.options.map(
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
                                                                        [
                                                                            ...component.options,
                                                                            "New Option",
                                                                        ];
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
                        <div className="w-1/2 p-6">
                            <ComponentPalette />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FormBuilder;
