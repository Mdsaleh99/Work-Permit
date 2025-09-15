import React from "react";
import { Button } from "@/components/ui/button";
import { Eye, Edit } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

export default function WorkPermitViewButtonRow({ workPermitId }) {
    const navigate = useNavigate();
    return (
        <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate({ to: `/page/app/form-builder/view/${workPermitId}` })}>
                <Eye className="mr-1 h-3 w-3" /> View
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate({ to: `/page/app/form-builder/${workPermitId}` })}>
                <Edit className="mr-1 h-3 w-3" /> Edit
            </Button>
        </div>
    );
}


