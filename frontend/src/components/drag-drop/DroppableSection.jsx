import React from "react";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { Button } from "../ui/button";
import { Plus, Edit3, Trash2 } from "lucide-react";

const DroppableSection = ({
    section,
    isEditing,
    onAddComponent,
    onUpdateSection,
    onDeleteSection,
    onToggleEdit,
    onDrop,
    onDragOver,
    children,
}) => {
    const containerRef = React.useRef(null);

    React.useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const t = dropTargetForElements({
            element: el,
            getData: () => ({ sectionId: section.id }),
            onDrop: () => {
                onDrop && onDrop();
            },
        });
        return () => t?.cleanup();
    }, [section.id, onDrop]);

    return (
        <div className="ptw-section">
            <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm">{section.title}</h3>
                    {isEditing && (
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={onToggleEdit}
                        >
                            <Edit3 className="w-4 h-4" />
                        </Button>
                    )}
                </div>
                <div className="flex gap-2">
                    {isEditing && (
                        <>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={onAddComponent}
                            >
                                <Plus className="w-4 h-4" />
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={onDeleteSection}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </>
                    )}
                </div>
            </div>

            <div
                ref={containerRef}
                onDrop={onDrop}
                onDragOver={onDragOver}
                className="min-h-[100px] p-4"
            >
                {children}
            </div>
        </div>
    );
};

export default DroppableSection;
