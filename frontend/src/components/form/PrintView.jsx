import React from "react";
import { format } from "date-fns";

const PrintView = ({ formData }) => {
    // Only render sections that are enabled and have enabled components
    const getEnabledSections = () => {
        return formData.sections.filter(
            (section) =>
                section.enabled !== false &&
                section.components.some((component) => component.enabled),
        );
    };

    // Dynamic component renderer based on component type
    const renderComponent = (component) => {
        switch (component.type) {
            case "text":
                return <div className="ptw-input-line">_________________</div>;

            case "textarea":
                return (
                    <div className="ptw-textarea">
                        <div className="ptw-textarea-line">
                            _________________________________
                        </div>
                        <div className="ptw-textarea-line">
                            _________________________________
                        </div>
                    </div>
                );

            case "checkbox":
                return (
                    <div className="ptw-checkbox-grid">
                        {component.options && component.options.length > 0 ? (
                            component.options.map((option, index) => (
                                <div key={index} className="ptw-checkbox-item">
                                    <div className="ptw-checkbox">☐</div>
                                    <span className="ptw-checkbox-label">
                                        {option}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="ptw-checkbox-item">
                                <div className="ptw-checkbox">☐</div>
                                <span className="ptw-checkbox-label">Yes</span>
                            </div>
                        )}
                    </div>
                );

            case "radio":
                return (
                    <div className="ptw-radio-group">
                        {component.options && component.options.length > 0 ? (
                            component.options.map((option, index) => (
                                <div key={index} className="ptw-radio-item">
                                    <div className="ptw-radio">○</div>
                                    <span className="ptw-radio-label">
                                        {option}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <>
                                <div className="ptw-radio-item">
                                    <div className="ptw-radio">○</div>
                                    <span className="ptw-radio-label">Yes</span>
                                </div>
                                <div className="ptw-radio-item">
                                    <div className="ptw-radio">○</div>
                                    <span className="ptw-radio-label">No</span>
                                </div>
                                <div className="ptw-radio-item">
                                    <div className="ptw-radio">○</div>
                                    <span className="ptw-radio-label">N/A</span>
                                </div>
                            </>
                        )}
                    </div>
                );

            case "date":
                return <div className="ptw-input-line">____/____/____</div>;

            case "time":
                return <div className="ptw-input-line">__:__</div>;

            case "table":
                return (
                    <div className="ptw-table">
                        <div className="ptw-table-header">
                            {component.columns &&
                            component.columns.length > 0 ? (
                                component.columns.map((col, index) => (
                                    <div key={index} className="ptw-table-cell">
                                        {col}
                                    </div>
                                ))
                            ) : (
                                <>
                                    <div className="ptw-table-cell">1</div>
                                    <div className="ptw-table-cell">2</div>
                                    <div className="ptw-table-cell">3</div>
                                    <div className="ptw-table-cell">4</div>
                                    <div className="ptw-table-cell">5</div>
                                    <div className="ptw-table-cell">6</div>
                                </>
                            )}
                        </div>
                        <div className="ptw-table-row">
                            {component.columns &&
                            component.columns.length > 0 ? (
                                component.columns.map((col, index) => (
                                    <div key={index} className="ptw-table-cell">
                                        <div className="ptw-table-line">
                                            _________________
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <>
                                    <div className="ptw-table-cell">
                                        <div className="ptw-table-line">
                                            _________________
                                        </div>
                                    </div>
                                    <div className="ptw-table-cell">
                                        <div className="ptw-table-line">
                                            _________________
                                        </div>
                                    </div>
                                    <div className="ptw-table-cell">
                                        <div className="ptw-table-line">
                                            _________________
                                        </div>
                                    </div>
                                    <div className="ptw-table-cell">
                                        <div className="ptw-table-line">
                                            _________________
                                        </div>
                                    </div>
                                    <div className="ptw-table-cell">
                                        <div className="ptw-table-line">
                                            _________________
                                        </div>
                                    </div>
                                    <div className="ptw-table-cell">
                                        <div className="ptw-table-line">
                                            _________________
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                );

            case "signature":
                return <div className="ptw-signature-line"></div>;

            default:
                return <div className="ptw-input-line">_________________</div>;
        }
    };

    // Dynamic section renderer - completely based on formData
    const renderSection = (section) => {
        if (
            !section ||
            section.enabled === false ||
            !section.components.some((c) => c.enabled)
        )
            return null;

        // Get section title from the actual section data or fallback to id
        const getSectionTitle = (sectionId) => {
            // Use the actual section title if available, otherwise format the id
            return section.title || sectionId.toUpperCase().replace(/-/g, " ");
        };

        return (
            <div
                key={section.id}
                className="ptw-section"
                data-section={section.id}
            >
                <div className="ptw-section-label">
                    {getSectionTitle(section.id)}
                </div>
                <div className="ptw-section-content">
                    {section.components
                        .filter((c) => c.enabled)
                        .map((component) => (
                            <div key={component.id} className="ptw-field">
                                <label className="ptw-label">
                                    {component.label}:
                                </label>
                                {renderComponent(component)}
                            </div>
                        ))}
                </div>
            </div>
        );
    };

    const enabledSections = getEnabledSections();

    if (enabledSections.length === 0) {
        return (
            <div className="ptw-form-print">
                <div className="ptw-no-content">
                    <h2>No sections enabled for printing</h2>
                    <p>
                        Please enable at least one section in the form builder
                        to see the print preview.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="ptw-form-print">
            {/* Header */}
            <div className="ptw-header">
                <div className="ptw-header-left">
                    <div className="ptw-doc-info">
                        <div>Doc Ref No: xxxxxxxxxxx</div>
                        <div>
                            Issue Date: {format(new Date(), "dd/MM/yyyy")}
                        </div>
                        <div>Rev No: 01</div>
                    </div>
                </div>
                <div className="ptw-header-center">
                    <div className="ptw-title">{formData.title}</div>
                </div>
                <div className="ptw-header-right">
                    <div className="ptw-logo">
                        <span className="ptw-logo-text">expertise</span>
                    </div>
                </div>
            </div>

            {/* Form Content - Completely Dynamic */}
            <div className="ptw-content">
                {enabledSections.map((section) => renderSection(section))}
            </div>

            {/* Footer */}
            <div className="ptw-footer">
                <div>
                    This permit must be completed before work commences and kept
                    on site during work activities.
                </div>
                <div>Page 1 of 1</div>
            </div>
        </div>
    );
};

export default PrintView;
