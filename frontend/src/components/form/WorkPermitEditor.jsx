import React from "react";
import FormBuilderModular from "./FormBuilderModular";

/**
 * Focused editor wrapper for Work Permit editing.
 * Props:
 * - title
 * - sectionsTemplate
 * - workPermitId
 */
const WorkPermitEditor = ({ title, sectionsTemplate, workPermitId }) => {
    return (
        <FormBuilderModular
            title={title}
            sectionsTemplate={sectionsTemplate}
            startWithTemplate={false}
            workPermitId={workPermitId}
            isReadOnly={false}
        />
    );
};

export default WorkPermitEditor;


