import React from "react";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";

export default function ReorderableList({
    items,
    getId,
    onReorder,
    renderItem,
    className,
}) {
    return (
        <div className={className}>
            {items.map((item, index) => (
                <ReorderableItem
                    key={getId(item)}
                    id={getId(item)}
                    index={index}
                    onReorder={onReorder}
                >
                    {renderItem(item, index)}
                </ReorderableItem>
            ))}
        </div>
    );
}

function ReorderableItem({ id, index, onReorder, children }) {
    const ref = React.useRef(null);

    React.useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const d = draggable({
            element: el,
            getInitialData: () => ({ id, index }),
        });

        const t = dropTargetForElements({
            element: el,
            getData: () => ({ id, index }),
            onDrop: ({ source, self }) => {
                if (!source || !self) return;
                const from = source.data.index;
                const to = self.data.index;
                if (
                    typeof from === "number" &&
                    typeof to === "number" &&
                    from !== to
                ) {
                    onReorder(from, to);
                }
            },
        });

        return () => {
            if (typeof d === "function") d();
            if (typeof t === "function") t();
        };
    }, [id, index, onReorder]);

    return (
        <div ref={ref} data-id={id} data-index={index}>
            {children}
        </div>
    );
}
