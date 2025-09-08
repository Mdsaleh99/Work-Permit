import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import {
    Type,
    AlignLeft,
    Calendar,
    Clock,
    CheckSquare,
    Circle,
    FileText,
    Image,
    Table,
    User,
} from "lucide-react";
import { FORM_COMPONENTS } from "../../lib/constants";

const ComponentPalette = () => {
    const handleDragStart = (e, componentType) => {
        e.dataTransfer.setData("componentType", componentType);
    };

    const componentIcons = {
        text: Type,
        textarea: AlignLeft,
        date: Calendar,
        time: Clock,
        checkbox: CheckSquare,
        radio: Circle,
        signature: User,
        table: Table,
        header: FileText,
        logo: Image,
    };

    return (
        <div className="h-full">
            <Card className="h-full">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-800">
                        Form Components
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                        Drag and drop components to build your form
                    </p>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {FORM_COMPONENTS.map((component) => {
                            const Icon = componentIcons[component.type] || Type;

                            return (
                                <div
                                    key={component.type}
                                    draggable
                                    onDragStart={(e) =>
                                        handleDragStart(e, component.type)
                                    }
                                    className="flex items-center p-3 border border-gray-200 rounded-lg cursor-move hover:bg-gray-50 transition-colors group"
                                >
                                    <Icon className="w-5 h-5 text-gray-600 mr-3" />
                                    <div className="flex-1">
                                        <div className="font-medium text-gray-800">
                                            {component.label}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {component.description}
                                        </div>
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-blue-800 mb-2">
                            Quick Tips
                        </h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                            <li>
                                • Drag components to the left panel to add them
                            </li>
                            <li>• Use drag handles to reorder components</li>
                            <li>• Enable/disable components as needed</li>
                            <li>
                                • Mark fields as mandatory for required data
                            </li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ComponentPalette;
