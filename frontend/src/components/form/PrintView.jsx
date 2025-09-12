import React from "react";
import { format } from "date-fns";

// Fixed, single-page template to match the provided reference exactly
const PrintView = () => {
    return (
        <div className="ptw-form-print no-print:w-[210mm] no-print:mx-auto no-print:bg-white no-print:shadow no-print:p-2">
            {/* Header */}
            <div className="ptw-header">
                <div className="ptw-header-left">
                    <div className="ptw-doc-info">
                        <div>Doc Ref No: xxxxxxxxxxx</div>
                        <div>Issue Date: {format(new Date(), "dd/MM/yyyy")}</div>
                        <div>Rev No: 01</div>
                    </div>
                </div>
                <div className="ptw-header-center">
                    <div className="ptw-title">GENERAL WORK PERMIT</div>
                </div>
                <div className="ptw-header-right">
                    <div className="ptw-logo">
                        <span className="ptw-logo-text">expertise</span>
                    </div>
                </div>
            </div>

            {/* WORK DESCRIPTION */}
            <div className="ptw-section" data-section="work-description">
                <div className="ptw-section-label">WORK DESCRIPTION</div>
                <div className="ptw-section-content">
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <div className="ptw-label">Work Order No.:</div>
                            <div className="ptw-input-line"></div>
                        </div>
                        <div>
                            <div className="ptw-label">Work Permit No.:</div>
                            <div className="ptw-input-line"></div>
                        </div>
                        <div>
                            <div className="ptw-label">Division/Department.:</div>
                            <div className="ptw-input-line"></div>
                        </div>
                        <div>
                            <div className="ptw-label">Area of Work.:</div>
                            <div className="ptw-input-line"></div>
                        </div>
                        <div>
                            <div className="ptw-label">Location.:</div>
                            <div className="ptw-input-line"></div>
                        </div>
                        <div>
                            <div className="ptw-label">Work Starting Date.:</div>
                            <div className="ptw-input-line"></div>
                        </div>
                        <div>
                            <div className="ptw-label">Time.:</div>
                            <div className="ptw-input-line"></div>
                        </div>
                        <div>
                            <div className="ptw-label">Work Ending Date.:</div>
                            <div className="ptw-input-line"></div>
                        </div>
                        <div className="col-span-2">
                            <div className="ptw-label">Description Of the Work.:</div>
                            <div className="ptw-input-line"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* TOOLS & EQUIPMENT */}
            <div className="ptw-section" data-section="tools-equipment">
                <div className="ptw-section-label">TOOLS & EQUIPMENT</div>
                <div className="ptw-section-content">
                    <div className="ptw-label">
                        LISTING OF IDENTIFIED TOOLS AND/OR EQUIPMENT TO BE USED FOR THE ACTIVITY.:
                    </div>
                    <div className="ptw-table">
                        <div className="ptw-table-header">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="ptw-table-cell">{i + 1}</div>
                            ))}
                        </div>
                        <div className="ptw-table-row">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="ptw-table-cell">
                                    <div className="ptw-textarea-line"></div>
                                    <div className="ptw-textarea-line"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* PPE CHECKLIST */}
            <div className="ptw-section" data-section="ppe">
                <div className="ptw-section-label">PPE CHECKLIST</div>
                <div className="ptw-section-content">
                    <div className="ptw-label">
                        PERSONAL PROTECTIVE EQUIPMENT (CROSS WITH AN X)::
                    </div>
                    <div className="ptw-checkbox-grid">
                        {[
                            'Helmet','Welder\'s Helmet','Welder\'s Apron','Work Clothes','Dust Mask',
                            'Hear Protectors','Emergency Respirator','Protective Goggles','Safety Belts','Gas Mask',
                            'Safety Shoes','Anti-Dust Overalls','Dielectric Boots','Dielectric Gloves','Rubber Safety Boots',
                            'Welders Breeches','Safety Harness','Safety Gloves','Safety Glasses','H2S Mask',
                        ].map((label, idx) => (
                            <div key={idx} className="ptw-checkbox-item">
                                <div className="ptw-checkbox">☐</div>
                                <span className="ptw-checkbox-label">{label}</span>
                            </div>
                        ))}
                    </div>
                    <div className="ptw-label mt-1">Other Safety Measures::</div>
                    <div className="ptw-input-line"></div>
                </div>
            </div>

            {/* HAZARD IDENTIFICATION */}
            <div className="ptw-section" data-section="hazard-identification">
                <div className="ptw-section-label">HAZARD IDENTIFICATION</div>
                <div className="ptw-section-content">
                    <div className="ptw-label">HAZARD IDENTIFICATION (CROSS WITH AN X)::</div>
                    <div className="ptw-checkbox-grid" style={{gridTemplateColumns:'repeat(5,1fr)'}}>
                        {[
                            'Hand tools inspected','Work area barricaded','Required PPE worn','Worker competent','Worker Fit-To-Work',
                            'Slip/Trip and Fall','Dust, fumes or mist','Risk of Fall','Noise','Vibration',
                            'Pinch Points','Fall of objects','Illumination','Blind spots','Visibility',
                            'Electrical hazards','Use of chemical','Release of energy','Release of pressure','Likelihood of fire',
                        ].map((label, idx) => (
                            <div key={idx} className="ptw-checkbox-item">
                                <div className="ptw-checkbox">☐</div>
                                <span className="ptw-checkbox-label">{label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* SAFE SYSTEMS OF WORK / CERTIFICATE REQUIREMENTS */}
            <div className="ptw-section" data-section="ssow">
                <div className="ptw-section-label">SSOW</div>
                <div className="ptw-section-content">
                    <div className="grid grid-cols-3 gap-1">
                        <div>
                            <div className="ptw-label">Is Electrical Certificate Required?</div>
                            <div className="ptw-radio-group"><div className="ptw-radio">□</div><span className="ptw-radio-label">Yes</span><div className="ptw-radio">□</div><span className="ptw-radio-label">No</span><div className="ptw-radio">□</div><span className="ptw-radio-label">N/A</span></div>
                            <div className="ptw-label">If Yes Certificate Number:</div>
                            <div className="ptw-input-line"></div>
                        </div>
                        <div>
                            <div className="ptw-label">Is Excavation Certificate Required?</div>
                            <div className="ptw-radio-group"><div className="ptw-radio">□</div><span className="ptw-radio-label">Yes</span><div className="ptw-radio">□</div><span className="ptw-radio-label">No</span><div className="ptw-radio">□</div><span className="ptw-radio-label">N/A</span></div>
                            <div className="ptw-label">If Yes Certificate Number:</div>
                            <div className="ptw-input-line"></div>
                        </div>
                        <div>
                            <div className="ptw-label">Is Radiography Certificate Required?</div>
                            <div className="ptw-radio-group"><div className="ptw-radio">□</div><span className="ptw-radio-label">Yes</span><div className="ptw-radio">□</div><span className="ptw-radio-label">No</span><div className="ptw-radio">□</div><span className="ptw-radio-label">N/A</span></div>
                            <div className="ptw-label">If Yes Certificate Number:</div>
                            <div className="ptw-input-line"></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-1 mt-1">
                        <div className="ptw-label">Has Toolbox Talk been conducted?</div>
                        <div className="ptw-label">Has the scope of work been explained to workers?</div>
                        <div className="ptw-label">Is the Risk Assessment attached or explained?</div>
                        {[0,1,2].map((i)=> (
                            <div key={i} className="ptw-radio-group"><div className="ptw-radio">□</div><span className="ptw-radio-label">Yes</span><div className="ptw-radio">□</div><span className="ptw-radio-label">No</span></div>
                        ))}
                    </div>
                </div>
            </div>

            {/* LAST MINUTE RISK ASSESSMENT */}
            <div className="ptw-section" data-section="lmra">
                <div className="ptw-section-label">LMRA</div>
                <div className="ptw-section-content">
                    <div className="grid grid-cols-2 gap-1">
                        <div>
                            {["Is access / egress adequate.","Is lighting adequate for the activity.","Do workers understand the task.","Is the task safe to do in today's weather condition"].map((q,idx)=> (
                                <div key={idx} className="flex items-center justify-between">
                                    <span className="ptw-label" style={{width:'70%'}}>{q}</span>
                                    <div className="ptw-radio-group"><div className="ptw-radio">□</div><span className="ptw-radio-label">Yes</span><div className="ptw-radio">□</div><span className="ptw-radio-label">No</span></div>
                                </div>
                            ))}
                        </div>
                        <div>
                            {["Are all tools inspected by the user.","Is the work area clear of tripping hazards.","Are the workers aware of emergency procedure.","Are the emergency escape routes established?"].map((q,idx)=> (
                                <div key={idx} className="flex items-center justify-between">
                                    <span className="ptw-label" style={{width:'60%'}}>{q}</span>
                                    <div className="ptw-radio-group"><div className="ptw-radio">□</div><span className="ptw-radio-label">Yes</span><div className="ptw-radio">□</div><span className="ptw-radio-label">No</span></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* DECLARATION */}
            <div className="ptw-section" data-section="declaration">
                <div className="ptw-section-label">DECLARATION</div>
                <div className="ptw-section-content">
                    <div className="grid grid-cols-2 gap-1">
                        <div>
                            <div className="ptw-label">Site Preparation completed and work can commence.</div>
                            <div className="ptw-input-line"></div>
                        </div>
                        <div>
                            <div className="ptw-label">I fully understand the safety precaution to be taken as described above.</div>
                            <div className="ptw-input-line"></div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-1">
                        <div className="grid grid-cols-3 gap-1 items-end">
                            <div className="ptw-label">Permit Issuing Authority</div>
                            <div className="ptw-input-line"></div>
                            <div className="ptw-input-line"></div>
                        </div>
                        <div className="grid grid-cols-3 gap-1 items-end">
                            <div className="ptw-label">Permit Receiving Authority</div>
                            <div className="ptw-input-line"></div>
                            <div className="ptw-input-line"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* OPENING OF PERMIT TO WORK */}
            <div className="ptw-section" data-section="opening-ptw">
                <div className="ptw-section-label">OPENING PTW</div>
                <div className="ptw-section-content">
                    <div className="ptw-label">
                        The below signed persons are responsible for ensuring the work is performed under all the conditions mentioned and required safety precautions.
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-1">
                        <div>
                            <div className="ptw-label">Permit Issuing Authority Name:</div>
                            <div className="ptw-input-line"></div>
                            <div className="ptw-label">Permit Issuing Authority Sign:</div>
                            <div className="ptw-input-line"></div>
                            <div className="grid grid-cols-2 gap-2"><div><div className="ptw-label">Date:</div><div className="ptw-input-line"></div></div><div><div className="ptw-label">Time:</div><div className="ptw-input-line"></div></div></div>
                        </div>
                        <div>
                            <div className="ptw-label">Permit Receiving Authority Name:</div>
                            <div className="ptw-input-line"></div>
                            <div className="ptw-label">Permit Receiving Authority Sign:</div>
                            <div className="ptw-input-line"></div>
                            <div className="grid grid-cols-2 gap-2"><div><div className="ptw-label">Date:</div><div className="ptw-input-line"></div></div><div><div className="ptw-label">Time:</div><div className="ptw-input-line"></div></div></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CLOSURE */}
            <div className="ptw-section" data-section="closure">
                <div className="ptw-section-label">CLOSURE</div>
                <div className="ptw-section-content">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="ptw-label">The Work is completed and working area cleared.</div>
                            <div className="ptw-input-line"></div>
                        </div>
                        <div>
                            <div className="ptw-label">The Work is completed and working area cleared.</div>
                            <div className="ptw-input-line"></div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6 mt-1">
                        <div className="grid grid-cols-3 gap-2 items-end">
                            <div className="ptw-label">Permit Issuing Authority</div>
                            <div className="ptw-input-line"></div>
                            <div className="ptw-input-line"></div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 items-end">
                            <div className="ptw-label">Permit Receiving Authority</div>
                            <div className="ptw-input-line"></div>
                            <div className="ptw-input-line"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="ptw-footer">
                <div>The permit content fits on one A4 page.</div>
                <div>Page 1 of 1</div>
            </div>
        </div>
    );
};

export default PrintView;
