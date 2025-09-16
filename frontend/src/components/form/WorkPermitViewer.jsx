import React from "react";
import PrintView from "./PrintView";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import wpService from "@/services/workPermit.service";
import { Edit } from "lucide-react";

/**
 * Lightweight, read-only renderer for a Work Permit using the PrintView layout.
 * Props:
 * - title: string
 * - sectionsTemplate: array of { id, title, enabled, components[] }
 * - onEdit: () => void
 */
const WorkPermitViewer = ({ title, sectionsTemplate, onEdit, workPermitId }) => {
    const [latestAnswers, setLatestAnswers] = useState(null);
    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                if (workPermitId) {
                    const res = await wpService.listSubmissions(workPermitId);
                    const list = res?.data || res || [];
                    if (mounted && Array.isArray(list) && list.length > 0) {
                        setLatestAnswers(list[0].answers || null);
                    }
                }
            } catch {}
        })();
        return () => { mounted = false; };
    }, [workPermitId]);
    const formData = React.useMemo(() => ({
        title: title || "GENERAL WORK PERMIT",
        sections: sectionsTemplate || [],
        answers: latestAnswers || null,
    }), [title, sectionsTemplate, latestAnswers]);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-40 flex items-center justify-between">
                <h1 className="text-lg font-semibold text-gray-900 truncate">
                    {formData.title}
                </h1>
                {onEdit && (
                    <Button size="sm" variant="outline" onClick={onEdit} className="cursor-pointer">
                        <Edit className="w-4 h-4 mr-2" /> Edit
                    </Button>
                )}
            </div>
            <div className="py-4">
                {/* Reuse print layout to render clean, read-only form */}
                <PrintView formData={formData} onToggleView={null} />
            </div>
        </div>
    );
};

export default WorkPermitViewer;


