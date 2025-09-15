import React, { useState, useRef } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";
import {
    Trash2,
    Edit3,
    Move,
    Check,
    Calendar,
    Clock,
    FileText,
    CheckSquare,
    Circle,
    PenTool,
    Table,
    Type,
    Image,
} from "lucide-react";

// Text Field Component
export const TextField = ({
    component,
    isEditing,
    onUpdate,
    onDelete,
    onToggleEdit,
    value = "",
    onChange,
}) => {
    const [text, setText] = useState(value);

    const handleChange = (e) => {
        const newValue = e.target.value;
        setText(newValue);
        if (onChange) onChange(newValue);
    };

    if (isEditing) {
        return (
            <div className="relative group">
                <div className="flex items-center gap-2 mb-2">
                    <Move className="w-4 h-4 text-gray-400 cursor-move" />
                    <span className="text-sm font-medium">
                        {component.label}
                    </span>
                    <div className="ml-auto flex gap-1">
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={onToggleEdit}
                        >
                            <Check className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={onDelete}>
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
                <Input
                    value={component.placeholder}
                    onChange={(e) =>
                        onUpdate({ ...component, placeholder: e.target.value })
                    }
                    placeholder="Enter placeholder text..."
                />
            </div>
        );
    }

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
                {component.label}
            </label>
            <Input
                type="text"
                value={text}
                onChange={handleChange}
                placeholder={component.placeholder}
                className="ptw-input-field"
            />
        </div>
    );
};

// Text Area Component
export const TextArea = ({
    component,
    isEditing,
    onUpdate,
    onDelete,
    onToggleEdit,
    value = "",
    onChange,
}) => {
    const [text, setText] = useState(value);

    const handleChange = (e) => {
        const newValue = e.target.value;
        setText(newValue);
        if (onChange) onChange(newValue);
    };

    if (isEditing) {
        return (
            <div className="relative group">
                <div className="flex items-center gap-2 mb-2">
                    <Move className="w-4 h-4 text-gray-400 cursor-move" />
                    <span className="text-sm font-medium">
                        {component.label}
                    </span>
                    <div className="ml-auto flex gap-1">
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={onToggleEdit}
                        >
                            <Check className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={onDelete}>
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
                <textarea
                    value={component.placeholder}
                    onChange={(e) =>
                        onUpdate({ ...component, placeholder: e.target.value })
                    }
                    placeholder="Enter placeholder text..."
                    rows={component.rows || 3}
                    className="w-full p-2 border border-gray-300 rounded-md"
                />
            </div>
        );
    }

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
                {component.label}
            </label>
            <textarea
                value={text}
                onChange={handleChange}
                placeholder={component.placeholder}
                rows={component.rows || 3}
                className="w-full p-2 border-b border-gray-400 focus:outline-none focus:border-blue-500 ptw-input-field"
            />
        </div>
    );
};

// Date Picker Component
export const DatePicker = ({
    component,
    isEditing,
    onUpdate,
    onDelete,
    onToggleEdit,
    value = "",
    onChange,
}) => {
    const [date, setDate] = useState(value);

    const handleChange = (e) => {
        const newValue = e.target.value;
        setDate(newValue);
        if (onChange) onChange(newValue);
    };

    if (isEditing) {
        return (
            <div className="relative group">
                <div className="flex items-center gap-2 mb-2">
                    <Move className="w-4 h-4 text-gray-400 cursor-move" />
                    <span className="text-sm font-medium">
                        {component.label}
                    </span>
                    <div className="ml-auto flex gap-1">
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={onToggleEdit}
                        >
                            <Check className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={onDelete}>
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
                <Input
                    type="text"
                    value={component.label}
                    onChange={(e) =>
                        onUpdate({ ...component, label: e.target.value })
                    }
                    placeholder="Enter label..."
                />
            </div>
        );
    }

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
                {component.label}
            </label>
            <Input
                type="date"
                value={date}
                onChange={handleChange}
                className="ptw-input-field"
            />
        </div>
    );
};

// Time Picker Component
export const TimePicker = ({
    component,
    isEditing,
    onUpdate,
    onDelete,
    onToggleEdit,
    value = "",
    onChange,
}) => {
    const [time, setTime] = useState(value);

    const handleChange = (e) => {
        const newValue = e.target.value;
        setTime(newValue);
        if (onChange) onChange(newValue);
    };

    if (isEditing) {
        return (
            <div className="relative group">
                <div className="flex items-center gap-2 mb-2">
                    <Move className="w-4 h-4 text-gray-400 cursor-move" />
                    <span className="text-sm font-medium">
                        {component.label}
                    </span>
                    <div className="ml-auto flex gap-1">
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={onToggleEdit}
                        >
                            <Check className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={onDelete}>
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
                <Input
                    type="text"
                    value={component.label}
                    onChange={(e) =>
                        onUpdate({ ...component, label: e.target.value })
                    }
                    placeholder="Enter label..."
                />
            </div>
        );
    }

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
                {component.label}
            </label>
            <Input
                type="time"
                value={time}
                onChange={handleChange}
                className="ptw-input-field"
            />
        </div>
    );
};

// Checkbox Component
export const CheckboxGroup = ({
    component,
    isEditing,
    onUpdate,
    onDelete,
    onToggleEdit,
    value = [],
    onChange,
}) => {
    const [selectedOptions, setSelectedOptions] = useState(value);

    const handleOptionChange = (option) => {
        const newValue = selectedOptions.includes(option)
            ? selectedOptions.filter((item) => item !== option)
            : [...selectedOptions, option];
        setSelectedOptions(newValue);
        if (onChange) onChange(newValue);
    };

    if (isEditing) {
        return (
            <div className="relative group">
                <div className="flex items-center gap-2 mb-2">
                    <Move className="w-4 h-4 text-gray-400 cursor-move" />
                    <span className="text-sm font-medium">
                        {component.label}
                    </span>
                    <div className="ml-auto flex gap-1">
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={onToggleEdit}
                        >
                            <Check className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={onDelete}>
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
                <div className="space-y-2">
                    {component.options?.map((option, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <Input
                                value={option}
                                onChange={(e) => {
                                    const newOptions = [...component.options];
                                    newOptions[index] = e.target.value;
                                    onUpdate({
                                        ...component,
                                        options: newOptions,
                                    });
                                }}
                                placeholder="Option text..."
                            />
                        </div>
                    ))}
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                            onUpdate({
                                ...component,
                                options: [
                                    ...(component.options || []),
                                    "New Option",
                                ],
                            })
                        }
                    >
                        Add Option
                    </Button>
                </div>
            </div>
        );
    }

    const columns = component.columns || 1;
    const optionsPerColumn = Math.ceil(component.options?.length / columns);

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
                {component.label}
            </label>
            <div className={`grid grid-cols-${columns} gap-4`}>
                {component.options?.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id={`checkbox-${index}`}
                            checked={selectedOptions.includes(option)}
                            onChange={() => handleOptionChange(option)}
                            className="ptw-checkbox"
                        />
                        <label
                            htmlFor={`checkbox-${index}`}
                            className="text-sm"
                        >
                            {option}
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Radio Button Component
export const RadioGroup = ({
    component,
    isEditing,
    onUpdate,
    onDelete,
    onToggleEdit,
    value = "",
    onChange,
}) => {
    const [selectedValue, setSelectedValue] = useState(value);

    const handleChange = (option) => {
        setSelectedValue(option);
        if (onChange) onChange(option);
    };

    if (isEditing) {
        return (
            <div className="relative group">
                <div className="flex items-center gap-2 mb-2">
                    <Move className="w-4 h-4 text-gray-400 cursor-move" />
                    <span className="text-sm font-medium">
                        {component.label}
                    </span>
                    <div className="ml-auto flex gap-1">
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={onToggleEdit}
                        >
                            <Check className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={onDelete}>
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
                <Input
                    value={component.label}
                    onChange={(e) =>
                        onUpdate({ ...component, label: e.target.value })
                    }
                    placeholder="Enter label..."
                    className="mb-2"
                />
                <div className="space-y-2">
                    {component.options?.map((option, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <Input
                                value={option}
                                onChange={(e) => {
                                    const newOptions = [...component.options];
                                    newOptions[index] = e.target.value;
                                    onUpdate({
                                        ...component,
                                        options: newOptions,
                                    });
                                }}
                                placeholder="Option text..."
                            />
                        </div>
                    ))}
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                            onUpdate({
                                ...component,
                                options: [
                                    ...(component.options || []),
                                    "New Option",
                                ],
                            })
                        }
                    >
                        Add Option
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
                {component.label}
            </label>
            <div className="space-y-2">
                {component.options?.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <input
                            type="radio"
                            id={`radio-${index}`}
                            name={`radio-${component.id}`}
                            value={option}
                            checked={selectedValue === option}
                            onChange={() => handleChange(option)}
                            className="w-4 h-4 border border-gray-400 rounded-full"
                        />
                        <label htmlFor={`radio-${index}`} className="text-sm">
                            {option}
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Signature Component
export const SignatureField = ({
    component,
    isEditing,
    onUpdate,
    onDelete,
    onToggleEdit,
    value = "",
    onChange,
}) => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [signature, setSignature] = useState(value);

    const startDrawing = (e) => {
        setIsDrawing(true);
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const rect = canvas.getBoundingClientRect();
        ctx.beginPath();
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const rect = canvas.getBoundingClientRect();
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        const canvas = canvasRef.current;
        const signatureData = canvas.toDataURL();
        setSignature(signatureData);
        if (onChange) onChange(signatureData);
    };

    const clearSignature = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setSignature("");
        if (onChange) onChange("");
    };

    if (isEditing) {
        return (
            <div className="relative group">
                <div className="flex items-center gap-2 mb-2">
                    <Move className="w-4 h-4 text-gray-400 cursor-move" />
                    <span className="text-sm font-medium">
                        {component.label}
                    </span>
                    <div className="ml-auto flex gap-1">
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={onToggleEdit}
                        >
                            <Check className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={onDelete}>
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
                <Input
                    value={component.label}
                    onChange={(e) =>
                        onUpdate({ ...component, label: e.target.value })
                    }
                    placeholder="Enter label..."
                />
            </div>
        );
    }

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
                {component.label}
            </label>
            <div className="ptw-signature-line">
                <canvas
                    ref={canvasRef}
                    width={300}
                    height={100}
                    className="border border-gray-400 cursor-crosshair"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                />
                {signature && (
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={clearSignature}
                        className="ml-2"
                    >
                        Clear
                    </Button>
                )}
            </div>
        </div>
    );
};

// Table Component
export const TableComponent = ({
    component,
    isEditing,
    onUpdate,
    onDelete,
    onToggleEdit,
    value = [],
    onChange,
}) => {
    const [tableData, setTableData] = useState(value);

    const handleCellChange = (rowIndex, colIndex, value) => {
        const newData = [...tableData];
        if (!newData[rowIndex]) newData[rowIndex] = [];
        newData[rowIndex][colIndex] = value;
        setTableData(newData);
        if (onChange) onChange(newData);
    };

    if (isEditing) {
        return (
            <div className="relative group">
                <div className="flex items-center gap-2 mb-2">
                    <Move className="w-4 h-4 text-gray-400 cursor-move" />
                    <span className="text-sm font-medium">
                        {component.label}
                    </span>
                    <div className="ml-auto flex gap-1">
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={onToggleEdit}
                        >
                            <Check className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={onDelete}>
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="flex gap-2">
                        <Input
                            type="number"
                            value={component.columns}
                            onChange={(e) =>
                                onUpdate({
                                    ...component,
                                    columns: parseInt(e.target.value),
                                })
                            }
                            placeholder="Columns"
                        />
                        <Input
                            type="number"
                            value={component.rows}
                            onChange={(e) =>
                                onUpdate({
                                    ...component,
                                    rows: parseInt(e.target.value),
                                })
                            }
                            placeholder="Rows"
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
                {component.label}
            </label>
            <div className="overflow-x-auto">
                <table className="w-full border border-gray-400">
                    <tbody>
                        {Array.from({ length: component.rows || 2 }).map(
                            (_, rowIndex) => (
                                <tr key={rowIndex}>
                                    {Array.from({
                                        length: component.columns || 6,
                                    }).map((_, colIndex) => (
                                        <td
                                            key={colIndex}
                                            className="border border-gray-400 p-2"
                                        >
                                            <Input
                                                value={
                                                    tableData[rowIndex]?.[
                                                        colIndex
                                                    ] || ""
                                                }
                                                onChange={(e) =>
                                                    handleCellChange(
                                                        rowIndex,
                                                        colIndex,
                                                        e.target.value,
                                                    )
                                                }
                                                className="border-none p-0 text-center"
                                                placeholder={`${rowIndex + 1}-${colIndex + 1}`}
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ),
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Header Component
export const HeaderComponent = ({
    component,
    isEditing,
    onUpdate,
    onDelete,
    onToggleEdit,
}) => {
    if (isEditing) {
        return (
            <div className="relative group">
                <div className="flex items-center gap-2 mb-2">
                    <Move className="w-4 h-4 text-gray-400 cursor-move" />
                    <span className="text-sm font-medium">Header</span>
                    <div className="ml-auto flex gap-1">
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={onToggleEdit}
                        >
                            <Check className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={onDelete}>
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
                <Input
                    value={component.text}
                    onChange={(e) =>
                        onUpdate({ ...component, text: e.target.value })
                    }
                    placeholder="Enter header text..."
                    className="text-lg font-bold"
                />
            </div>
        );
    }

    return (
        <div className="mb-4">
            <h3 className="text-lg font-bold text-center border-b-2 border-black pb-2">
                {component.text}
            </h3>
        </div>
    );
};

// Static Text Component
export const StaticText = ({
    component,
    isEditing,
    onUpdate,
    onDelete,
    onToggleEdit,
}) => {
    if (isEditing) {
        return (
            <div className="relative group">
                <div className="flex items-center gap-2 mb-2">
                    <Move className="w-4 h-4 text-gray-400 cursor-move" />
                    <span className="text-sm font-medium">Static Text</span>
                    <div className="ml-auto flex gap-1">
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={onToggleEdit}
                        >
                            <Check className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={onDelete}>
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
                <textarea
                    value={component.text}
                    onChange={(e) =>
                        onUpdate({ ...component, text: e.target.value })
                    }
                    placeholder="Enter static text..."
                    className="w-full p-2 border border-gray-300 rounded-md"
                    rows={3}
                />
            </div>
        );
    }

    return (
        <div className="mb-4">
            <p className="text-sm">{component.text}</p>
        </div>
    );
};

// Logo Component
export const LogoComponent = ({
    component,
    isEditing,
    onUpdate,
    onDelete,
    onToggleEdit,
}) => {
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            const dataUrl = reader.result;
            onUpdate && onUpdate({ ...component, src: dataUrl, alt: component.alt || "Company Logo" });
        };
        reader.readAsDataURL(file);
    };

    const clearLogo = () => {
        if (fileInputRef.current) fileInputRef.current.value = "";
        onUpdate && onUpdate({ ...component, src: "" });
    };
    if (isEditing) {
        return (
            <div className="relative group">
                <div className="flex items-center gap-2 mb-2">
                    <Move className="w-4 h-4 text-gray-400 cursor-move" />
                    <span className="text-sm font-medium">Logo</span>
                    <div className="ml-auto flex gap-1">
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={onToggleEdit}
                        >
                            <Check className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={onDelete}>
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
                <div className="space-y-2">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                    />
                    {component.src && (
                        <div className="flex items-center gap-3">
                            <img src={component.src} alt={component.alt || "Logo"} className="h-10 w-auto object-contain border rounded" />
                            <Button size="sm" variant="outline" onClick={clearLogo}>Remove</Button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="mb-4 flex justify-end">
            {component.src ? (
                <img src={component.src} alt={component.alt || "Company Logo"} className="h-10 w-auto object-contain" />
            ) : (
                <div className="text-sm text-gray-500">No logo uploaded</div>
            )}
        </div>
    );
};

// Component Icon Mapping
export const componentIcons = {
    text_field: FileText,
    text_area: FileText,
    date_picker: Calendar,
    time_picker: Clock,
    checkbox: CheckSquare,
    radio_button: Circle,
    signature: PenTool,
    table: Table,
    header: Type,
    static_text: Type,
    logo: Image,
};
