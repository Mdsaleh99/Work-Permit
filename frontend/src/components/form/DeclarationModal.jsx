import React from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { X, Shield, AlertTriangle } from "lucide-react";

/**
 * Modal component for declaration checkboxes
 */
const DeclarationModal = ({
    showAgreeModal,
    setShowAgreeModal,
    declarationChecks,
    updateDeclarationCheck,
    areAllDeclarationsChecked,
    onSubmitForm,
    isSubmitting,
}) => {
    // Debug logging
    // console.log('DeclarationModal render:', { showAgreeModal, declarationChecks });
    
    if (!showAgreeModal) return null;

    const handleSubmit = () => {
        if (areAllDeclarationsChecked()) {
            onSubmitForm();
            setShowAgreeModal(false);
        }
    };

    // Fixed declarations list (only these, no others)
    const DECLARATIONS = [
        { id: "site-preparation", label: "Site Preparation completed and work can commence.", required: true },
        { id: "permit-issuing-authority", label: "Permit Issuing Authority", required: true },
        { id: "permit-issuing-date", label: "Date", required: true },
        { id: "safety-understanding", label: "I fully understand the safety precaution to be taken as described above.", required: true },
        { id: "permit-receiving-authority", label: "Permit Receiving Authority", required: true },
        { id: "permit-receiving-date", label: "Date", required: true },
    ];

    const allChecked = DECLARATIONS.every(d => declarationChecks[d.id]);

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-red-50">
                    <div className="flex items-center space-x-3">
                        <Shield className="w-6 h-6 text-red-600" />
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Declaration & Agreement</h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Please review and agree to all declarations before submitting
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAgreeModal(false)}
                        className="p-2"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[50vh]">
                    <div className="space-y-5">
                        {/* Warning */}
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex items-start space-x-3">
                                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                                <div>
                                    <h3 className="text-sm font-medium text-yellow-800">
                                        Important Notice
                                    </h3>
                                    <p className="text-sm text-yellow-700 mt-1">
                                        All declarations must be checked before you can submit this form. 
                                        Please read each declaration carefully and ensure you understand 
                                        and agree to all terms.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Declarations */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900">Declarations</h3>
                            <div className="space-y-3">
                                {DECLARATIONS.map((d) => (
                                    <div key={d.id} className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 hover:border-gray-300 bg-white">
                                        <Checkbox
                                            id={d.id}
                                            checked={declarationChecks[d.id] || false}
                                            onCheckedChange={(isChecked) => updateDeclarationCheck(d.id, isChecked)}
                                            className="h-5 w-5 mt-0.5"
                                        />
                                        <Label htmlFor={d.id} className="text-[15px] leading-relaxed text-gray-800 cursor-pointer">
                                            {d.label}
                                            {d.required && (<span className="text-red-500 ml-1">*</span>)}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
                    <div className="text-sm text-gray-600">
                        <span>
                            {DECLARATIONS.filter(d => declarationChecks[d.id]).length} of {DECLARATIONS.length} declarations checked
                        </span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Button
                            variant="outline"
                            onClick={() => setShowAgreeModal(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={!areAllDeclarationsChecked() || isSubmitting}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Submitting...
                                </>
                            ) : (
                                "Submit Form"
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeclarationModal;
