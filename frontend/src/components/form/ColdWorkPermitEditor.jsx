import React from "react";
import FormBuilderModular from "./FormBuilderModular";
import { COLD_WORK_SECTION_TEMPLATES } from "../../lib/constants";

/**
 * Cold Work Permit Editor
 */
const ColdWorkPermitEditor = ({ 
    title = "COLD WORK PERMIT", 
    sectionsTemplate = COLD_WORK_SECTION_TEMPLATES, 
    startWithTemplate = true, 
    workPermitId = null,
    isReadOnly = false 
}) => {
    return (
        <FormBuilderModular 
            title={title}
            sectionsTemplate={sectionsTemplate}
            startWithTemplate={startWithTemplate}
            workPermitId={workPermitId}
            isReadOnly={isReadOnly}
            permitType="cold"
        />
    );
};

export default ColdWorkPermitEditor;
