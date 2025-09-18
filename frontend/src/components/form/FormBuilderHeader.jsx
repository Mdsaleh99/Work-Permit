import React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { 
    Flame, 
    Save, 
    FileCheck, 
    Printer, 
    Menu,
    Plus,
    Edit,
    Trash2,
    Settings,
    Image as ImageIcon
} from "lucide-react";

/**
 * Header component for the form builder
 */
const FormBuilderHeader = ({
    formData,
    setFormData,
    sidebarCollapsed,
    setSidebarCollapsed,
    showPrintView,
    setShowPrintView,
    showComponentsPanel,
    setShowComponentsPanel,
    isAutoSaving,
    lastSavedTime,
    onSave,
    onSubmit,
    // onResetForm,
    // onShowDraftsModal,
    // onClearDraft,
    // onTestAutoSave,
    // drafts,
    isMobile,
    isEditingMode,
}) => {
    const fileInputRef = React.useRef(null);

    const handleLogoUpload = (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            const dataUrl = reader.result;
            setFormData(prev => ({ ...prev, logoSrc: dataUrl }));
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="bg-white border-b border-gray-200 shadow-sm">
            <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Left side - Title and controls */}
                    <div className="flex items-center space-x-4">
                        {/* Sidebar toggle for mobile */}
                        {isMobile && sidebarCollapsed && (
                            <button
                                onClick={() => setSidebarCollapsed(false)}
                                className="p-2 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
                            >
                                <Menu className="w-5 h-5 text-gray-600" />
                            </button>
                        )}

                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <Flame className="w-6 h-6 text-orange-500" />
                            </div>
                            <div>
                                <h2 className="text-lg md:text-xl font-bold text-gray-900 truncate">
                                    {formData.title}
                                </h2>
                                <div className="flex items-center space-x-4 mt-1">
                                    {/* Auto-save indicators */}
                                    {isAutoSaving && (
                                        <div className="flex items-center text-xs text-blue-600">
                                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-1"></div>
                                            Auto-saving...
                                        </div>
                                    )}
                                    {!isAutoSaving && lastSavedTime && (
                                        <div className="text-xs text-gray-500">
                                            Saved{" "}
                                            {lastSavedTime.toLocaleTimeString()}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right side - Action buttons */}
                    <div className="flex items-center gap-2 md:gap-3 flex-wrap justify-end overflow-x-auto">
                        {/* Form controls */}
                        {/* Reset Form removed */}

                        <>
                                <Button
                                    size="sm"
                                    className="rounded-lg shadow-sm bg-gray-600 hover:bg-gray-700 text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={onSave}
                                    disabled={Boolean(isEditingMode)}
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    <span className="hidden sm:inline">Save</span>
                                    {isAutoSaving && (
                                        <div className="ml-2 flex items-center">
                                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                                        </div>
                                    )}
                                </Button>

                                {/* Upload Logo (for print header) */}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleLogoUpload}
                                    className="hidden"
                                />
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="rounded-lg cursor-pointer shadow-sm border-gray-300 hover:border-gray-400"
                                    onClick={() =>
                                        fileInputRef.current &&
                                        fileInputRef.current.click()
                                    }
                                >
                                    <ImageIcon className="w-4 h-4 mr-2" />
                                    <span className="hidden sm:inline">Logo</span>
                                </Button>

                                {/* Auto-save toggle removed; autosave runs automatically in edit */}

                                <Button
                                    size="sm"
                                    className="rounded-lg cursor-pointer shadow-sm bg-blue-600 hover:bg-blue-700 text-white font-medium"
                                    onClick={onSubmit}
                                >
                                    <FileCheck className="w-4 h-4 mr-2" />
                                    <span className="hidden sm:inline">{isEditingMode ? 'Edit' : 'Submit'}</span>
                                </Button>
                        </>

                        {/* Drafts button removed */}

                        {/* Print view toggle */}
                        <Button
                            variant="outline"
                            size="sm"
                            className="rounded-lg cursor-pointer shadow-sm border-gray-300 hover:border-gray-400"
                            onClick={() => setShowPrintView(!showPrintView)}
                        >
                            <Printer className="w-4 h-4 mr-2" />
                            <span className="hidden sm:inline">
                                {showPrintView
                                    ? "Switch to Builder"
                                    : "Switch to Print View"}
                            </span>
                            <span className="sm:hidden">
                                {showPrintView ? "Builder" : "Print"}
                            </span>
                        </Button>

                        {/* Components toggle - only show on mobile */}
                        {isMobile && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="rounded-lg shadow-sm cursor-pointer border-gray-300 hover:border-gray-400"
                                onClick={() =>
                                    setShowComponentsPanel(!showComponentsPanel)
                                }
                            >
                                <Settings className="w-4 h-4 mr-2" />
                                <span className="hidden sm:inline">
                                    Components
                                </span>
                                <span className="sm:hidden">Components</span>
                            </Button>
                        )}

                        {/* Clear Draft removed */}

                        {/* Debug button removed */}

                        {/* Print button - only show in print view */}
                        {showPrintView && (
                            <Button
                                size="sm"
                                className="rounded-lg shadow-sm bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => window.print()}
                            >
                                <Printer className="w-4 h-4 mr-2" />
                                <span className="hidden sm:inline">Print</span>
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Title input - only show when not in print view */}
            {!showPrintView && (
                <div className="px-6 pb-4">
                    <Input
                        value={formData.title}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                title: e.target.value,
                            }))
                        }
                        placeholder="Enter form title..."
                        className="text-lg font-semibold border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
            )}
        </div>
    );
};

export default FormBuilderHeader;
