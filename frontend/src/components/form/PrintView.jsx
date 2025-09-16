import React from "react";
import { useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import { Button } from "../ui/button";
import { Printer, ArrowLeft } from "lucide-react";

// COMPONENT JSX (No changes, this logic is stable)
const PrintView = ({ formData, customSectionNames = {}, builderPath = "/page/app/form-builder", onToggleView }) => {
    const navigate = useNavigate();
    if (!formData) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">No form data available</p>
            </div>
        );
    }
    
    const getSectionDisplayName = (sectionId) => {
        if (customSectionNames[sectionId]) {
            return customSectionNames[sectionId].toUpperCase();
        }
        const defaultDisplayNames = {
            'work-description': 'WORK DESCRIPTION',
            'tools-equipment': 'TOOLS & EQUIPMENT',
            'ppe-checklist': 'PPE',
            'hazard-identification': 'HAZARD IDENTIFICATION',
            'certificate': 'CERTIFICATE',
            'safe-system-work': 'SSOW',
            'last-minute-risk': 'LMRA',
            'declaration': 'DECLARATION',
            'opening-ptw': 'OPENING/PTW',
            'closure': 'CLOSURE'
        };
        return defaultDisplayNames[sectionId] || sectionId.toUpperCase();
    };

    const renderComponent = (component, sectionId) => {
        const answers = formData?.answers || null;
        const answerVal = answers ? answers[component.id] : undefined;
        // This entire function is stable and correct. No changes.
        switch (component.type) {
            case 'text':
                return (
                    <div className={`ptw-component-inner ${['work-description', 'tools-equipment', 'certificate'].includes(sectionId) ? 'ptw-field-horizontal' : ''}`}>
                        <div className="ptw-label">{component.label}:</div>
                        {answers ? (
                            <div className="ptw-input-line"><span style={{visibility:'visible'}}>{String(answerVal || '')}</span></div>
                        ) : (
                            <div className="ptw-input-line"></div>
                        )}
                    </div>
                );
            case 'textarea':
                return (
                    <div className="ptw-component-inner">
                        <div className="ptw-label">{component.label}:</div>
                        {answers ? (
                            <div className="ptw-textarea"><span style={{visibility:'visible'}}>{String(answerVal || '')}</span></div>
                        ) : (
                            <div className="ptw-textarea"></div>
                        )}
                    </div>
                );
            case 'date':
                return (
                    <div className={`ptw-component-inner ${['work-description', 'declaration', 'opening-ptw', 'closure'].includes(sectionId) ? 'ptw-field-horizontal' : ''}`}>
                        <div className="ptw-label">{component.label}:</div>
                        {answers ? (
                            <div className="ptw-input-line"><span style={{visibility:'visible'}}>{String(answerVal || '')}</span></div>
                        ) : (
                            <div className="ptw-input-line"></div>
                        )}
                    </div>
                );
            case 'time':
                 return (
                    <div className={`ptw-component-inner ${['work-description', 'opening-ptw', 'closure'].includes(sectionId) ? 'ptw-field-horizontal' : ''}`}>
                        <div className="ptw-label">{component.label}:</div>
                        {answers ? (
                            <div className="ptw-input-line"><span style={{visibility:'visible'}}>{String(answerVal || '')}</span></div>
                        ) : (
                            <div className="ptw-input-line"></div>
                        )}
                    </div>
                );
            case 'checkbox':
                return (
                    <div className="ptw-component-inner">
                        <div className="ptw-label mb-2">{component.label}:</div>
                        <div className="ptw-checkbox-grid">
                            {component.options && component.options.map((option, index) => (
                                <div key={index} className="ptw-checkbox-item">
                                    <div className="ptw-checkbox">{answers && Array.isArray(answerVal) && answerVal.includes(option) ? '☑' : '☐'}</div>
                                    <span className="ptw-checkbox-label">{option}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'radio':
                return (
                    <div className="ptw-component-inner">
                        <div className="ptw-label mb-2">{component.label}:</div>
                        <div className="ptw-radio-group">
                            {component.options && component.options.map((option, index) => (
                                <div key={index} className="ptw-radio-item">
                                    <div className="ptw-radio">{answers && answerVal === option ? '■' : '□'}</div>
                                    <span className="ptw-radio-label">{option}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'signature':
                 return (
                    <div className={`ptw-component-inner ptw-field-horizontal`}>
                        <div className="ptw-label">{component.label}:</div>
                        <div className="ptw-signature-line"></div>
                    </div>
                );
            case 'header':
                return (
                    <div className="ptw-component-inner">
                        <div className="ptw-section-subtitle">{component.label}</div>
                    </div>
                );
            default:
                return (
                    <div className="ptw-component-inner">
                        <div className="ptw-label">{component.label}:</div>
                        <div className="ptw-input-line"></div>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Print Controls - Only visible on screen, hidden when printing */}
            <div className="no-print bg-white border-b border-gray-200 p-4 sticky top-0 z-50">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onToggleView ? onToggleView() : navigate({ to: builderPath })}
                            className="flex items-center space-x-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Back to Builder</span>
                        </Button>
                        <h3 className="text-lg font-semibold text-gray-900">
                            Print Preview: {formData.title || "GENERAL WORK PERMIT"}
                        </h3>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Button
                            size="sm"
                            onClick={() => window.print()}
                            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2"
                        >
                            <Printer className="w-4 h-4" />
                            <span>Print</span>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Print Form */}
            <div className="ptw-form-print no-print:w-[210mm] no-print:mx-auto no-print:bg-white no-print:shadow no-print:p-2">
            {/* Header, Main Content, and Footer will now stack as simple blocks */ }
            <div className="ptw-header">
                <div className="ptw-header-left">
                    <div className="ptw-doc-info">
                        <div>Doc Ref No: xxxxxxxxxxx</div>
                        <div>Issue Date: {format(new Date(), "dd/MM/yyyy")}</div>
                        <div>Rev No: 01</div>
                    </div>
                </div>
                <div className="ptw-header-center">
                    <div className="ptw-title">{formData.title || "GENERAL WORK PERMIT"}</div>
                </div>
                <div className="ptw-header-right">
                    <div className="ptw-logo">
                        {formData.logoSrc ? (
                            <img src={formData.logoSrc} alt="Company Logo" className="ptw-logo-img" />
                        ) : (
                            <span className="ptw-logo-text">expertise</span>
                        )}
                    </div>
                </div>
            </div>

            <div className="ptw-main-content">
                {formData.sections && formData.sections.length > 0 ? (
                    formData.sections
                        .filter(section => section.enabled !== false)
                        .map((section) => (
                            <div key={section.id} className="ptw-section-row" data-section={section.id}>
                                <div className="ptw-sidebar-label-wrapper">
                                    <div className="ptw-sidebar-label">
                                        {getSectionDisplayName(section.id)}
                                    </div>
                                </div>
                                <div className="ptw-content-wrapper">
                                    {section.components && section.components.length > 0 ? (
                                        <div className="ptw-component-wrapper">
                                            {section.components
                                                .filter(component => component.enabled !== false)
                                                .map((component) => (
                                                    <div key={component.id} className="ptw-component">
                                                        {renderComponent(component, section.id)}
                                                    </div>
                                                ))}
                                        </div>
                                    ) : (
                                        <div className="ptw-label text-gray-500">No components configured.</div>
                                    )}
                                </div>
                            </div>
                        ))
                ) : (
                    <div className="ptw-section-row">
                         <div className="ptw-sidebar-label-wrapper">
                             <div className="ptw-sidebar-label">NO SECTIONS</div>
                         </div>
                         <div className="ptw-content-wrapper">
                             <div className="ptw-label text-gray-500">No sections have been configured.</div>
                         </div>
                    </div>
                )}
            </div>

            <div className="ptw-footer">
                <div className="ptw-footer-content">
                    <div>The permit content fits on one A4 page.</div>
                    <div>Page 1 of X</div>
                </div>
            </div>

            {/* ================================================================
            === CSS UPDATED TO USE BLOCK LAYOUT FOR PRINTING =================
            ================================================================ */}
            <style jsx>{`
                /* --- Base Form & Header --- */
                .ptw-form-print {
                    width: 210mm;
                    min-height: 297mm; /* Set a min-height for screen, but allow it to grow */
                    margin: 0 auto;
                    background: white;
                    font-family: Arial, sans-serif;
                    font-size: 10px;
                    line-height: 1.2;
                    color: #000;
                    border: 2px solid #000;
                    box-sizing: border-box;
                    /* REMOVED: display: flex and flex-direction. Let it be a simple block. */
                }
                .ptw-header {
                    display: flex; /* Flex is fine INSIDE the header */
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 2px solid #000;
                    padding: 8px;
                    box-sizing: border-box;
                    page-break-inside: avoid; /* Don't split the header */
                }
                .ptw-header-left { flex: 1; }
                .ptw-doc-info div { font-size: 9px; }
                .ptw-header-center { flex: 2; text-align: center; }
                .ptw-title { font-size: 18px; font-weight: bold; text-transform: uppercase; }
                .ptw-header-right { flex: 1; text-align: right; }
                .ptw-logo-text { font-size: 12px; font-weight: bold; color: #0066cc; }
                .ptw-logo-img { height: 24px; width: auto; object-fit: contain; }

                /* --- Core Row Layout --- */
                .ptw-main-content {
                    /* REMOVED: display: flex, flex-direction, and flex: 1 */
                    /* This is now just a simple div, allowing its children to break across pages */
                    width: 100%;
                    box-sizing: border-box;
                }
                .ptw-section-row {
                    display: flex; /* Flex is needed HERE to put label + content side-by-side */
                    flex-direction: row;
                    border-bottom: 1px solid #999;
                    width: 100%;
                    box-sizing: border-box;
                    page-break-inside: avoid !important; /* This rule will now work */
                }
                .ptw-section-row:last-child { border-bottom: none; }

                /* 1. Sidebar Label Wrapper */
                .ptw-sidebar-label-wrapper {
                    width: 25mm;
                    flex-shrink: 0;
                    border-right: 2px solid #000;
                    background: #333;
                    color: #fff;
                    display: flex; /* Use flex to center the vertical text */
                    align-items: center;
                    justify-content: center;
                    padding: 4px 0;
                    box-sizing: border-box;
                }
                .ptw-sidebar-label {
                    writing-mode: vertical-rl;
                    transform: rotate(180deg);
                    font-size: 10px;
                    font-weight: bold;
                    text-align: center;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    padding: 8px 0;
                }
                
                /* 2. Content Wrapper */
                .ptw-content-wrapper {
                    flex: 1 1 auto;
                    padding: 8px 10px;
                    background: #fff;
                    box-sizing: border-box;
                    width: calc(100% - 25mm);
                }
                
                .ptw-component-wrapper {
                     display: flex;
                     flex-direction: column;
                     gap: 4px;
                }
                .ptw-component-inner { width: 100%; }

                /* --- Base Component Styles --- */
                .ptw-label { font-size: 9px; font-weight: bold; margin-bottom: 2px; display: block; }
                .ptw-input-line { border-bottom: 1px solid #000; height: 12px; margin-bottom: 5px; }
                .ptw-textarea { border: 1px solid #000; height: 30px; margin-bottom: 5px; }
                .ptw-signature-line { border-bottom: 1px solid #000; height: 20px; margin-bottom: 5px; }
                .ptw-checkbox-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px; }
                .ptw-checkbox-item, .ptw-radio-item { display: flex; align-items: center; font-size: 9px; }
                .ptw-checkbox, .ptw-radio { margin-right: 4px; font-size: 11px; }
                .ptw-checkbox-label, .ptw-radio-label { font-size: 9px; }
                .ptw-radio-group { display: flex; gap: 12px; }
                .ptw-section-subtitle { font-weight: bold; font-size: 9px; }

                .ptw-footer { 
                    border-top: 2px solid #000; 
                    padding: 5px 8px; 
                    box-sizing: border-box; 
                    page-break-inside: avoid; /* Don't split the footer */
                }
                .ptw-footer-content { display: flex; justify-content: space-between; font-size: 8px; }

                /* ================================================================
                === DYNAMIC GRID & LAYOUT OVERRIDES (Same as before) ==========
                ================================================================ */

                .ptw-field-horizontal { display: flex; flex-direction: row; align-items: baseline; gap: 5px; }
                .ptw-field-horizontal .ptw-label { margin-bottom: 0; flex-shrink: 0; white-space: nowrap; }
                .ptw-field-horizontal .ptw-input-line,
                .ptw-field-horizontal .ptw-signature-line { flex: 1 1 auto; }

                .ptw-section-row[data-section="work-description"] .ptw-component-wrapper {
                    display: grid; grid-template-columns: repeat(6, 1fr); gap: 5px 10px;
                }
                .ptw-section-row[data-section="work-description"] .ptw-component:nth-child(1) { grid-column: span 2; }
                .ptw-section-row[data-section="work-description"] .ptw-component:nth-child(2) { grid-column: span 2; }
                .ptw-section-row[data-section="work-description"] .ptw-component:nth-child(3) { grid-column: span 2; }
                .ptw-section-row[data-section="work-description"] .ptw-component:nth-child(4) { grid-column: span 3; }
                .ptw-section-row[data-section="work-description"] .ptw-component:nth-child(5) { grid-column: span 3; }
                .ptw-section-row[data-section="work-description"] .ptw-component:nth-child(6) { grid-column: span 2; }
                .ptw-section-row[data-section="work-description"] .ptw-component:nth-child(7) { grid-column: span 1; }
                .ptw-section-row[data-section="work-description"] .ptw-component:nth-child(8) { grid-column: span 2; }
                .ptw-section-row[data-section="work-description"] .ptw-component:nth-child(9) { grid-column: span 1; }
                .ptw-section-row[data-section="work-description"] .ptw-component:nth-child(10) { grid-column: span 6; }
                 .ptw-section-row[data-section="work-description"] .ptw-component:nth-child(10) .ptw-component-inner { display: block; }

                .ptw-section-row[data-section="tools-equipment"] .ptw-component-wrapper {
                    display: grid; grid-template-columns: repeat(6, 1fr); gap: 0 10px;
                }

                /* --- PPE (YOUR REQUEST: 4 COLS) --- */
                .ptw-section-row[data-section="ppe-checklist"] .ptw-checkbox-grid {
                    grid-template-columns: repeat(4, 1fr);
                }

                /* --- HAZARD ID (YOUR REQUEST: 5 COLS) --- */
                .ptw-section-row[data-section="hazard-identification"] .ptw-checkbox-grid {
                    grid-template-columns: repeat(5, 1fr);
                }

                .ptw-section-row[data-section="certificate"] .ptw-component-wrapper {
                    display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px 10px;
                }
                 .ptw-section-row[data-section="certificate"] .ptw-component { display: flex; flex-direction: column; }

                .ptw-section-row[data-section="last-minute-risk"] .ptw-component-wrapper {
                    display: grid; grid-template-columns: repeat(2, 1fr); gap: 5px 15px;
                }

                .ptw-section-row[data-section="declaration"] .ptw-component-wrapper {
                    display: grid; grid-template-columns: 1fr 1fr; gap: 5px 15px;
                }
                .ptw-section-row[data-section="declaration"] .ptw-component:nth-child(1) { grid-column: 1 / -1; }
                .ptw-section-row[data-section="declaration"] .ptw-component:nth-child(2) { grid-column: 1; grid-row: 2; }
                .ptw-section-row[data-section="declaration"] .ptw-component:nth-child(3) { grid-column: 2; grid-row: 2; }
                .ptw-section-row[data-section="declaration"] .ptw-component:nth-child(4) { grid-column: 2; grid-row: 3; }

                .ptw-section-row[data-section="opening-ptw"] .ptw-component-wrapper {
                    display: grid; grid-template-columns: 1fr 1fr; gap: 5px 15px;
                }
                .ptw-section-row[data-section="opening-ptw"] .ptw-component:first-child { grid-column: 1 / -1; }

                .ptw-section-row[data-section="closure"] .ptw-component-wrapper {
                    display: grid; grid-template-columns: 1fr 1fr; gap: 5px 15px;
                }
                
                /* --- Print Media Query (Updated for multi-page) --- */
                @media print {
                   html, body {
                       margin: 0;
                       padding: 0;
                       background: #fff; /* Ensure background is white */
                   }
                   .ptw-form-print {
                       width: 100%;
                       min-height: auto;
                       margin: 0;
                       padding: 0;
                       border: none;
                       box-shadow: none;
                   }
                   .no-print {
                       display: none !important;
                   }
                }
            `}</style>
            </div>
        </div>
    );
};

export default PrintView;