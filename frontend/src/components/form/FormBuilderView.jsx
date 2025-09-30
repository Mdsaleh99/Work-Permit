import React, { useState, useEffect } from "react";
import { FileText, ClipboardList, Wrench, Shield, ShieldCheck, AlertTriangle, ListChecks, Printer } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import PrintView from "./PrintView";
import { workPermitService } from "@/services/workPermit.service";

/**
 * Read-only Builder View for Work Permit forms.
 * Props:
 * - title: string
 * - sectionsTemplate: array of sections with components (from backend)
 */
export default function FormBuilderView({ title, sectionsTemplate, workPermit, workPermitId }) {
    const getSectionIcon = (title, className = "w-4 h-4 mr-2 text-gray-600") => {
        const t = (title || "").toLowerCase();
        if (t.includes("work description")) return <ClipboardList className={className} />;
        if (t.includes("tools") || t.includes("equipment")) return <Wrench className={className} />;
        if (t.includes("ppe")) return <Shield className={className} />;
        if (t.includes("hazard")) return <AlertTriangle className={className} />;
        if (t.includes("safe system")) return <ShieldCheck className={className} />;
        if (t.includes("last minute") || t.includes("risk assessment")) return <ListChecks className={className} />;
        return <FileText className={className} />;
    };
    
    // State for Print View and submission data
    const [showPrintView, setShowPrintView] = useState(false);
    const [submittedData, setSubmittedData] = useState(null);
    const [loadingSubmissions, setLoadingSubmissions] = useState(false);
    
    const [formData, setFormData] = React.useState(() => ({
        title: title || "GENERAL WORK PERMIT",
        sections: Array.isArray(sectionsTemplate) ? sectionsTemplate : [],
        selectedSection: (Array.isArray(sectionsTemplate) && sectionsTemplate[0]?.id) || null,
    }));

    React.useEffect(() => {
        setFormData({
            title: title || "GENERAL WORK PERMIT",
            sections: Array.isArray(sectionsTemplate) ? sectionsTemplate : [],
            selectedSection: (Array.isArray(sectionsTemplate) && sectionsTemplate[0]?.id) || null,
        });
    }, [title, sectionsTemplate]);

    // Load submission data when workPermitId is available
    useEffect(() => {
        if (workPermitId) {
            const loadSubmissions = async () => {
                setLoadingSubmissions(true);
                try {
                    const submissions = await workPermitService.listSubmissions(workPermitId);
                    console.log('FormBuilderView - Loaded submissions:', submissions);
                    if (submissions?.data && submissions.data.length > 0) {
                        // Get the latest submission
                        const latestSubmission = submissions.data[0];
                        console.log('FormBuilderView - Latest submission:', latestSubmission);
                        setSubmittedData(latestSubmission.answers);
                    } else {
                        console.log('FormBuilderView - No submissions found');
                        setSubmittedData(null);
                    }
                } catch (error) {
                    console.error('Error loading submissions:', error);
                    setSubmittedData(null);
                } finally {
                    setLoadingSubmissions(false);
                }
            };
            loadSubmissions();
        }
    }, [workPermitId]);

    // Render Print View if enabled
    if (showPrintView) {
        // Ensure Work Permit No is visible in PrintView even when no submitted data
        const printFormData = (() => {
            try {
                const wpNo = workPermit?.workPermitNo;
                console.log('FormBuilderView Print View - Work Permit No:', wpNo);
                console.log('FormBuilderView Print View - workPermit object:', workPermit);
                console.log('FormBuilderView Print View - formData sections:', formData.sections);
                
                if (!wpNo) {
                    console.log('No Work Permit No found, returning original formData');
                    return {
                        title: formData.title,
                        sections: formData.sections,
                        answers: submittedData || null // Use null instead of empty object
                    };
                }
                
                const sections = Array.isArray(formData?.sections) ? formData.sections : [];
                let patched = false;
                const nextSections = sections.map((sec) => {
                    const comps = Array.isArray(sec.components) ? sec.components : [];
                    let didPatchSection = false;
                    const nextComps = comps.map((c) => {
                        if (/work\s*permit\s*no/i.test(c?.label || "")) {
                            const currentVal = c?.value ?? c?.text ?? "";
                            console.log('Found Work Permit No component:', c.label, 'Current value:', currentVal, 'Will inject:', wpNo);
                            if (!currentVal) {
                                didPatchSection = true;
                                return { ...c, value: wpNo, enabled: false };
                            }
                        }
                        return c;
                    });
                    if (didPatchSection) patched = true;
                    return didPatchSection ? { ...sec, components: nextComps } : sec;
                });
                
                if (!patched) {
                    return {
                        title: formData.title,
                        sections: formData.sections,
                        answers: submittedData || null // Use null instead of empty object
                    };
                }
                
                console.log('Work Permit No patched successfully');
                return { 
                    title: formData.title,
                    sections: nextSections,
                    answers: submittedData || null // Use null instead of empty object
                };
            } catch {
                return {
                    title: formData.title,
                    sections: formData.sections,
                    answers: submittedData || null // Use null instead of empty object
                };
            }
        })();
        
        console.log('FormBuilderView Print View - Final printFormData:', printFormData);
        console.log('FormBuilderView Print View - Submitted data:', submittedData);
        
        return (
            <div className="min-h-screen bg-white">
                <PrintView 
                    formData={printFormData} 
                    closureData={workPermit?.closureData}
                    onToggleView={() => setShowPrintView(false)} 
                />
            </div>
        );
    }

    return (
        <div className="h-screen bg-gray-50 flex flex-col">
            {/* Header (read-only, no buttons) */}
            <div className="bg-white border-b border-gray-200 shadow-sm">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg md:text-xl font-bold text-gray-900 truncate">
                            {formData.title}
                        </h2>
                        <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => setShowPrintView(true)} 
                            className="cursor-pointer"
                            disabled={loadingSubmissions}
                        >
                            <Printer className="w-4 h-4 mr-2" />
                            {loadingSubmissions ? "Loading..." : "Print View"}
                        </Button>
                    </div>
                    {workPermit && (
                        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-700">
                            {/* <div className="bg-gray-50 border rounded-md p-3">
                                <div className="text-gray-500">Permit ID</div>
                                <div className="font-medium break-all">{workPermit.id}</div>
                            </div> */}
                            <div className="bg-gray-50 border rounded-md p-3">
                                <div className="text-gray-500">Created</div>
                                <div className="font-medium">{workPermit.createdAt ? new Date(workPermit.createdAt).toLocaleString() : '-'}</div>
                            </div>
                            <div className="bg-gray-50 border rounded-md p-3">
                                <div className="text-gray-500">Updated</div>
                                <div className="font-medium">{workPermit.updatedAt ? new Date(workPermit.updatedAt).toLocaleString() : '-'}</div>
                            </div>
                            <div className="bg-gray-50 border rounded-md p-3">
                                <div className="text-gray-500">Sections / Components</div>
                                <div className="font-medium">
                                    {(formData.sections || []).length} sections • {formData.sections.reduce((sum, s) => sum + (s.components?.length || 0), 0)} components
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-1 overflow-hidden">
                {/* Left Sidebar - Sections list (read-only) */}
                <div className={cn("w-72 bg-white border-r border-gray-200 flex-shrink-0 overflow-y-auto")}> 
                    <div className="p-4">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Sections</h3>
                        <div className="space-y-1">
                            {formData.sections.map((section) => (
                                <button
                                    key={section.id}
                                    className={cn(
                                        "w-full text-left px-3 py-2 rounded-md text-sm",
                                        formData.selectedSection === section.id
                                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                                            : "hover:bg-gray-50 text-gray-700 border border-transparent"
                                    )}
                                    onClick={() => setFormData((prev) => ({ ...prev, selectedSection: section.id }))}
                                >
                                    <span className="inline-flex items-center">
                                        {getSectionIcon(section.title)}
                                        <span className="truncate">{section.title}</span>
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Center - Section content (strict read-only) */}
                <div className="flex-1 overflow-hidden">
                    <div className="h-full overflow-y-auto p-6">
                        {(() => {
                            const selected = formData.sections.find(s => s.id === formData.selectedSection);
                            if (!selected) return null;
                            return (
                                <div className="max-w-4xl mx-auto">
                                    <div className="mb-6">
                                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{selected.title}</h2>
                                        <p className="text-gray-600">{selected.components?.length || 0} components</p>
                                    </div>
                                    <div className="space-y-4">
                                        {(selected.components || []).map((c) => (
                                            <div key={c.id} className="border rounded-md p-4 bg-white">
                                                <div className="text-sm font-medium text-gray-900 mb-2">
                                                    {c.label}
                                                    {c.required && (<span className="text-red-600"> *</span>)}
                                                </div>
                                                {(['checkbox','radio'].includes(c.type)) && (
                                                    <div className="flex flex-wrap gap-2">
                                                        {(c.options || []).map((opt, idx) => (
                                                            <span key={idx} className="px-2 py-1 text-xs rounded-full border border-gray-200 bg-gray-50 text-gray-700">{opt}</span>
                                                        ))}
                                                        {(!c.options || c.options.length === 0) && (
                                                            <span className="text-xs text-gray-500">No options</span>
                                                        )}
                                                    </div>
                                                )}
                                                {c.type === 'table' && (
                                                    <div className="text-xs text-gray-600">Table</div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                </div>
            </div>
        </div>
    );
}


