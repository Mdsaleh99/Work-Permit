import React from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Plus, GripVertical, Edit, Trash2, Menu, X, FileText, ClipboardList, Wrench, Shield, ShieldCheck, AlertTriangle, ListChecks } from "lucide-react";
import ReorderableList from "../drag-drop/ReorderableList";
import { cn } from "../../lib/utils";

/**
 * Sidebar component for the form builder
 */
const FormBuilderSidebar = ({
    sidebarCollapsed,
    setSidebarCollapsed,
    formData,
    setFormData,
    // editingComponent,
    // setEditingComponent,
    // onAddComponent,
    // onUpdateComponent,
    // onDeleteComponent,
    // onToggleSectionEnabled,
    onUpdateSectionTitle,
    onReorderSections,
    // onReorderComponents,
    onResetForm,
    onShowDraftsModal,
    onInitDeclarationChecks,
    onShowDeclarationModal,
    drafts,
    // onLoadDraft,
    // onDeleteDraft,
    // onDuplicateDraft,
    isMobile,
    isEditingMode,
}) => {
    // Removed drag and drop handlers

    // Map common section titles to icons
    const getSectionIcon = (title, className = "w-4 h-4 text-gray-600") => {
        const t = (title || "").toLowerCase();
        if (t.includes("work description")) return <ClipboardList className={className} />;
        if (t.includes("tools") || t.includes("equipment")) return <Wrench className={className} />;
        if (t.includes("ppe")) return <Shield className={className} />;
        if (t.includes("hazard")) return <AlertTriangle className={className} />;
        if (t.includes("safe system")) return <ShieldCheck className={className} />;
        if (t.includes("last minute") || t.includes("risk assessment")) return <ListChecks className={className} />;
        return <FileText className={className} />;
    };

    return (
        <div
            className={cn(
                "bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col",
                sidebarCollapsed ? "w-16" : "w-80",
                isMobile &&
                    !sidebarCollapsed &&
                    "fixed left-0 top-0 h-full w-80 z-50 shadow-lg",
                isMobile && sidebarCollapsed && "hidden",
                !isMobile && "h-full",
            )}
        >
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                    {!sidebarCollapsed && (
                        <>
                            <h3 className="text-lg font-semibold text-gray-800">
                                Permit Sections
                            </h3>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSidebarCollapsed(true)}
                                className="p-1"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </>
                    )}
                    {sidebarCollapsed && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSidebarCollapsed(false)}
                            className="p-1"
                        >
                            <Menu className="w-4 h-4" />
                        </Button>
                    )}
                </div>
            </div>

            {/* Sidebar Content */}
            {!sidebarCollapsed && (
                <>
                    {/* Fixed Header with Buttons */}
                    <div className="p-4 flex-shrink-0">
                        <div className="space-y-4">
                            {/* Add New Form Button */}
                            <Button
                                size="sm"
                                className="w-full rounded-full cursor-pointer shadow-sm"
                                onClick={onResetForm}
                                disabled={Boolean(isEditingMode)}
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add New Form
                            </Button>

                            {/* Drafts Button */}
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full cursor-pointer rounded-full shadow-sm"
                                onClick={onShowDraftsModal}
                                disabled={Boolean(isEditingMode)}
                            >
                                <Edit className="w-4 h-4 mr-2" />
                                My Drafts ({drafts?.length || 0})
                            </Button>
                        </div>
                    </div>

                    {/* Scrollable Sections List */}
                    <div className="flex-1 overflow-y-auto px-4 pb-4 py-2">
                        <div className="space-y-4">
                            <ReorderableList
                                items={formData.sections}
                                getId={(section) => section.id}
                                onReorder={(from, to) =>
                                    onReorderSections(from, to)
                                }
                                renderItem={(section, index) => (
                                    <div
                                        key={section.id}
                                        className={cn(
                                            "flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-all duration-200 mb-4",
                                            formData.selectedSection ===
                                                section.id
                                                ? "bg-blue-100 border-blue-300 ring-2 ring-blue-400"
                                                : "bg-white border-gray-300 hover:border-gray-400 hover:shadow-md",
                                            !section.enabled && "opacity-60",
                                        )}
                                        onClick={() => {
                                            if (section.id === "declaration") {
                                                onInitDeclarationChecks();
                                                onShowDeclarationModal();
                                            } else {
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    selectedSection: section.id,
                                                }));
                                            }
                                        }}
                                    >
                                        <GripVertical className="w-4 h-4 text-gray-500 cursor-grab flex-shrink-0" />
                                        {getSectionIcon(section.title)}
                                        <Input
                                            value={section.title}
                                            onChange={(e) =>
                                                onUpdateSectionTitle(
                                                    section.id,
                                                    e.target.value,
                                                )
                                            }
                                            className="flex-1 text-sm font-medium text-gray-900 border-none bg-transparent focus:ring-0 focus:border-none p-0"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </div>
                                )}
                            />
                        </div>
                    </div>
                </>
            )}

            {/* Collapsed Sidebar - Show icons for actions and sections */}
            {sidebarCollapsed && (
                <div className="h-full flex flex-col p-2">
                    {/* Action icons */}
                    <div className="space-y-2">
                        {onResetForm && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onResetForm}
                                className="w-full p-2"
                                title="Add New Form"
                                disabled={Boolean(isEditingMode)}
                            >
                                <Plus className="w-4 h-4" />
                            </Button>
                        )}
                        {onShowDraftsModal && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onShowDraftsModal}
                                className="w-full p-2"
                                title="My Drafts"
                                disabled={Boolean(isEditingMode)}
                            >
                                <Edit className="w-4 h-4" />
                            </Button>
                        )}
                    </div>

                    {/* Section icons list */}
                    <div className="mt-2 flex-1 overflow-y-auto">
                        <div className="flex flex-col items-center space-y-2">
                            {Array.isArray(formData?.sections) && formData.sections.map((section) => (
                                <button
                                    key={section.id}
                                    type="button"
                                    className={cn(
                                        "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                                        formData.selectedSection === section.id
                                            ? "bg-blue-100 text-blue-600"
                                            : "text-gray-600 hover:bg-gray-100",
                                        section.enabled === false && "opacity-60"
                                    )}
                                    onClick={() => {
                                        if (section.id === "declaration") {
                                            onInitDeclarationChecks?.();
                                            onShowDeclarationModal?.();
                                        } else {
                                            setFormData((prev) => ({
                                                ...prev,
                                                selectedSection: section.id,
                                            }));
                                        }
                                    }}
                                    title={section.title}
                                >
                                    {getSectionIcon(section.title, "w-5 h-5")}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FormBuilderSidebar;
