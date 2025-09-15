import React from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Plus, GripVertical, Edit, Trash2, Menu, X } from "lucide-react";
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
}) => {
    // Removed drag and drop handlers

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

            {/* Collapsed Sidebar - Show only icons */}
            {sidebarCollapsed && (
                <div className="p-2 space-y-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onResetForm}
                        className="w-full p-2"
                        title="Add New Form"
                    >
                        <Plus className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onShowDraftsModal}
                        className="w-full p-2"
                        title="My Drafts"
                    >
                        <Edit className="w-4 h-4" />
                    </Button>
                </div>
            )}
        </div>
    );
};

export default FormBuilderSidebar;
