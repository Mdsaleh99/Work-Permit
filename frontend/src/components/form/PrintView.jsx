import React from "react";
import { useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import { Button } from "../ui/button";
import { Printer, ArrowLeft } from "lucide-react";

// Printable Content Component
const PrintableContent = React.forwardRef(
    ({ formData, customSectionNames = {}, closureData }, ref) => {
        const getSectionDisplayName = (section) => {
            const sectionId = section?.id;
            if (sectionId && customSectionNames[sectionId]) {
                return customSectionNames[sectionId].toUpperCase();
            }
            const defaultDisplayNames = {
                "work-description": "WORK DESCRIPTION",
                "tools-equipment": "TOOLS & EQUIPMENT",
                "ppe-checklist": "PPE",
                "hazard-identification": "HAZARD IDENTIFICATION",
                certificate: "CERTIFICATE",
                "safe-system-work": "SSOW",
                ssow: "SSOW",
                "last-minute-risk": "LMRA",
                declaration: "DECLARATION",
                "opening-ptw": "OPENING PTW",
                closure: "CLOSURE",
            };
            const key = getSectionKey(section);
            if (defaultDisplayNames[key]) return defaultDisplayNames[key];
            if (section?.title) return String(section.title).toUpperCase();
            return String(sectionId || "").toUpperCase();
        };

        const getSectionKey = (section) => {
            const known = new Set([
                "work-description",
                "tools-equipment",
                "ppe-checklist",
                "hazard-identification",
                "certificate",
                "safe-system-work",
                "ssow",
                "last-minute-risk",
                "declaration",
                "opening-ptw",
                "closure",
            ]);
            if (section?.id && known.has(section.id)) return section.id;
            const title = (section?.title || "").toLowerCase().trim();
            if (title.includes("work") && title.includes("description"))
                return "work-description";
            if (title.includes("tool") || title.includes("equipment"))
                return "tools-equipment";
            if (title.includes("ppe") || title.includes("protective"))
                return "ppe-checklist";
            if (title.includes("hazard")) return "hazard-identification";
            if (title.includes("certificate")) return "certificate";
            if (title.includes("safe system") || title === "ssow")
                return "ssow";
            if (
                title.includes("risk") ||
                title.includes("lmra") ||
                title.includes("last minute")
            )
                return "last-minute-risk";
            if (title.includes("declaration")) return "declaration";
            if (
                title.includes("opening") ||
                (title.includes("ptw") && !title.includes("closure"))
            )
                return "opening-ptw";
            if (title.includes("closure") || title.includes("handback"))
                return "closure";
            return section.id || "";
        };

        const normalizeAnswer = (val, options) => {
            if (val == null) return val;
            if (typeof val === "number" && options && options[val])
                return options[val];
            return val;
        };

        const cleanDisplayText = (text) => {
            if (!text) return "";
            return text
                .replace(/\(CROSS WITH AN X\):?/gi, "")
                .replace(/:$/, "")
                .trim();
        };

        const renderComponent = (component, sectionKey) => {
            const answers = formData?.answers || null;
            const rawAnswer = answers ? answers[component.id] : undefined;
            const answerVal = normalizeAnswer(rawAnswer, component.options);
            const componentVal =
                (component && (component.value ?? component.text)) || "";
            const hasAnswer =
                answers &&
                Object.prototype.hasOwnProperty.call(answers, component.id);
            const displayVal = hasAnswer ? answerVal : componentVal;

            // TOOLS & EQUIPMENT - Numbered Grid
            if (sectionKey === "tools-equipment") {
                let items = [];
                if (typeof displayVal === "string") {
                    items = displayVal.split(",").map((s) => s.trim());
                    // Removed .filter(Boolean) so empty slots (double commas) are preserved as blank numbered items
                } else if (Array.isArray(displayVal)) {
                    items = displayVal;
                }
                return (
                    <div className="tools-container">
                        <div className="tools-header">
                            LISTING OF IDENTIFIED TOOLS AND/OR EQUIPMENT TO BE
                            USED FOR THE ACTIVITY.
                        </div>
                        <div className="tools-grid">
                            {Array.from({ length: 18 }).map((_, idx) => (
                                <div key={idx} className="tool-item">
                                    <span className="tool-num">{idx + 1}.</span>
                                    <span className="tool-value">
                                        {items[idx] || ""}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            }

            // OPENING PTW - inject closure data
            if (sectionKey === "opening-ptw" && closureData?.openingPTW) {
                const openingPTW = closureData.openingPTW;
                const labelLower = (component.label || "").toLowerCase();
                let val = displayVal;
                if (labelLower.includes("issuing authority name"))
                    val = openingPTW["permit-issuing-authority-name"];
                else if (
                    labelLower.includes("date") &&
                    labelLower.includes("issuing")
                )
                    val = openingPTW["permit-issuing-authority-date"];
                if (labelLower.includes("receiving authority name"))
                    val = openingPTW["permit-receiving-authority-name"];
                else if (
                    labelLower.includes("date") &&
                    labelLower.includes("receiving")
                )
                    val = openingPTW["permit-receiving-authority-date"];
                if (val !== displayVal && val) {
                    return (
                        <div className="field-row">
                            <span className="field-label">
                                {component.label}:
                            </span>
                            <span className="field-value">{String(val)}</span>
                        </div>
                    );
                }
            }

            // CLOSURE - inject closure data
            if (sectionKey === "closure" && closureData) {
                const labelLower = (component.label || "").toLowerCase();
                let val = displayVal;
                if (
                    labelLower.includes("issuing authority") ||
                    labelLower.includes("closed by")
                )
                    val = closureData.closedBy;
                else if (labelLower.includes("date"))
                    val = closureData.closedAt
                        ? String(closureData.closedAt).split("T")[0]
                        : "";
                if (val !== displayVal && val) {
                    return (
                        <div className="field-row">
                            <span className="field-label">
                                {component.label}:
                            </span>
                            <span className="field-value">{String(val)}</span>
                        </div>
                    );
                }
            }

            // STANDARD COMPONENTS
            switch (component.type) {
                case "text":
                case "time":
                case "date":
                    // LMRA sometimes includes a text label that duplicates the title. Filter it out.
                    if (
                        sectionKey === "last-minute-risk" &&
                        cleanDisplayText(
                            component.label || "",
                        ).toUpperCase() === "LAST MINUTE RISK ASSESSMENT"
                    ) {
                        return null;
                    }

                    return (
                        <div className="field-row">
                            <span className="field-label">
                                {component.label}:
                            </span>
                            <span className="field-value">
                                {String(displayVal || "")}
                            </span>
                        </div>
                    );
                case "textarea":
                    return (
                        <div className="field-block">
                            <div className="field-label">
                                {component.label}:
                            </div>
                            <div className="field-textarea">
                                {String(displayVal || "")}
                            </div>
                        </div>
                    );
                case "checkbox":
                    // Yes/No style for Certificate, SSOW, LMRA
                    if (
                        [
                            "certificate",
                            "ssow",
                            "safe-system-work",
                            "last-minute-risk",
                        ].includes(sectionKey)
                    ) {
                        const isChecked = (opt) => {
                            if (hasAnswer && Array.isArray(answerVal))
                                return answerVal.includes(opt);
                            if (hasAnswer && answerVal === opt) return true;
                            return false;
                        };
                        return (
                            <div className="yn-row">
                                <span className="yn-label">
                                    {component.label}
                                </span>
                                <div className="yn-options">
                                    {(
                                        component.options || [
                                            "Yes",
                                            "No",
                                            "N/A",
                                        ]
                                    ).map((opt) => (
                                        <label key={opt} className="yn-option">
                                            <span
                                                className={`checkbox-box ${isChecked(opt) ? "checked" : ""}`}
                                            >
                                                {isChecked(opt) ? "✓" : ""}
                                            </span>
                                            <span className="yn-text">
                                                {opt}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        );
                    }
                    // Grid checkboxes for PPE, Hazards
                    {
                        const isItemChecked = (opt) =>
                            hasAnswer &&
                            Array.isArray(answerVal) &&
                            answerVal.includes(opt);
                        return (
                            <div className="checkbox-block">
                                {component.label && (
                                    <div className="checkbox-header">
                                        {cleanDisplayText(component.label)}
                                    </div>
                                )}
                                <div className="checkbox-grid">
                                    {component.options?.map((option, index) => (
                                        <label
                                            key={index}
                                            className="checkbox-item"
                                        >
                                            <span
                                                className={`checkbox-box ${isItemChecked(option) ? "checked" : ""}`}
                                            >
                                                {isItemChecked(option)
                                                    ? "✓"
                                                    : ""}
                                            </span>
                                            <span className="checkbox-label">
                                                {option}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        );
                    }
                case "radio": {
                    const isRadioChecked = (opt) =>
                        hasAnswer && answerVal === opt;
                    return (
                        <div className="yn-row">
                            <span className="yn-label">{component.label}</span>
                            <div className="yn-options">
                                {(component.options || []).map((opt) => (
                                    <label key={opt} className="yn-option">
                                        <span
                                            className={`checkbox-box ${isRadioChecked(opt) ? "checked" : ""}`}
                                        >
                                            {isRadioChecked(opt) ? "✓" : ""}
                                        </span>
                                        <span className="yn-text">{opt}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    );
                }
                case "header":
                    // We WANT the header to render in LMRA now (inside grid)
                    return (
                        <div className="subsection-header">
                            {cleanDisplayText(component.label)}
                        </div>
                    );
                case "signature":
                    return (
                        <div className="field-row">
                            <span className="field-label">
                                {component.label}:
                            </span>
                            <span className="field-value signature-line"></span>
                        </div>
                    );
                default:
                    return null;
            }
        };

        return (
            <div ref={ref} className="permit-document">
                <style>{`
                /* ========== DOCUMENT STYLES ========== */
                .permit-document {
                    width: 210mm;
                    min-height: 297mm;
                    background: #fff;
                    font-family: 'Segoe UI', Arial, sans-serif;
                    font-size: 9px;
                    line-height: 1.3;
                    color: #000;
                    padding: 8mm;
                    box-sizing: border-box;
                }

                @media print {
                    .permit-document {
                        width: 100%;
                        height: auto;
                        min-height: auto;
                        padding: 8mm;
                        box-shadow: none;
                        border: none;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                }

                /* ========== HEADER ========== */
                .doc-header {
                    display: flex;
                    border: 2px solid #000;
                    margin-bottom: 0;
                }
                .doc-meta {
                    width: 100px;
                    padding: 6px;
                    font-size: 8px;
                    border-right: 1px solid #000;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }
                .doc-title {
                    flex: 1;
                    background: #000;
                    color: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 18px;
                    font-weight: 700;
                    letter-spacing: 1px;
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
                .doc-logo {
                    width: 100px;
                    padding: 6px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-left: 1px solid #000;
                }
                .doc-logo img { max-height: 35px; }
                .logo-text { font-size: 16px; font-weight: 700; color: #1e40af; font-style: italic; }

                /* ========== SECTIONS CONTAINER ========== */
                .sections-container {
                    border: 2px solid #000;
                    border-top: none;
                }

                /* ========== SECTION ROW ========== */
                .section-row {
                    display: flex;
                    border-bottom: 1px solid #000;
                }
                .section-row:last-child { border-bottom: none; }

                .section-sidebar {
                    width: 24px;
                    min-width: 24px;
                    background: #000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
                .sidebar-text {
                    writing-mode: vertical-rl;
                    transform: rotate(180deg);
                    color: #fff;
                    font-size: 8px;
                    font-weight: 700;
                    letter-spacing: 0.5px;
                    text-transform: uppercase;
                    white-space: nowrap;
                }

                .section-content {
                    flex: 1;
                    padding: 4px 8px;
                    border-left: 1px solid #000;
                }

                /* ========== FIELD STYLES ========== */
                .field-row {
                    display: flex;
                    align-items: baseline;
                    margin-bottom: 3px;
                    gap: 6px;
                }
                .field-label {
                    font-weight: 600;
                    color: #000;
                    /* Removed white-space: nowrap to allow wrapping for long text */
                }
                .field-value {
                    flex: 1;
                    border-bottom: 1px solid #666;
                    min-height: 14px;
                    padding-left: 4px;
                    color: #1e40af;
                }
                .signature-line { min-width: 120px; }

                .field-block { margin-bottom: 4px; }
                .field-textarea {
                    border-bottom: 1px solid #666;
                    min-height: 16px;
                    padding: 2px 4px;
                    color: #1e40af;
                }

                /* ========== TOOLS GRID ========== */
                .tools-container { width: 100%; }
                .tools-header {
                    font-weight: 700;
                    text-align: center;
                    font-size: 9px;
                    margin-bottom: 6px;
                    text-decoration: underline;
                }
                .tools-grid {
                    display: grid;
                    grid-template-columns: repeat(6, 1fr);
                    gap: 4px 12px;
                }
                .tool-item {
                    display: flex;
                    align-items: baseline;
                    gap: 4px;
                }
                .tool-num { font-weight: 700; }
                .tool-value {
                    flex: 1;
                    border-bottom: 1px solid #000;
                    min-height: 12px;
                    color: #1e40af;
                }

                /* ========== CHECKBOX GRID (PPE, Hazards) ========== */
                .checkbox-block { margin-bottom: 4px; }
                .checkbox-header {
                    font-weight: 700;
                    text-align: center;
                    font-size: 9px;
                    margin-bottom: 4px;
                    text-decoration: underline;
                    text-transform: uppercase;
                }
                .checkbox-grid {
                    display: grid;
                    grid-template-columns: repeat(5, 1fr);
                    gap: 3px 8px;
                }
                .checkbox-item {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    cursor: default;
                }
                .checkbox-box {
                    width: 12px;
                    height: 12px;
                    border: 1.5px solid #000;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 10px;
                    font-weight: 700;
                    flex-shrink: 0;
                }
                .checkbox-box.checked {
                    background: #1e40af;
                    color: #fff;
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
                .checkbox-label { font-size: 8px; }

                /* ========== YES/NO ROWS (Certificate, SSOW, LMRA) ========== */
                .yn-row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 3px 0;
                    border-bottom: 1px dotted #ccc;
                }
                .yn-row:last-child { border-bottom: none; }
                .yn-label { font-weight: 600; flex: 1; }
                .yn-options { display: flex; gap: 12px; }
                .yn-option {
                    display: flex;
                    align-items: center;
                    gap: 3px;
                    cursor: default;
                }
                .yn-text { font-size: 9px; }

                /* ========== SUBSECTION HEADER ========== */
                .subsection-header {
                    font-weight: 700;
                    text-align: center;
                    font-size: 9px;
                    text-decoration: underline;
                    margin: 2px 0 1px;
                    text-transform: uppercase;
                    width: 100%; /* Force full width in flex/grid containers */
                }

                /* ========== SECTION-SPECIFIC LAYOUTS ========== */
                /* Work Description - 2 column grid */
                .section-row[data-key="work-description"] .section-content {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 4px 20px;
                }
                .section-row[data-key="work-description"] .field-block {
                    grid-column: 1 / -1;
                }

                /* Hazard Identification - 5 column checkbox grid + certificate rows */
                .section-row[data-key="hazard-identification"] .section-content {
                    display: block;
                }
                .section-row[data-key="hazard-identification"] .checkbox-header {
                    font-weight: 700;
                    text-align: center;
                    font-size: 9px;
                    margin-bottom: 4px;
                    text-decoration: underline;
                }
                .section-row[data-key="hazard-identification"] .checkbox-grid {
                    display: grid;
                    grid-template-columns: repeat(5, 1fr);
                    gap: 2px 6px;
                    margin-bottom: 6px;
                }
                .section-row[data-key="hazard-identification"] .field-row {
                    border-bottom: 1px solid #999;
                    padding: 2px 0;
                }
                .section-row[data-key="hazard-identification"] .yn-row {
                    display: flex;
                    align-items: center;
                    border-bottom: none; /* Removed border to prevent double lines with field-row */
                    padding: 3px 0;
                }
                .section-row[data-key="hazard-identification"] .yn-label {
                    min-width: 180px;
                    font-weight: 600;
                }
                .section-row[data-key="hazard-identification"] .yn-options {
                    display: flex;
                    gap: 8px;
                    margin-right: 20px;
                }
                .section-row[data-key="hazard-identification"] .field-value {
                    flex: 1;
                    border-bottom: 1px solid #666;
                    margin-left: 8px;
                }

                /* SSOW - 2 column for Y/N questions */
                .section-row[data-key="ssow"] .section-content,
                .section-row[data-key="safe-system-work"] .section-content {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 4px 20px;
                }
                .section-row[data-key="ssow"] .subsection-header,
                .section-row[data-key="safe-system-work"] .subsection-header {
                    grid-column: 1 / -1;
                }

                /* LMRA - Grid layout for items */
                /* LMRA - Custom Grid Layout */
                .lmra-custom-grid {
                    display: flex;
                    flex-direction: column;
                    border: none !important; /* Force remove border */
                    padding: 0;
                }
                .lmra-items-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 8px 12px;
                    border: none !important;
                }
                /* Ensure children rendered by renderComponent take full width of grid cell */
                .lmra-items-grid > * {
                    width: 100%;
                }

                /* Declaration - 2 column with full-width headers */
                .section-row[data-key="declaration"] .section-content {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 2px 24px;
                }
                .section-row[data-key="declaration"] .field-block,
                .section-row[data-key="declaration"] .subsection-header {
                    grid-column: 1 / -1;
                }

                /* Opening PTW - 2 column with full-width disclaimer */
                .section-row[data-key="opening-ptw"] .section-content {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 2px 24px;
                }
                .section-row[data-key="opening-ptw"] .field-label {
                    white-space: normal; /* Ensure long text wraps */
                }
                .section-row[data-key="opening-ptw"] .field-block,
                .section-row[data-key="opening-ptw"] .subsection-header {
                    grid-column: 1 / -1;
                }

                /* Closure - 2 column with full-width headers */
                .section-row[data-key="closure"] .section-content {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 2px 24px;
                }
                .section-row[data-key="closure"] .field-block,
                .section-row[data-key="closure"] .subsection-header {
                    grid-column: 1 / -1;
                }

                /* Certificate - Inline rows: Question | Yes/No/NA | Cert Number */
                .section-row[data-key="certificate"] .section-content {
                    display: block;
                }
                .section-row[data-key="certificate"] .yn-row {
                    display: flex;
                    align-items: center;
                    border-bottom: 1px solid #000;
                    padding: 4px 0;
                }
                .section-row[data-key="certificate"] .yn-label {
                    min-width: 200px;
                    font-weight: 600;
                }
                .section-row[data-key="certificate"] .yn-options {
                    display: flex;
                    gap: 8px;
                    margin-right: 15px;
                }
                .section-row[data-key="certificate"] .field-row {
                    margin-top: 2px;
                    margin-left: 10px;
                }
            `}</style>

                {/* HEADER */}
                <div className="doc-header">
                    <div className="doc-meta">
                        <div>
                            Issue Date: {format(new Date(), "dd/MM/yyyy")}
                        </div>
                    </div>
                    <div className="doc-title">GENERAL WORK PERMIT</div>
                    <div className="doc-logo">
                        {formData.logoSrc ? (
                            <img src={formData.logoSrc} alt="Logo" />
                        ) : (
                            <span className="logo-text">expertise</span>
                        )}
                    </div>
                </div>

                {/* SECTIONS */}
                <div className="sections-container">
                    {formData.sections?.map((section) => {
                        const sectionKey = getSectionKey(section);
                        return (
                            <div
                                key={section.id}
                                className="section-row"
                                data-key={sectionKey}
                            >
                                <div className="section-sidebar">
                                    <span className="sidebar-text">
                                        {getSectionDisplayName(section)}
                                    </span>
                                </div>
                                <div className="section-content">
                                    {![
                                        "hazard-identification",
                                        "tools-equipment",
                                        "ppe-checklist",
                                    ].includes(sectionKey) && (
                                        <div className="subsection-header">
                                            {cleanDisplayText(
                                                String(
                                                    section.title || section.id,
                                                ),
                                            ).toUpperCase()}
                                        </div>
                                    )}
                                    {sectionKey === "last-minute-risk" ? (
                                        <div className="lmra-items-grid">
                                            {section.components.map((comp) => {
                                                // The LMRA section component is a single "checkbox" type
                                                // with the label "LAST MINUTE RISK ASSESSMENT".
                                                // The "Questions" are actually OPTIONS of this single component.
                                                // So we render the OPTIONS as grid items and IGNORE the component label.

                                                const isOptionChecked = (
                                                    opt,
                                                ) => {
                                                    // Use formData.answers like renderComponent does
                                                    const answers =
                                                        formData?.answers || {};
                                                    const answer =
                                                        answers[comp.id];

                                                    if (!answer) return false;

                                                    if (Array.isArray(answer)) {
                                                        return answer.includes(
                                                            opt,
                                                        );
                                                    }
                                                    return answer === opt;
                                                };

                                                return (
                                                    <React.Fragment
                                                        key={comp.id}
                                                    >
                                                        {(
                                                            comp.options || []
                                                        ).map((opt, index) => (
                                                            <div
                                                                key={index}
                                                                className="lmra-item"
                                                                style={{
                                                                    display:
                                                                        "flex",
                                                                    alignItems:
                                                                        "center",
                                                                    justifyContent:
                                                                        "space-between",
                                                                }}
                                                            >
                                                                <span
                                                                    className="lmra-label"
                                                                    style={{
                                                                        fontSize:
                                                                            "8px",
                                                                        marginRight:
                                                                            "8px",
                                                                        flex: 1,
                                                                    }}
                                                                >
                                                                    {opt}
                                                                </span>
                                                                <div className="lmra-options">
                                                                    <label className="yn-option">
                                                                        <span
                                                                            className={`checkbox-box ${isOptionChecked(opt) ? "checked" : ""}`}
                                                                        >
                                                                            {isOptionChecked(
                                                                                opt,
                                                                            )
                                                                                ? "✓"
                                                                                : ""}
                                                                        </span>
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </React.Fragment>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        section.components?.map((comp) => (
                                            <React.Fragment key={comp.id}>
                                                {renderComponent(
                                                    comp,
                                                    sectionKey,
                                                )}
                                            </React.Fragment>
                                        ))
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    },
);

PrintableContent.displayName = "PrintableContent";

// Main PrintView Component
const PrintView = ({
    formData,
    customSectionNames = {},
    builderPath = "/page/app/form-builder",
    onToggleView,
    closureData,
}) => {
    const navigate = useNavigate();
    const handlePrint = () => {
        window.print();
    };

    if (!formData) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">No form data available</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-200 flex flex-col items-center py-8">
            <style>{`
                @media print {
                    /* 1. Hide the header controls */
                    .no-print {
                        display: none !important;
                    }

                    /* 2. Reset global page styles for printing */
                    html, body, #root {
                        height: auto !important;
                        min-height: auto !important;
                        overflow: visible !important;
                        background: white !important;
                        margin: 0 !important;
                        padding: 0 !important;
                    }

                    /* 3. Reset the main wrapper (was min-h-screen flex...) */
                    .min-h-screen {
                        height: auto !important;
                        min-height: 0 !important;
                        display: block !important;
                        padding: 0 !important;
                        background: white !important;
                    }

                    /* 4. Reset the preview container */
                    #printable-content {
                        margin: 0 !important;
                        border: none !important;
                        box-shadow: none !important;
                        border-radius: 0 !important;
                        width: 100% !important;
                        max-width: none !important;
                        overflow: visible !important;
                    }

                    /* 5. Ensure text/graphics are visible */
                    * {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                }
            `}</style>

            {/* Controls */}
            <div className="fixed top-0 left-0 right-0 bg-white border-b shadow-md z-50 p-4 flex justify-between items-center no-print">
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        onClick={() => {
                            if (onToggleView) onToggleView();
                            else
                                try {
                                    navigate({ to: builderPath });
                                } catch {
                                    window.history.back();
                                }
                        }}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back
                    </Button>
                    <h2 className="font-semibold text-lg text-slate-800">
                        Print Preview
                    </h2>
                </div>
                <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={handlePrint}
                >
                    <Printer className="w-4 h-4 mr-2" /> Print Form
                </Button>
            </div>

            {/* Preview Container */}
            <div
                className="mt-20 shadow-2xl border border-slate-300 rounded-sm overflow-hidden"
                id="printable-content"
            >
                <PrintableContent
                    formData={formData}
                    customSectionNames={customSectionNames}
                    closureData={closureData}
                />
            </div>
        </div>
    );
};

export default PrintView;
