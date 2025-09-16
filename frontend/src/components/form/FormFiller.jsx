import React, { useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import PrintView from "./PrintView";

// Simple member filler that renders input controls for each component type
// Props: { title, sectionsTemplate, onSubmit, isSubmitting }
const FormFiller = ({ title, sectionsTemplate, onSubmit, isSubmitting }) => {
    const initialAnswers = useMemo(() => {
        const map = {};
        (sectionsTemplate || []).forEach(section => {
            (section.components || []).forEach(component => {
                if (component.type === "checkbox") {
                    map[component.id] = [];
                } else {
                    map[component.id] = "";
                }
            });
        });
        return map;
    }, [sectionsTemplate]);

    const [answers, setAnswers] = useState(initialAnswers);
    const [showPrint, setShowPrint] = useState(false);

    const setValue = (id, value) => setAnswers(prev => ({ ...prev, [id]: value }));

    const toggleCheckbox = (id, option) => {
        setAnswers(prev => {
            const arr = Array.isArray(prev[id]) ? prev[id] : [];
            const exists = arr.includes(option);
            const next = exists ? arr.filter(o => o !== option) : [...arr, option];
            return { ...prev, [id]: next };
        });
    };

    if (showPrint) {
        const formData = { title, sections: sectionsTemplate || [], answers };
        return (
            <PrintView formData={formData} onToggleView={() => setShowPrint(false)} />
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white border-b p-4 sticky top-0 z-40">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <h1 className="text-lg font-semibold text-gray-900">{title || "Work Permit"}</h1>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => setShowPrint(true)} className="cursor-pointer">Print View</Button>
                        <Button size="sm" onClick={() => onSubmit && onSubmit(answers)} disabled={isSubmitting} className="cursor-pointer">
                            {isSubmitting ? "Submitting..." : "Submit"}
                        </Button>
                    </div>
                </div>
            </div>
            <div className="max-w-5xl mx-auto p-4 space-y-6">
                {(sectionsTemplate || []).filter(s => s.enabled !== false).map(section => (
                    <div key={section.id} className="bg-white border rounded-lg shadow-sm">
                        <div className="border-b px-4 py-2 font-semibold text-gray-800">{section.title}</div>
                        <div className="p-4 space-y-4">
                            {(section.components || []).filter(c => c.enabled !== false).map(component => {
                                switch (component.type) {
                                    case "text":
                                    case "date":
                                    case "time":
                                        return (
                                            <div key={component.id}>
                                                <Label className="mb-1 block">{component.label}</Label>
                                                <Input
                                                    type={component.type === "text" ? "text" : component.type}
                                                    value={answers[component.id] || ""}
                                                    onChange={e => setValue(component.id, e.target.value)}
                                                />
                                            </div>
                                        );
                                    case "textarea":
                                        return (
                                            <div key={component.id}>
                                                <Label className="mb-1 block">{component.label}</Label>
                                                <textarea
                                                    className="w-full border rounded-md p-2 text-sm"
                                                    rows={4}
                                                    value={answers[component.id] || ""}
                                                    onChange={e => setValue(component.id, e.target.value)}
                                                />
                                            </div>
                                        );
                                    case "checkbox":
                                        return (
                                            <div key={component.id}>
                                                <Label className="mb-2 block">{component.label}</Label>
                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                                    {(component.options || []).map(opt => (
                                                        <label key={opt} className="flex items-center gap-2 text-sm">
                                                            <input
                                                                type="checkbox"
                                                                checked={(answers[component.id] || []).includes(opt)}
                                                                onChange={() => toggleCheckbox(component.id, opt)}
                                                            />
                                                            <span>{opt}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    case "radio":
                                        return (
                                            <div key={component.id}>
                                                <Label className="mb-2 block">{component.label}</Label>
                                                <div className="flex flex-wrap gap-4 text-sm">
                                                    {(component.options || []).map(opt => (
                                                        <label key={opt} className="flex items-center gap-2">
                                                            <input
                                                                type="radio"
                                                                name={component.id}
                                                                checked={answers[component.id] === opt}
                                                                onChange={() => setValue(component.id, opt)}
                                                            />
                                                            <span>{opt}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    default:
                                        return (
                                            <div key={component.id}>
                                                <Label className="mb-1 block">{component.label}</Label>
                                                <Input
                                                    value={answers[component.id] || ""}
                                                    onChange={e => setValue(component.id, e.target.value)}
                                                />
                                            </div>
                                        );
                                }
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FormFiller;


