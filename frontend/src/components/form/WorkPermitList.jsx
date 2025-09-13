import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWorkPermitStore } from "@/store/useWorkPermitStore";
import { useCompanyStore } from "@/store/useCompanyStore";
import { useNavigate } from "@tanstack/react-router";
import { 
    Loader, 
    FileText, 
    Plus, 
    Edit, 
    Trash2, 
    Eye,
    Calendar,
    Building2
} from "lucide-react";
import { toast } from "sonner";

function WorkPermitList() {
    const { 
        workPermits, 
        isFetching, 
        workPermitError, 
        getAllWorkPermits, 
        deleteWorkPermit,
        clearError 
    } = useWorkPermitStore();
    
    const { companyData } = useCompanyStore();
    const navigate = useNavigate();

    useEffect(() => {
        fetchWorkPermits();
        return () => clearError();
    }, []);

    const fetchWorkPermits = async () => {
        try {
            await getAllWorkPermits();
        } catch (error) {
            console.error("Error fetching work permits:", error);
            toast.error("Failed to fetch work permits");
        }
    };

    const handleDeleteWorkPermit = async (workPermitId, title) => {
        if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
            try {
                await deleteWorkPermit(workPermitId);
                toast.success("Work permit deleted successfully");
            } catch (error) {
                console.error("Error deleting work permit:", error);
                toast.error("Failed to delete work permit");
            }
        }
    };

    const handleEditWorkPermit = (workPermitId) => {
        navigate({ to: `/page/app/form-builder/${workPermitId}` });
    };

    const handleViewWorkPermit = (workPermitId) => {
        navigate({ to: `/page/app/work-permit/${workPermitId}` });
    };

    const handleCreateNew = () => {
        navigate({ to: "/page/app/form-builder" });
    };

    if (isFetching) {
        return (
            <div className="max-w-6xl mx-auto p-6 mt-20">
                <div className="flex items-center justify-center h-64">
                    <Loader className="h-8 w-8 animate-spin" />
                    <span className="ml-2">Loading work permits...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6 mt-20">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Work Permit Forms</h1>
                    <p className="text-gray-600 mt-2">
                        Manage your work permit forms for {companyData?.compName || "your company"}
                    </p>
                </div>
                <Button onClick={handleCreateNew} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Form
                </Button>
            </div>

            {workPermitError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-600">{workPermitError.message}</p>
                </div>
            )}

            {workPermits.length === 0 ? (
                <Card>
                    <CardContent className="text-center py-12">
                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No work permit forms found</h3>
                        <p className="text-gray-500 mb-4">
                            Get started by creating your first work permit form.
                        </p>
                        <Button onClick={handleCreateNew} className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="mr-2 h-4 w-4" />
                            Create Work Permit Form
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {workPermits.map((workPermit) => (
                        <Card key={workPermit.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <FileText className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg font-semibold text-gray-900">
                                                {workPermit.title}
                                            </CardTitle>
                                            <Badge variant="secondary" className="mt-1">
                                                {workPermit.sections?.length || 0} sections
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-3">
                                        <Building2 className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm text-gray-600">
                                            {workPermit.company?.compName || "Unknown Company"}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Calendar className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm text-gray-600">
                                            Created {new Date(workPermit.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    {workPermit.sections && workPermit.sections.length > 0 && (
                                        <div className="text-sm text-gray-600">
                                            <strong>Sections:</strong> {workPermit.sections.map(s => s.title).join(", ")}
                                        </div>
                                    )}
                                </div>
                                
                                <div className="flex space-x-2 mt-4 pt-4 border-t">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleViewWorkPermit(workPermit.id)}
                                        className="flex-1"
                                    >
                                        <Eye className="mr-1 h-3 w-3" />
                                        View
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleEditWorkPermit(workPermit.id)}
                                        className="flex-1"
                                    >
                                        <Edit className="mr-1 h-3 w-3" />
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDeleteWorkPermit(workPermit.id, workPermit.title)}
                                        className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                        <Trash2 className="mr-1 h-3 w-3" />
                                        Delete
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

export { WorkPermitList };
