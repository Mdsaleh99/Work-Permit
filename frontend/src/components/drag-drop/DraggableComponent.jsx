import React from "react";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { componentIcons } from "../form/FormComponents";

const DraggableComponent = ({
    component,
    index,
    isEditing,
    onUpdate,
    onDelete,
    onToggleEdit,
    value,
    onChange,
    children,
}) => {
    const Icon = componentIcons[component.type];

    const ref = React.useRef(null);

    React.useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const d = draggable({
            element: el,
            getInitialData: () => ({ id: component.id, index }),
        });
        return () => {
            if (typeof d === "function") d();
        };
    }, [component.id, index]);

    return (
        <div
            ref={ref}
            className={`${isEditing ? "border-2 border-blue-500 rounded-lg p-4" : ""}`}
        >
            {children}
        </div>
    );
};

export default DraggableComponent;
