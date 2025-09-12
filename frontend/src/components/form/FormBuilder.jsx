import React, { useEffect, useRef, useState } from "react";
import ReorderableList from "../drag-drop/ReorderableList";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
    Plus,
    GripVertical,
    Edit,
    Trash2,
    Save,
    Settings,
    FileText,
    Shield,
    HardHat,
    AlertTriangle,
    CheckCircle,
    Clock,
    UserCheck,
    FileCheck,
    Flame,
    Printer,
} from "lucide-react";
import ComponentPalette from "../drag-drop/ComponentPalette";
// DroppableSection no longer needed with pragmatic dnd
import PrintView from "./PrintView";
import { toast } from "react-hot-toast";
import { cn, generateId } from "../../lib/utils";
import { PTW_SECTIONS, PTW_SECTION_TEMPLATES } from "../../lib/constants";

const FormBuilder = ({ title, sectionsTemplate, startWithTemplate = true }) => {
    const [formData, setFormData] = useState({
        title: title || "GENERAL WORK PERMIT",
        sections:
            startWithTemplate && sectionsTemplate
                ? sectionsTemplate
                : PTW_SECTIONS.map((section) => ({
                      id: section.id,
                      title: section.title,
                      enabled: true,
                      components: [],
                  })),
        selectedSection:
            (startWithTemplate && sectionsTemplate && sectionsTemplate[0]?.id) ||
            "work-description",
    });

    const [editingComponent, setEditingComponent] = useState(null);
    const [showPrintView, setShowPrintView] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [declarationChecks, setDeclarationChecks] = useState({}); // key: componentId, value: boolean
    const [showAgreeModal, setShowAgreeModal] = useState(false);

    // Multi-draft autosave/load using localStorage (Gmail-like)
    const DRAFTS_KEY = "gwpt_form_drafts_v1";
    const [currentDraftId, setCurrentDraftId] = useState(null);
    const [showDraftsModal, setShowDraftsModal] = useState(false);
    const saveTimerRef = useRef(null);

    useEffect(() => {
        try {
            const raw = localStorage.getItem(DRAFTS_KEY);
            const drafts = raw ? JSON.parse(raw) : [];
            if (Array.isArray(drafts) && drafts.length > 0) {
                const latest = drafts.sort((a,b)=> (b.updatedAt||0)-(a.updatedAt||0))[0];
                setCurrentDraftId(latest.id);
                setFormData(latest.formData);
                setDeclarationChecks(latest.declarationChecks || {});
                toast.success("Latest draft loaded");
            } else {
                // initialize first draft
                const initId = generateId();
                setCurrentDraftId(initId);
                const first = { id: initId, title: "Untitled", formData, declarationChecks: {}, updatedAt: Date.now() };
                localStorage.setItem(DRAFTS_KEY, JSON.stringify([first]));
            }
        } catch (_) {}
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
        saveTimerRef.current = setTimeout(() => {
            try {
                const raw = localStorage.getItem(DRAFTS_KEY);
                const drafts = raw ? JSON.parse(raw) : [];
                const titleStr = formData?.title || "Untitled";
                const updated = { id: currentDraftId || generateId(), title: titleStr, formData, declarationChecks, updatedAt: Date.now() };
                let nextDrafts;
                const idx = drafts.findIndex((d)=> d.id === updated.id);
                if (idx >= 0) { nextDrafts = [...drafts]; nextDrafts[idx] = updated; }
                else { nextDrafts = [...drafts, updated]; if (!currentDraftId) setCurrentDraftId(updated.id); }
                localStorage.setItem(DRAFTS_KEY, JSON.stringify(nextDrafts));
            } catch (_) {}
        }, 400);
        return () => saveTimerRef.current && clearTimeout(saveTimerRef.current);
    }, [formData, declarationChecks, currentDraftId]);

    const clearDraft = () => {
        try {
            const raw = localStorage.getItem(DRAFTS_KEY);
            const drafts = raw ? JSON.parse(raw) : [];
            const next = drafts.filter((d)=> d.id !== currentDraftId);
            localStorage.setItem(DRAFTS_KEY, JSON.stringify(next));
            toast.success("Draft removed");
        } catch (_) {}
    };

    const createNewDraft = () => {
        const newId = generateId();
        const empty = {
            title: title || "GENERAL WORK PERMIT",
            sections: PTW_SECTIONS.map((section) => ({
                id: section.id,
                title: section.title,
                enabled: true,
                components: [],
            })),
            selectedSection: "work-description",
        };
        setFormData(empty);
        setDeclarationChecks({});
        setCurrentDraftId(newId);
        try {
            const raw = localStorage.getItem(DRAFTS_KEY);
            const drafts = raw ? JSON.parse(raw) : [];
            drafts.push({ id: newId, title: empty.title, formData: empty, declarationChecks: {}, updatedAt: Date.now() });
            localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
        } catch (_) {}
        toast.success("Started a new draft");
    };

    const loadDraft = (id) => {
        try {
            const drafts = JSON.parse(localStorage.getItem(DRAFTS_KEY) || "[]");
            const d = drafts.find((x)=> x.id === id);
            if (!d) return;
            setCurrentDraftId(id);
            setFormData(d.formData);
            setDeclarationChecks(d.declarationChecks || {});
            toast.success("Draft loaded");
            setShowDraftsModal(false);
        } catch (_) {}
    };

    const deleteDraft = (id) => {
        try {
            const drafts = JSON.parse(localStorage.getItem(DRAFTS_KEY) || "[]");
            const next = drafts.filter((d)=> d.id !== id);
            localStorage.setItem(DRAFTS_KEY, JSON.stringify(next));
            if (id === currentDraftId && next.length) {
                const latest = next.sort((a,b)=> (b.updatedAt||0)-(a.updatedAt||0))[0];
                loadDraft(latest.id);
            }
            toast.success("Draft deleted");
        } catch (_) {}
    };

    const duplicateForm = () => {
        const duplicated = {
            ...formData,
            sections: formData.sections.map((s) => ({
                ...s,
                id: s.id, // keep same IDs for simplicity in editor
                components: s.components.map((c) => ({ ...c, id: generateId() })),
            })),
        };
        setFormData(duplicated);
        toast.success("Form duplicated. You can now edit it.");
    };

    const getDeclarationComponents = () => {
        const sec = formData.sections.find((s) => s.id === "declaration");
        return (sec?.components || []).filter((c) => c.enabled !== false);
    };

    const initDeclarationChecks = () => {
        const comps = getDeclarationComponents();
        const next = { ...declarationChecks };
        comps.forEach((c) => {
            if (typeof next[c.id] !== "boolean") next[c.id] = false;
        });
        // prune removed
        Object.keys(next).forEach((key) => {
            if (!comps.find((c) => c.id === key)) delete next[key];
        });
        setDeclarationChecks(next);
    };

    const validateDeclaration = () => {
        const comps = getDeclarationComponents();
        const missing = comps.filter((c) => c.required && !declarationChecks[c.id]);
        if (missing.length > 0) {
            alert("Please agree to all mandatory declaration items before creating the form.");
            return false;
        }
        return true;
    };

    const submitForm = async () => {
        if (!validateDeclaration()) return;
        try {
            // 1) Simulate backend submission
            await new Promise((res) => setTimeout(res, 500));

            // 2) Simulate PDF generation and Cloudinary upload
            const fakePdfBlob = new Blob([JSON.stringify(formData, null, 2)], {
                type: "application/pdf",
            });
            await new Promise((res) => setTimeout(res, 500));

            console.log("Submitted payload:", formData);
            console.log("Uploaded to Cloudinary (dummy):", fakePdfBlob.size, "bytes");

            toast.success("Form submitted and PDF uploaded (dummy)");
            clearDraft();
            setShowAgreeModal(false);
        } catch (err) {
            toast.error("Submission failed. Try again.");
        }
    };

    const sectionIcons = {
        "work-description": FileText,
        "tools-equipment": Settings,
        ppe: Shield,
        "hazard-identification": AlertTriangle,
        ssow: CheckCircle,
        lmra: Clock,
        declaration: UserCheck,
        "opening-ptw": FileCheck,
        closure: FileCheck,
    };

    const reorderArray = (arr, from, to) => {
        const copy = [...arr];
        const [removed] = copy.splice(from, 1);
        copy.splice(to, 0, removed);
        return copy;
    };

    const handleDrop = (e, sectionId) => {
        e.preventDefault();
        setDragOver(false);
        const componentType = e.dataTransfer.getData("componentType");
        if (componentType) {
            addComponent(sectionId, componentType);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragOver(false);
    };

    const addComponent = (sectionId, componentType) => {
        const newSections = formData.sections.map((section) => {
            if (section.id === sectionId) {
                const getDefaultLabel = (type) => {
                    switch (type) {
                        case "text":
                            return "Text Field";
                        case "textarea":
                            return "Description";
                        case "date":
                            return "Date";
                        case "time":
                            return "Time";
                        case "checkbox":
                            return "Checklist";
                        case "radio":
                            return "Selection";
                        case "signature":
                            return "Signature";
                        case "table":
                            return "Table";
                        default:
                            return "Field";
                    }
                };

                const newComponent = {
                    id: generateId(),
                    type: componentType,
                    label: getDefaultLabel(componentType),
                    required: false,
                    enabled: true,
                    options:
                        componentType === "radio" ||
                        componentType === "checkbox"
                            ? ["Yes", "No", "N/A"]
                            : [],
                    value: "",
                };
                return {
                    ...section,
                    components: [...section.components, newComponent],
                };
            }
            return section;
        });
        setFormData({ ...formData, sections: newSections });
        toast.success(
            `Added ${componentType} to ${getSectionTitle(sectionId)}`,
        );
    };

    const updateComponent = (sectionId, componentId, updates) => {
        const newSections = formData.sections.map((section) => {
            if (section.id === sectionId) {
                return {
                    ...section,
                    components: section.components.map((component) =>
                        component.id === componentId
                            ? { ...component, ...updates }
                            : component,
                    ),
                };
            }
            return section;
        });
        setFormData({ ...formData, sections: newSections });
    };

    const deleteComponent = (sectionId, componentId) => {
        const newSections = formData.sections.map((section) => {
            if (section.id === sectionId) {
                return {
                    ...section,
                    components: section.components.filter(
                        (component) => component.id !== componentId,
                    ),
                };
            }
            return section;
        });
        setFormData({ ...formData, sections: newSections });
        toast.success("Component deleted");
    };

    const getSectionTitle = (sectionId) => {
        const inForm = formData.sections.find((s) => s.id === sectionId);
        if (inForm && typeof inForm.title === "string" && inForm.title.trim() !== "") {
            return inForm.title;
        }
        const base = PTW_SECTIONS.find((s) => s.id === sectionId);
        return base ? base.title : sectionId;
    };

    const selectedSectionData = formData.sections.find(
        (s) => s.id === formData.selectedSection,
    );

    return (
        <div className="ptw-form-builder flex h-screen bg-gray-50">
            {/* Sidebar - Permit Sections */}
            {!showPrintView && (
            <div className="no-print w-80 bg-white text-gray-900 flex flex-col border-r">
                {/* Header removed as requested */}

                {/* Navigation */}
                <div className="flex-1 p-4 overflow-y-auto">
                    <nav className="space-y-2">
                        <div className="text-sm text-gray-600 uppercase tracking-wider mb-4">
                            Permit Sections
                            <div className="text-xs text-gray-500 mt-1 font-normal">
                                Drag to reorder sections
                            </div>
                        </div>

                        <ReorderableList
                            items={formData.sections}
                            getId={(s) => s.id}
                            onReorder={(from, to) => {
                                const newSections = reorderArray(
                                    formData.sections,
                                    from,
                                    to,
                                );
                                setFormData({
                                    ...formData,
                                    sections: newSections,
                                });
                                toast.success("Sections reordered");
                            }}
                            className="space-y-2"
                            renderItem={(section, index) => {
                                const Icon =
                                    sectionIcons[section.id] || FileText;
                                const isSelected =
                                    formData.selectedSection === section.id;
                                const isEnabled =
                                    section.enabled !== false &&
                                    section.components.some((c) => c.enabled);

                                return (
                                    <div
                                        key={section.id}
                                        className={cn(
                                            "flex items-center p-3 rounded-lg cursor-pointer transition-colors border",
                                            isSelected
                                                ? "bg-gray-100 text-gray-900 border-gray-200"
                                                : "text-gray-700 hover:bg-gray-50 border-transparent",
                                        )}
                                        onClick={() => {
                                            setFormData({
                                                ...formData,
                                                selectedSection: section.id,
                                            });
                                            if (section.id === "declaration") {
                                                initDeclarationChecks();
                                                setShowAgreeModal(true);
                                            }
                                        }}
                                    >
                                        <GripVertical className="w-4 h-4 text-gray-400 mr-2" />
                                        <Icon className="w-5 h-5 mr-3" />
                                        {isSelected ? (
                                            <input
                                                className="flex-1 bg-transparent outline-none text-sm"
                                                value={getSectionTitle(section.id)}
                                                onChange={(e) => {
                                                    const newSections = formData.sections.map((s) =>
                                                        s.id === section.id
                                                            ? { ...s, title: e.target.value }
                                                            : s,
                                                    );
                                                    setFormData({ ...formData, sections: newSections });
                                                }}
                                            />
                                        ) : (
                                            <span className="flex-1">
                                                {getSectionTitle(section.id)}
                                            </span>
                                        )}
                                        <div className="flex items-center space-x-2">
                                            {isEnabled && (
                                                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                            )}
                                        </div>
                                    </div>
                                );
                            }}
                        />
                    </nav>

                    <div className="mt-6">
                        <Button
                            className="w-full bg-gray-800 hover:bg-gray-700 text-white"
                            onClick={() => {
                                const newSectionId = generateId();
                                const newSection = {
                                    id: newSectionId,
                                    title: "New Section",
                                    enabled: true,
                                    components: [],
                                };
                                const newSections = [...formData.sections, newSection];
                                setFormData({
                                    ...formData,
                                    sections: newSections,
                                    selectedSection: newSectionId,
                                });
                                toast.success("New section added");
                            }}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add New Form
                        </Button>
                    </div>
                </div>
            </div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col">
                {/* Top Header (visible on screen in both modes, hidden when printing) */}
                <div className="no-print bg-gray-100 border-b border-gray-200 px-4 md:px-6 py-3 md:py-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div className="flex items-center min-w-0">
                            <Flame className="w-6 h-6 text-orange-500 mr-3" />
                            <h2 className="text-lg md:text-xl font-semibold text-gray-800 truncate">
                                {formData.title}
                            </h2>
                        </div>
                        <div className="flex items-center gap-2 md:gap-3 flex-wrap justify-end overflow-x-auto">
                            {/* Open declaration modal on submit instead of inline checkboxes */}
                            <Button
                                variant="outline"
                                size="sm"
                                className="rounded-full shadow-sm"
                                onClick={() => {
                                    setFormData({
                                        title: title || "GENERAL WORK PERMIT",
                                        sections: PTW_SECTIONS.map((section) => ({
                                            id: section.id,
                                            title: section.title,
                                            enabled: true,
                                            components: [],
                                        })),
                                        selectedSection: "work-description",
                                    });
                                    toast.success("Form reset to empty state");
                                }}
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Reset Form
                            </Button>
                            <Button size="sm" className="rounded-full shadow-sm" onClick={() => toast.success("Draft saved") }>
                                <Save className="w-4 h-4 mr-2" />
                                <span className="hidden sm:inline">Save</span>
                            </Button>
                            <Button size="sm" className="rounded-full shadow-sm bg-blue-600 hover:bg-blue-700 text-white" onClick={() => { initDeclarationChecks(); setShowAgreeModal(true); }}>
                                <FileCheck className="w-4 h-4 mr-2" />
                                <span className="hidden sm:inline">Submit</span>
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="rounded-full shadow-sm"
                                onClick={() => setShowDraftsModal(true)}
                            >
                                <span className="hidden sm:inline">Drafts</span>
                                <span className="sm:hidden">Drfts</span>
                            </Button>
                            <Button size="sm" className="rounded-full shadow-sm" onClick={createNewDraft}>
                                <span className="hidden sm:inline">New Form</span>
                                <span className="sm:hidden">New</span>
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="rounded-full shadow-sm"
                                onClick={() => {
                                    setFormData({
                                        title: title || "GENERAL WORK PERMIT",
                                        sections:
                                            sectionsTemplate ||
                                            PTW_SECTION_TEMPLATES,
                                        selectedSection: "work-description",
                                    });
                                    toast.success("Loaded predefined template");
                                }}
                            >
                                <FileText className="w-4 h-4 mr-2" />
                                <span className="hidden sm:inline">Load Template</span>
                                <span className="sm:hidden">Template</span>
                            </Button>
                            {/* Duplicate action will be shown on the list page, not here */}
                            <Button
                                variant="outline"
                                size="sm"
                                className="rounded-full shadow-sm"
                                onClick={() => setShowPrintView(!showPrintView)}
                            >
                                <Printer className="w-4 h-4 mr-2" />
                                <span className="hidden sm:inline">{showPrintView ? "Builder" : "Print View"}</span>
                                <span className="sm:hidden">{showPrintView ? "Build" : "Print"}</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="rounded-full" onClick={clearDraft}>
                                <span className="hidden sm:inline">Clear Draft</span>
                                <span className="sm:hidden">Clear</span>
                            </Button>
                            {showPrintView && (
                                <Button
                                    size="sm"
                                    className="rounded-full shadow-sm"
                                    onClick={() => window.print()}
                                >
                                    <Printer className="w-4 h-4 mr-2" />
                                    <span className="hidden sm:inline">Print</span>
                                </Button>
                            )}
                            {showPrintView && (
                                <div className="text-sm text-gray-600">
                                    {
                                        formData.sections.filter(
                                            (s) =>
                                                s.enabled !== false &&
                                                s.components.some(
                                                    (c) => c.enabled,
                                                ),
                                        ).length
                                    }{" "}
                                    sections,{" "}
                                    {formData.sections.reduce(
                                        (total, section) =>
                                            total +
                                            section.components.filter(
                                                (c) => c.enabled,
                                            ).length,
                                        0,
                                    )}{" "}
                                    fields enabled
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                {showPrintView ? (
                    <div className="flex-1 overflow-auto bg-gray-50">
                        <div className="ptw-preview-wrap">
                            <PrintView formData={formData} />
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex overflow-hidden">
                        {/* Agreement Modal */}
                        {showAgreeModal && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                                <div className="bg-white rounded-md shadow-lg w-full max-w-md p-6">
                                    <h4 className="text-lg font-semibold mb-3">Declaration</h4>
                                    <p className="text-sm text-gray-600 mb-3">Please confirm all declaration items. Items marked Mandatory must be checked.</p>
                                    <div className="space-y-3 max-h-[60vh] overflow-y-auto mb-4">
                                        {getDeclarationComponents().map((c) => (
                                            <label key={c.id} className="text-sm inline-flex items-start space-x-2">
                                                <input
                                                    type="checkbox"
                                                    checked={!!declarationChecks[c.id]}
                                                    onChange={(e) =>
                                                        setDeclarationChecks((prev) => ({
                                                            ...prev,
                                                            [c.id]: e.target.checked,
                                                        }))
                                                    }
                                                />
                                                <span>
                                                    {c.label}
                                                    {c.required ? <span className="text-red-500 ml-1">(Mandatory)</span> : null}
                                                </span>
                                            </label>
                                        ))}
                                        {getDeclarationComponents().length === 0 && (
                                            <div className="text-xs text-gray-500">No declaration items configured in this section.</div>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-end space-x-2">
                                        <Button variant="outline" size="sm" onClick={() => setShowAgreeModal(false)}>Cancel</Button>
                                        <Button size="sm" onClick={submitForm}>Confirm & Submit</Button>
                                    </div>
                                </div>
                            </div>
                        )}
                        {showDraftsModal && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                                <div className="bg-white rounded-md shadow-lg w-full max-w-2xl p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-lg font-semibold">Drafts</h4>
                                        <Button variant="ghost" size="sm" onClick={() => setShowDraftsModal(false)}>Close</Button>
                                    </div>
                                    <div className="max-h-[60vh] overflow-y-auto divide-y">
                                        {(JSON.parse(localStorage.getItem(DRAFTS_KEY) || "[]") || []).sort((a,b)=> (b.updatedAt||0)-(a.updatedAt||0)).map((d)=> (
                                            <div key={d.id} className="py-3 flex items-center justify-between">
                                                <div>
                                                    <div className="font-medium">{d.title || "Untitled"}</div>
                                                    <div className="text-xs text-gray-500">Updated {new Date(d.updatedAt||Date.now()).toLocaleString()}</div>
                                                </div>
                                                <div className="space-x-2">
                                                    <Button variant="outline" size="sm" onClick={() => loadDraft(d.id)}>Open</Button>
                                                    <Button variant="ghost" size="sm" onClick={() => deleteDraft(d.id)}>Delete</Button>
                                                </div>
                                            </div>
                                        ))}
                                        {((JSON.parse(localStorage.getItem(DRAFTS_KEY) || "[]") || []).length === 0) && (
                                            <div className="text-sm text-gray-500">No drafts yet.</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* Left Panel - Section Details */}
                        <div className="basis-3/4 min-w-0 p-6 border-r border-gray-200 overflow-y-auto">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    {getSectionTitle(formData.selectedSection)}
                                </h3>
                                <div className="flex items-center space-x-3">
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={
                                                selectedSectionData?.enabled !==
                                                false
                                            }
                                            onChange={(e) => {
                                                const newSections =
                                                    formData.sections.map(
                                                        (section) =>
                                                            section.id ===
                                                            formData.selectedSection
                                                                ? {
                                                                      ...section,
                                                                      enabled:
                                                                          e
                                                                              .target
                                                                              .checked,
                                                                  }
                                                                : section,
                                                    );
                                                setFormData({
                                                    ...formData,
                                                    sections: newSections,
                                                });
                                            }}
                                            className="rounded"
                                        />
                                        <span className="text-sm text-gray-600">
                                            Enable Section
                                        </span>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            const newSections =
                                                formData.sections.map(
                                                    (section) =>
                                                        section.id ===
                                                        formData.selectedSection
                                                            ? {
                                                                  ...section,
                                                                  components:
                                                                      [],
                                                              }
                                                            : section,
                                                );
                                            setFormData({
                                                ...formData,
                                                sections: newSections,
                                            });
                                            toast.success(
                                                "All components deleted from section",
                                            );
                                        }}
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete All
                                    </Button>
                                </div>
                            </div>

                            <div
                                className={cn(
                                    "space-y-4 min-h-32 border-2 border-dashed rounded-lg p-4 transition-colors",
                                    dragOver
                                        ? "border-blue-500 bg-blue-50"
                                        : "border-gray-300",
                                )}
                                onDrop={(e) =>
                                    handleDrop(e, formData.selectedSection)
                                }
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                            >
                                {selectedSectionData?.components.length ===
                                0 ? (
                                    <div className="text-center py-12 text-gray-500">
                                        <div className="text-2xl mb-4">📝</div>
                                        <div className="text-lg mb-2 font-medium">
                                            No components yet
                                        </div>
                                        <div className="text-sm mb-4">
                                            Drag components from the palette or
                                            use the buttons below
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            Tip: Start by adding a text field or
                                            checkbox
                                        </div>
                                    </div>
                                ) : (
                                    <ReorderableList
                                        items={
                                            selectedSectionData?.components ||
                                            []
                                        }
                                        getId={(c) => c.id}
                                        onReorder={(from, to) => {
                                            const newSections =
                                                formData.sections.map(
                                                    (section) => {
                                                        if (
                                                            section.id !==
                                                            formData.selectedSection
                                                        )
                                                            return section;
                                                        const comps = [
                                                            ...section.components,
                                                        ];
                                                        const [r] =
                                                            comps.splice(
                                                                from,
                                                                1,
                                                            );
                                                        comps.splice(to, 0, r);
                                                        return {
                                                            ...section,
                                                            components: comps,
                                                        };
                                                    },
                                                );
                                            setFormData({
                                                ...formData,
                                                sections: newSections,
                                            });
                                        }}
                                        renderItem={(component, index) => (
                                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                                                <div className="flex items-center justify-between mb-3">
                                                    <GripVertical className="w-4 h-4 text-gray-400" />
                                                    <div className="flex items-center space-x-2">
                                                        <input
                                                            type="checkbox"
                                                            checked={
                                                                component.enabled
                                                            }
                                                            onChange={(e) =>
                                                                updateComponent(
                                                                    formData.selectedSection,
                                                                    component.id,
                                                                    {
                                                                        enabled:
                                                                            e
                                                                                .target
                                                                                .checked,
                                                                    },
                                                                )
                                                            }
                                                            className="rounded"
                                                        />
                                                        <span className="text-sm text-gray-600">
                                                            Enable
                                                        </span>
                                                        <input
                                                            type="checkbox"
                                                            checked={
                                                                component.required
                                                            }
                                                            onChange={(e) =>
                                                                updateComponent(
                                                                    formData.selectedSection,
                                                                    component.id,
                                                                    {
                                                                        required:
                                                                            e
                                                                                .target
                                                                                .checked,
                                                                    },
                                                                )
                                                            }
                                                            className="rounded"
                                                        />
                                                        <span className="text-sm text-gray-600">
                                                            Mandatory
                                                        </span>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                setEditingComponent(
                                                                    component.id,
                                                                )
                                                            }
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                deleteComponent(
                                                                    formData.selectedSection,
                                                                    component.id,
                                                                )
                                                            }
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    <Input
                                                        value={component.label}
                                                        onChange={(e) =>
                                                            updateComponent(
                                                                formData.selectedSection,
                                                                component.id,
                                                                {
                                                                    label: e
                                                                        .target
                                                                        .value,
                                                                },
                                                            )
                                                        }
                                                        placeholder="Question label"
                                                        className="font-medium"
                                                    />

                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-sm text-gray-600">
                                                            Response Type:
                                                        </span>
                                                        <select
                                                            value={
                                                                component.type
                                                            }
                                                            onChange={(e) => {
                                                                const newType = e.target.value;
                                                                const updates = { type: newType };
                                                                if (newType === "radio") {
                                                                    updates.options = ["Yes", "No", "N/A"];
                                                                } else if (newType === "checkbox") {
                                                                    updates.options = ["Option 1", "Option 2", "Option 3"];
                                                                }
                                                                updateComponent(
                                                                    formData.selectedSection,
                                                                    component.id,
                                                                    updates,
                                                                );
                                                            }}
                                                            className="border border-gray-300 rounded px-2 py-1 text-sm"
                                                        >
                                                            <option value="text">
                                                                Text
                                                            </option>
                                                            <option value="textarea">
                                                                Text Area
                                                            </option>
                                                            <option value="checkbox">
                                                                Checkbox
                                                            </option>
                                                            <option value="radio">
                                                                Yes No N/A
                                                            </option>
                                                            <option value="date">
                                                                Date
                                                            </option>
                                                            <option value="time">
                                                                Time
                                                            </option>
                                                        </select>
                                                    </div>

                                                    {(component.type ===
                                                        "radio" ||
                                                        component.type ===
                                                            "checkbox") && (
                                                        <div className="space-y-2">
                                                            {(Array.isArray(component.options) ? component.options : []).map(
                                                                (
                                                                    option,
                                                                    optionIndex,
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            optionIndex
                                                                        }
                                                                        className="flex items-center space-x-2"
                                                                    >
                                                                        <Input
                                                                            value={
                                                                                option
                                                                            }
                                                                            onChange={(
                                                                                e,
                                                                            ) => {
                                                                                const newOptions =
                                                                                    [
                                                                                        ...component.options,
                                                                                    ];
                                                                                newOptions[
                                                                                    optionIndex
                                                                                ] =
                                                                                    e.target.value;
                                                                                updateComponent(
                                                                                    formData.selectedSection,
                                                                                    component.id,
                                                                                    {
                                                                                        options:
                                                                                            newOptions,
                                                                                    },
                                                                                );
                                                                            }}
                                                                            className="text-sm"
                                                                        />
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() => {
                                                                                const newOptions =
                                                                                    component.options.filter(
                                                                                        (
                                                                                            _,
                                                                                            i,
                                                                                        ) =>
                                                                                            i !==
                                                                                            optionIndex,
                                                                                    );
                                                                                updateComponent(
                                                                                    formData.selectedSection,
                                                                                    component.id,
                                                                                    {
                                                                                        options:
                                                                                            newOptions,
                                                                                    },
                                                                                );
                                                                            }}
                                                                        >
                                                                            <Trash2 className="w-3 h-3" />
                                                                        </Button>
                                                                    </div>
                                                                ),
                                                            )}
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => {
                                                                    const newOptions =
                                                                        Array.isArray(component.options)
                                                                            ? [
                                                                                  ...component.options,
                                                                                  "New Option",
                                                                              ]
                                                                            : ["New Option"];
                                                                    updateComponent(
                                                                        formData.selectedSection,
                                                                        component.id,
                                                                        {
                                                                            options:
                                                                                newOptions,
                                                                        },
                                                                    );
                                                                }}
                                                            >
                                                                <Plus className="w-3 h-3 mr-1" />
                                                                Add Option
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    />
                                )}
                            </div>

                            <div className="mt-6 space-y-3">
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => {
                                        const newComponent = {
                                            id: generateId(),
                                            type: "text",
                                            label: "New Field",
                                            required: false,
                                            enabled: true,
                                            options: [],
                                            value: "",
                                        };
                                        const newSections =
                                            formData.sections.map((section) =>
                                                section.id ===
                                                formData.selectedSection
                                                    ? {
                                                          ...section,
                                                          components: [
                                                              ...section.components,
                                                              newComponent,
                                                          ],
                                                      }
                                                    : section,
                                            );
                                        setFormData({
                                            ...formData,
                                            sections: newSections,
                                        });
                                        toast.success(
                                            "Added new field to section",
                                        );
                                    }}
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Field
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => {
                                        const newComponent = {
                                            id: generateId(),
                                            type: "radio",
                                            label: "New Question",
                                            required: false,
                                            enabled: true,
                                            options: ["Yes", "No", "N/A"],
                                            value: "",
                                        };
                                        const newSections =
                                            formData.sections.map((section) =>
                                                section.id ===
                                                formData.selectedSection
                                                    ? {
                                                          ...section,
                                                          components: [
                                                              ...section.components,
                                                              newComponent,
                                                          ],
                                                      }
                                                    : section,
                                            );
                                        setFormData({
                                            ...formData,
                                            sections: newSections,
                                        });
                                        toast.success(
                                            "Added new question to section",
                                        );
                                    }}
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Question
                                </Button>
                            </div>
                        </div>

                        {/* Right Panel - Component Palette */}
                        <div className="basis-1/4 max-w-[420px] min-w-[360px] p-6 overflow-y-auto">
                            <div className="h-full">
                                <ComponentPalette />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FormBuilder;
