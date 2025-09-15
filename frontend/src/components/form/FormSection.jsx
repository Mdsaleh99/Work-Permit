import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { 
    GripVertical, 
    Edit, 
    Trash2, 
    Plus,
    Settings,
    FileText,
    Shield,
    HardHat,
    AlertTriangle,
    CheckCircle,
    Clock,
    UserCheck
} from "lucide-react";
import { cn } from "../../lib/utils";
import ReorderableList from "../drag-drop/ReorderableList";

/**
 * Component for rendering form sections and their components
 */
const FormSection = ({
    formData,
    editingComponent,
    setEditingComponent,
    onAddComponent,
    onUpdateComponent,
    onDeleteComponent,
    onReorderComponents,
}) => {
    const selectedSection = formData.sections.find(section => section.id === formData.selectedSection);

    // Drag and drop handlers
    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const componentType = e.dataTransfer.getData("componentType");
        if (!componentType || !selectedSection) return;
        onAddComponent && onAddComponent(selectedSection.id, componentType);
    };

    if (!selectedSection) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium mb-2">No section selected</h3>
                    <p>Select a section from the sidebar to start building your form</p>
                </div>
            </div>
        );
    }

    const getComponentIcon = (type) => {
        const icons = {
            text: FileText,
            textarea: FileText,
            select: Settings,
            radio: Settings,
            checkbox: CheckCircle,
            date: Clock,
            number: Settings,
            email: UserCheck,
            phone: UserCheck,
        };
        return icons[type] || FileText;
    };

    const renderComponent = (component, sectionId) => {
        const IconComponent = getComponentIcon(component.type);
        const isEditing = editingComponent === component.id;

        return (
            <Card
                key={component.id}
                className={cn(
                    "transition-all duration-200 border border-gray-200 mb-4",
                    isEditing ? "ring-2 ring-blue-500 bg-blue-50 border-blue-200" : "hover:shadow-md hover:border-gray-300"
                )}
            >
                <CardHeader className="p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2">
                                <GripVertical className="w-4 h-4 text-gray-400 cursor-grab" />
                                <IconComponent className="w-4 h-4 text-gray-600" />
                            </div>
                            <div className="flex items-center space-x-2">
                                <CardTitle className="text-sm font-medium text-gray-900">
                                    {component.label}
                                </CardTitle>
                                {component.required && (
                                    <span className="text-red-500 text-xs font-bold">*</span>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center space-x-1">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingComponent(isEditing ? null : component.id)}
                                className={cn(
                                    "p-2 transition-colors",
                                    isEditing ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
                                )}
                            >
                                <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onDeleteComponent(sectionId, component.id)}
                                className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>

                {isEditing && (
                    <CardContent className="p-4 pt-0 bg-gray-50 border-t border-gray-200">
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor={`label-${component.id}`} className="text-sm font-medium text-gray-700">
                                    Label
                                </Label>
                                <Input
                                    id={`label-${component.id}`}
                                    value={component.label}
                                    onChange={(e) => onUpdateComponent(sectionId, component.id, { label: e.target.value })}
                                    className="mt-1 text-sm"
                                />
                            </div>

                            <div className="flex items-center space-x-6">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={component.required}
                                        onChange={(e) => onUpdateComponent(sectionId, component.id, { required: e.target.checked })}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700">Required</span>
                                </label>
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={component.enabled}
                                        onChange={(e) => onUpdateComponent(sectionId, component.id, { enabled: e.target.checked })}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700">Enabled</span>
                                </label>
                            </div>

                            {(component.type === "select" || component.type === "radio" || component.type === "checkbox") && (
                                <div>
                                    <Label className="text-sm font-medium text-gray-700">Options</Label>
                                    <div className="mt-2 space-y-2">
                                        {component.options.map((option, index) => (
                                            <div key={index} className="flex items-center space-x-2">
                                                <Input
                                                    value={option}
                                                    onChange={(e) => {
                                                        const newOptions = [...component.options];
                                                        newOptions[index] = e.target.value;
                                                        onUpdateComponent(sectionId, component.id, { options: newOptions });
                                                    }}
                                                    className="text-sm flex-1"
                                                />
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                        const newOptions = component.options.filter((_, i) => i !== index);
                                                        onUpdateComponent(sectionId, component.id, { options: newOptions });
                                                    }}
                                                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ))}
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                const newOptions = [...component.options, `Option ${component.options.length + 1}`];
                                                onUpdateComponent(sectionId, component.id, { options: newOptions });
                                            }}
                                            className="w-full mt-2"
                                        >
                                            <Plus className="w-4 h-4 mr-2" />
                                            Add Option
                                        </Button>
                                    </div>
                                </div>
                            )}
                            {component.type === "logo" && (
                                <div>
                                    <Label className="text-sm font-medium text-gray-700">Upload Logo</Label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files && e.target.files[0];
                                            if (!file) return;
                                            const reader = new FileReader();
                                            reader.onload = () => {
                                                const dataUrl = reader.result;
                                                onUpdateComponent(sectionId, component.id, { src: dataUrl });
                                            };
                                            reader.readAsDataURL(file);
                                        }}
                                        className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                                    />
                                    {component.src && (
                                        <div className="mt-3">
                                            <img src={component.src} alt="Logo preview" className="h-12 w-auto object-contain border rounded" />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </CardContent>
                )}
            </Card>
        );
    };

    return (
        <div className="p-6">
            <div className="max-w-4xl mx-auto">
                {/* Section Header */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {selectedSection.title}
                    </h2>
                    <p className="text-gray-600">
                        {selectedSection.components.length} components
                    </p>
                </div>

                {/* Components List */}
                {selectedSection.components.length > 0 ? (
                    <div className="space-y-4 min-h-32 p-4"
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                    >
                        <ReorderableList
                            items={selectedSection.components}
                            getId={(component) => component.id}
                            onReorder={(from, to) => onReorderComponents(selectedSection.id, from, to)}
                            renderItem={(component) => renderComponent(component, selectedSection.id)}
                        />
                    </div>
                ) : (
                    <div className="text-center py-16 rounded-lg border border-gray-200 bg-gray-50"
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                    >
                        <FileText className="w-20 h-20 mx-auto mb-6 text-gray-300" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                            No components yet
                        </h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            Drag components from the right panel to start building this section. You can also click on components in the palette to add them.
                        </p>
                        <div className="text-sm text-gray-500">
                            💡 Tip: Select a component type from the right panel to get started
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FormSection;
