import React, { useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent } from "../ui/card";
import { cn } from "../../lib/utils";
import { ChevronLeft, ChevronRight, FileText, ClipboardList, Wrench, Shield, ShieldCheck, AlertTriangle, ListChecks } from "lucide-react";
import PrintView from "./PrintView";

// Simple member filler that renders input controls for each component type
// Props: { title, sectionsTemplate, onSubmit, isSubmitting, containerClassName }
const FormFiller = ({ title, sectionsTemplate, onSubmit, isSubmitting, containerClassName, permitNo }) => {
    // Map section titles to icons
    const getSectionIcon = (sectionTitle, className = "w-4 h-4") => {
        const t = (sectionTitle || "").toLowerCase();
        if (t.includes("work description")) return <ClipboardList className={className} />;
        if (t.includes("tools") || t.includes("equipment")) return <Wrench className={className} />;
        if (t.includes("ppe")) return <Shield className={className} />;
        if (t.includes("hazard")) return <AlertTriangle className={className} />;
        if (t.includes("safe system")) return <ShieldCheck className={className} />;
        if (t.includes("last minute") || t.includes("risk assessment")) return <ListChecks className={className} />;
        return <FileText className={className} />;
    };
    const initialAnswers = useMemo(() => {
        const map = {};
        (sectionsTemplate || []).forEach(section => {
            const isToolsEquipSection = (section?.title || "").toLowerCase().includes("tools") && (section?.title || "").toLowerCase().includes("equipment");
            (section.components || []).forEach(component => {
                if (component.type === "checkbox") {
                    map[component.id] = [];
                } else if (isToolsEquipSection) {
                    // For Tools & Equipment, always use 18 blanks regardless of component type
                    map[component.id] = Array(18).fill("");
                } else {
                    map[component.id] = "";
                }
            });
        });
        // Inject Work Permit No if present and component exists
        if (permitNo) {
            const workPermitComponent = (sectionsTemplate || [])
                .flatMap(s => s.components || [])
                .find(c => /work\s*permit\s*no/i.test(c.label));
            if (workPermitComponent) {
                map[workPermitComponent.id] = permitNo;
            }
        }
        return map;
    }, [sectionsTemplate, permitNo]);

    const [answers, setAnswers] = useState(initialAnswers);
    React.useEffect(() => {
        setAnswers(initialAnswers);
    }, [initialAnswers]);

    // Ensure Work Permit No is injected even if user enters Print View immediately
    React.useEffect(() => {
        if (!permitNo) return;
        const workPermitComponent = (sectionsTemplate || [])
            .flatMap(s => s.components || [])
            .find(c => /work\s*permit\s*no/i.test(c.label));
        if (!workPermitComponent) return;
        const current = answers?.[workPermitComponent.id];
        if (current === undefined || current === "") {
            setAnswers(prev => ({ ...prev, [workPermitComponent.id]: permitNo }));
        }
    }, [permitNo, sectionsTemplate]);
    const [showPrint, setShowPrint] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const timeLocalRef = React.useRef({});
    
    // Filter out declaration sections for initial selection
    const initialVisibleSections = sectionsTemplate?.filter(s => 
        s.enabled !== false && 
        !s.id?.toLowerCase().includes('declaration') && 
        !s.title?.toLowerCase().includes('declaration')
    ) || [];
    
    const [selectedSection, setSelectedSection] = useState(initialVisibleSections?.[0]?.id || null);

    // Mobile detection and auto-collapse sidebar
    React.useEffect(() => {
        const checkScreenSize = () => {
            const mobile = window.innerWidth < 1024; // lg breakpoint
            setIsMobile(mobile);
            
            // Auto-collapse sidebar on mobile
            if (mobile) {
                setSidebarCollapsed(true);
            }
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    // Update selected section when sectionsTemplate changes
    React.useEffect(() => {
        const newVisibleSections = sectionsTemplate?.filter(s => 
            s.enabled !== false && 
            !s.id?.toLowerCase().includes('declaration') && 
            !s.title?.toLowerCase().includes('declaration')
        ) || [];
        
        if (newVisibleSections.length > 0 && !selectedSection) {
            setSelectedSection(newVisibleSections[0].id);
        }
    }, [sectionsTemplate, selectedSection]);

    const setValue = (id, value) => setAnswers(prev => ({ ...prev, [id]: value }));

    const toggleCheckbox = (id, option) => {
        setAnswers(prev => {
            const arr = Array.isArray(prev[id]) ? prev[id] : [];
            const exists = arr.includes(option);
            const next = exists ? arr.filter(o => o !== option) : [...arr, option];
            return { ...prev, [id]: next };
        });
    };

    // Filter out declaration sections for display (but keep them for print view)
    const visibleSections = sectionsTemplate?.filter(s => 
        s.enabled !== false && 
        !s.id?.toLowerCase().includes('declaration') && 
        !s.title?.toLowerCase().includes('declaration')
    ) || [];
    
    // Get current section
    const currentSection = visibleSections?.find(s => s.id === selectedSection);
    const currentSectionIndex = visibleSections?.findIndex(s => s.id === selectedSection) || 0;
    const totalSections = visibleSections?.length || 0;

    // Navigation handlers
    const handlePreviousSection = () => {
        if (currentSectionIndex > 0) {
            const previousSection = visibleSections[currentSectionIndex - 1];
            setSelectedSection(previousSection.id);
        }
    };

    const handleNextSection = () => {
        if (currentSectionIndex < totalSections - 1) {
            const nextSection = visibleSections[currentSectionIndex + 1];
            setSelectedSection(nextSection.id);
        }
    };

    // Render component based on type
    const renderComponent = (component) => {
                                const isToolsEquip = ((currentSection?.title || "").toLowerCase().includes("tools") && (currentSection?.title || "").toLowerCase().includes("equipment"))
                                    || ((component?.label || "").toLowerCase().includes("tools") && (component?.label || "").toLowerCase().includes("equipment"));
                                switch (component.type) {
                                    case "text":
                                    case "date":
                                        if (component.type === "text" && isToolsEquip) {
                                            const values = Array.isArray(answers[component.id]) ? answers[component.id] : Array(18).fill("");
                                            const setItem = (idx, val) => {
                                                setAnswers(prev => {
                                                    const arr = Array.isArray(prev[component.id]) ? [...prev[component.id]] : Array(18).fill("");
                                                    arr[idx] = val;
                                                    return { ...prev, [component.id]: arr };
                                                });
                                            };
                                            return (
                    <div key={component.id} className="space-y-2">
                        <Label className="text-sm sm:text-base font-semibold text-gray-700 flex items-center">
                            {component.label}
                            {component.required && <span className="text-red-500 ml-1 text-lg">*</span>}
                        </Label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {values.map((v, i) => (
                                <Input
                                    key={i}
                                    value={v || ""}
                                    onChange={e => setItem(i, e.target.value)}
                                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                />
                            ))}
                        </div>
                    </div>
                                            );
                                        }
                                        return (
                    <div key={component.id} className="space-y-2">
                        <Label className="text-sm sm:text-base font-semibold text-gray-700 flex items-center">
                            {component.label}
                            {component.required && <span className="text-red-500 ml-1 text-lg">*</span>}
                        </Label>
                                                <Input
                                                    type={component.type === "text" ? "text" : component.type}
                                                    value={answers[component.id] || ""}
                                                    onChange={e => setValue(component.id, e.target.value)}
                            required={component.required}
                            className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base"
                                                />
                                            </div>
                                        );
                                    case "time": {
                                        // Keep a per-field local buffer so typing isn't wiped while incomplete
                                        const local = (timeLocalRef.current[component.id] ?? (answers[component.id] || ""));
                                        const m = String(local).trim().match(/^(\d{0,2})(?::(\d{0,2}))?\s*(AM|PM)?$/i) || [];
                                        const hhStr = m[1] || "";
                                        const mmStr = m[2] || "";
                                        const apStr = (m[3] || "AM").toUpperCase();
                                        const hmDisplay = hhStr + (mmStr !== "" || local.includes(":") ? ":" + mmStr : "");
                                        const updateLocal = (nextHm, nextAp) => {
                                            const sanitizedHm = nextHm.replace(/[^0-9:]/g, "").slice(0,5);
                                            const parts = sanitizedHm.split(":");
                                            let nh = (parts[0] || "").slice(0,2);
                                            let nm = (parts[1] || "").slice(0,2);
                                            // Clamp softly
                                            const numH = parseInt(nh || "", 10);
                                            if (!isNaN(numH)) {
                                                if (numH < 1) nh = nh ? "01" : nh;
                                                if (numH > 12) nh = "12";
                                            }
                                            const numM = parseInt(nm || "", 10);
                                            if (!isNaN(numM)) {
                                                if (numM < 0) nm = "00";
                                                if (numM > 59) nm = "59";
                                            }
                                            const composedHm = nh + (sanitizedHm.includes(":") || nm ? ":" + nm : "");
                                            const composed = (composedHm ? (composedHm + " ") : "") + (nextAp || apStr);
                                            timeLocalRef.current[component.id] = composed;
                                            setValue(component.id, composed);
                                        };
                                        return (
                    <div key={component.id} className="space-y-2">
                        <Label className="text-sm sm:text-base font-semibold text-gray-700 flex items-center">
                            {component.label}
                            {component.required && <span className="text-red-500 ml-1 text-lg">*</span>}
                        </Label>
                        <div className="flex items-center gap-2">
                            <Input
                                type="text"
                                inputMode="numeric"
                                placeholder="hh:mm"
                                value={hmDisplay}
                                onChange={e => updateLocal(e.target.value, apStr)}
                                required={component.required}
                                className="w-28 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            />
                            <select
                                value={apStr}
                                onChange={e => updateLocal(hmDisplay, e.target.value.toUpperCase())}
                                className="px-3 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            >
                                <option>AM</option>
                                <option>PM</option>
                            </select>
                        </div>
                    </div>
                                        );
                                    }
                                    case "textarea":
                                        // Special handling for Tools & Equipment multi-line blanks
                                        if (isToolsEquip) {
                                            const values = Array.isArray(answers[component.id]) ? answers[component.id] : Array(18).fill("");
                                            const setItem = (idx, val) => {
                                                setAnswers(prev => {
                                                    const arr = Array.isArray(prev[component.id]) ? [...prev[component.id]] : Array(18).fill("");
                                                    arr[idx] = val;
                                                    return { ...prev, [component.id]: arr };
                                                });
                                            };
                                            return (
                    <div key={component.id} className="space-y-2">
                        <Label className="text-sm sm:text-base font-semibold text-gray-700 flex items-center">
                            {component.label}
                            {component.required && <span className="text-red-500 ml-1 text-lg">*</span>}
                        </Label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {values.map((v, i) => (
                                <Input
                                    key={i}
                                    value={v || ""}
                                    onChange={e => setItem(i, e.target.value)}
                                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                />
                            ))}
                        </div>
                    </div>
                                            );
                                        }
                                        return (
                    <div key={component.id} className="space-y-2">
                        <Label className="text-sm sm:text-base font-semibold text-gray-700 flex items-center">
                            {component.label}
                            {component.required && <span className="text-red-500 ml-1 text-lg">*</span>}
                        </Label>
                                                <textarea
                            className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical text-sm sm:text-base"
                                                    rows={4}
                                                    value={answers[component.id] || ""}
                                                    onChange={e => setValue(component.id, e.target.value)}
                            required={component.required}
                            placeholder="Enter your response here..."
                                                />
                                            </div>
                                        );
                                    case "checkbox":
                                        return (
                    <div key={component.id} className="space-y-3">
                        <Label className="text-sm sm:text-base font-semibold text-gray-700 flex items-center">
                            {component.label}
                            {component.required && <span className="text-red-500 ml-1 text-lg">*</span>}
                        </Label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                                                    {(component.options || []).map(opt => (
                                <label key={opt} className="flex items-center space-x-3 p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors touch-manipulation">
                                                            <input
                                                                type="checkbox"
                                                                checked={(answers[component.id] || []).includes(opt)}
                                                                onChange={() => toggleCheckbox(component.id, opt)}
                                        className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                            />
                                    <span className="text-sm sm:text-base text-gray-700">{opt}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    case "radio":
                                        return (
                    <div key={component.id} className="space-y-3">
                        <Label className="text-sm sm:text-base font-semibold text-gray-700 flex items-center">
                            {component.label}
                            {component.required && <span className="text-red-500 ml-1 text-lg">*</span>}
                        </Label>
                        <div className="space-y-2">
                                                    {(component.options || []).map(opt => (
                                <label key={opt} className="flex items-center space-x-3 p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors touch-manipulation">
                                                            <input
                                                                type="radio"
                                                                name={component.id}
                                                                checked={answers[component.id] === opt}
                                                                onChange={() => setValue(component.id, opt)}
                                        required={component.required}
                                        className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                                                            />
                                    <span className="text-sm sm:text-base text-gray-700">{opt}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    default:
                                        if (isToolsEquip) {
                                            const values = Array.isArray(answers[component.id]) ? answers[component.id] : Array(18).fill("");
                                            const setItem = (idx, val) => {
                                                setAnswers(prev => {
                                                    const arr = Array.isArray(prev[component.id]) ? [...prev[component.id]] : Array(18).fill("");
                                                    arr[idx] = val;
                                                    return { ...prev, [component.id]: arr };
                                                });
                                            };
                                            return (
                    <div key={component.id} className="space-y-2">
                        <Label className="text-sm sm:text-base font-semibold text-gray-700 flex items-center">
                            {component.label}
                            {component.required && <span className="text-red-500 ml-1 text-lg">*</span>}
                        </Label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {values.map((v, i) => (
                                <Input
                                    key={i}
                                    value={v || ""}
                                    onChange={e => setItem(i, e.target.value)}
                                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                />
                            ))}
                        </div>
                    </div>
                                            );
                                        }
                                        return (
                    <div key={component.id} className="space-y-2">
                        <Label className="text-sm sm:text-base font-semibold text-gray-700 flex items-center">
                            {component.label}
                            {component.required && <span className="text-red-500 ml-1 text-lg">*</span>}
                        </Label>
                                                <Input
                                                    value={answers[component.id] || ""}
                                                    onChange={e => setValue(component.id, e.target.value)}
                            required={component.required}
                            className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base"
                                                />
                                            </div>
                                        );
                                }
    };

    if (showPrint) {
        const formData = { title, sections: sectionsTemplate || [], answers };
        return (
            <PrintView formData={formData} onToggleView={() => setShowPrint(false)} />
        );
    }

    return (
        <div className={cn("bg-gray-50 flex overflow-hidden", containerClassName ? containerClassName : "h-screen") }>
            {/* Desktop Sidebar */}
            <div className={cn(
                "bg-white border-r border-gray-200 flex flex-col transition-all duration-300 shadow-sm h-full",
                sidebarCollapsed ? "w-16" : "w-72",
                "hidden lg:flex" // Hide on mobile/tablet, show on desktop
            )}>
                {/* Sidebar Header */}
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                        {!sidebarCollapsed && (
                            <h2 className="text-lg font-semibold text-gray-900">Form Sections</h2>
                        )}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                            className="p-2 hover:bg-gray-200 rounded-md"
                        >
                            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                        </Button>
                    </div>
                </div>

                {/* Sections List */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    {visibleSections.map((section, index) => (
                        <div
                            key={section.id}
                            className={cn(
                                "p-3 rounded-lg cursor-pointer transition-all duration-200 border",
                                selectedSection === section.id 
                                    ? "bg-blue-50 border-blue-300 shadow-md" 
                                    : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm"
                            )}
                            onClick={() => setSelectedSection(section.id)}
                        >
                            <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0">
                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center",
                                        selectedSection === section.id 
                                            ? "bg-blue-100 text-blue-600" 
                                            : "bg-gray-100 text-gray-600"
                                    )}>
                                        {getSectionIcon(section.title)}
                                    </div>
                                </div>
                                {!sidebarCollapsed && (
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate flex items-center gap-2">
                                            {getSectionIcon(section.title, "w-4 h-4 text-gray-600")}
                                            <span className="truncate">{section.title}</span>
                                        </p>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            {section.components?.length || 0} fields
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Mobile/Tablet Sidebar Toggle */}
                <div className="lg:hidden bg-white border-b border-gray-200 p-3 flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                            className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-50"
                        >
                            <span className="text-sm font-medium">Sections</span>
                            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                        </Button>
                        <div className="flex items-center space-x-2">
                            <div className="text-sm text-gray-600 font-medium">
                                {currentSection && `${currentSectionIndex + 1}/${totalSections}`}
                            </div>
                            <div className="w-16 bg-gray-200 rounded-full h-1.5">
                                <div 
                                    className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                                    style={{ width: `${((currentSectionIndex + 1) / totalSections) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile/Tablet Sidebar Overlay */}
                {!sidebarCollapsed && (
                    <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setSidebarCollapsed(true)}>
                        <div className="bg-white w-full sm:w-96 h-full shadow-xl animate-in slide-in-from-left duration-300" onClick={(e) => e.stopPropagation()}>
                            <div className="p-4 border-b border-gray-200 bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900">Form Sections</h2>
                                        <p className="text-sm text-gray-600 mt-1">Select a section to continue</p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setSidebarCollapsed(true)}
                                        className="p-2 hover:bg-gray-200 rounded-md"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                {visibleSections.map((section, index) => (
                                    <div
                                        key={section.id}
                                        className={cn(
                                            "p-4 rounded-lg cursor-pointer transition-all duration-200 border-2 touch-manipulation",
                                            selectedSection === section.id 
                                                ? "bg-blue-50 border-blue-400 shadow-lg" 
                                                : "bg-white border-gray-200 hover:border-blue-200 hover:shadow-md active:bg-blue-25"
                                        )}
                                        onClick={() => {
                                            setSelectedSection(section.id);
                                            setSidebarCollapsed(true);
                                        }}
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="flex-shrink-0">
                                                <div className={cn(
                                                    "w-10 h-10 rounded-full flex items-center justify-center font-bold",
                                                    selectedSection === section.id 
                                                        ? "bg-blue-500 text-white shadow-md" 
                                                        : "bg-gray-200 text-gray-700"
                                                )}>
                                                    {getSectionIcon(section.title, "w-5 h-5")}
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-base font-medium text-gray-900 truncate flex items-center gap-2">
                                                    {getSectionIcon(section.title, "w-4 h-4 text-gray-600")}
                                                    <span className="truncate">{section.title}</span>
                                                </p>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {section.components?.length || 0} fields
                                                </p>
                                            </div>
                                            {selectedSection === section.id && (
                                                <div className="flex-shrink-0">
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Fixed Header */}
                <div className="bg-white border-b border-gray-200 p-3 sm:p-4 lg:p-6 flex-shrink-0 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">{title || "Work Permit"}</h1>
                            {currentSection && (
                                <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 w-fit">
                                        Section {currentSectionIndex + 1} of {totalSections}
                                    </span>
                                    <span className="text-sm text-gray-600 truncate">
                                        {currentSection.title}
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3">
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => setShowPrint(true)} 
                                className="px-3 sm:px-4 py-2 border-gray-300 hover:bg-gray-50 text-xs sm:text-sm"
                            >
                                <span className="hidden sm:inline">Print View</span>
                                <span className="sm:hidden">Print</span>
                            </Button>
                            <Button 
                                size="sm" 
                                onClick={() => onSubmit && onSubmit(answers)} 
                                disabled={isSubmitting} 
                                className="px-4 sm:px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs sm:text-sm"
                            >
                                {isSubmitting ? "Submitting..." : "Submit Form"}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Scrollable Section Content */}
                <div className="flex-1 overflow-y-auto bg-gray-50">
                    {currentSection ? (
                        <div className="max-w-5xl mx-auto p-3 sm:p-4 lg:p-8">
                            <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl shadow-sm">
                                <div className="border-b border-gray-200 px-3 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-6 bg-gray-50 rounded-t-lg sm:rounded-t-xl">
                                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{currentSection.title}</h2>
                                    <p className="text-sm text-gray-600 mt-2">
                                        Complete all fields in this section. Required fields are marked with a red asterisk (*).
                                    </p>
                                </div>
                                <div className="p-3 sm:p-4 lg:p-8 space-y-4 sm:space-y-6 lg:space-y-8">
                                    {(currentSection.components || []).filter(c => c.enabled !== false).map(renderComponent)}
                                </div>
                            </div>

                            {/* Navigation Buttons */}
                            <div className="mt-4 sm:mt-6 lg:mt-8 space-y-3 sm:space-y-4 lg:space-y-0">
                                <div className="flex flex-col lg:flex-row justify-between items-center space-y-3 sm:space-y-4 lg:space-y-0">
                                    <Button
                                        variant="outline"
                                        onClick={handlePreviousSection}
                                        disabled={currentSectionIndex === 0}
                                        className="flex items-center space-x-2 px-3 sm:px-4 lg:px-6 py-2 sm:py-2 lg:py-3 border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed w-full lg:w-auto text-sm sm:text-base"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                        <span className="hidden sm:inline">Previous Section</span>
                                        <span className="sm:hidden">Previous</span>
                                    </Button>
                                    
                                    <div className="flex items-center space-x-2 sm:space-x-3">
                                        <div className="text-xs sm:text-sm text-gray-500 font-medium">
                                            Progress: {currentSectionIndex + 1} of {totalSections}
                                        </div>
                                        <div className="w-20 sm:w-24 lg:w-32 bg-gray-200 rounded-full h-2">
                                            <div 
                                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${((currentSectionIndex + 1) / totalSections) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    
                                    <Button
                                        variant="outline"
                                        onClick={handleNextSection}
                                        disabled={currentSectionIndex === totalSections - 1}
                                        className="flex items-center space-x-2 px-3 sm:px-4 lg:px-6 py-2 sm:py-2 lg:py-3 border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed w-full lg:w-auto text-sm sm:text-base"
                                    >
                                        <span className="hidden sm:inline">Next Section</span>
                                        <span className="sm:hidden">Next</span>
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center text-gray-500 max-w-md">
                                <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                                    <FileText className="w-10 h-10 text-gray-400" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3 text-gray-700">No section selected</h3>
                                <p className="text-gray-500">Select a section from the sidebar to start filling the form</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FormFiller;


