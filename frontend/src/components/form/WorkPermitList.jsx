import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useWorkPermitStore } from "@/store/useWorkPermitStore";
import { useCompanyStore } from "@/store/useCompanyStore";
import { useNavigate } from "@tanstack/react-router";
import { 
    Loader, 
    FileText, 
    Plus, 
    Edit, 
    Copy,
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
        duplicateWorkPermit,
        clearError,
    } = useWorkPermitStore();
    
    const { companyData, getCompanyByUser } = useCompanyStore();
    const navigate = useNavigate();
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchWorkPermits();
        getCompanyByUser()
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

    const handleDuplicateWorkPermit = async (workPermitFormId) => {
            try {
                await duplicateWorkPermit(workPermitFormId);
                toast.success("work permit duplicated successfully");
                await getAllWorkPermits();
            } catch (error) {
                console.error("Error duplicating work permit:", error);
                toast.error("Failed to duplicate work permit");
            }
        };
    // const handleDuplicate = async (workPermit) => {
    //     try {
    //         const copyData = {
    //             title: `${workPermit.title} (Copy)`,
    //             sections: (workPermit.sections || []).map(section => ({
    //                 title: section.title,
    //                 enabled: section.enabled !== false,
    //                 components: (section.components || []).map(component => ({
    //                     label: component.label,
    //                     type: component.type,
    //                     required: component.required || false,
    //                     enabled: component.enabled !== false,
    //                     options: component.options || []
    //                 }))
    //             }))
    //         };
    //         await useWorkPermitStore.getState().createWorkPermit(copyData, companyData.id);
    //         toast.success("Work permit duplicated");
    //         fetchWorkPermits();
    //     } catch (error) {
    //         console.error("Error duplicating work permit:", error);
    //         toast.error("Failed to duplicate work permit");
    //     }
    // };

    const handleEditWorkPermit = (workPermitId) => {
        navigate({ to: `/page/app/form-builder/${workPermitId}` });
    };

    const handleViewWorkPermit = (workPermitId) => {
        // Open in form builder editor as requested
        navigate({ to: `/page/app/form-builder/${workPermitId}` });
    };

    const handleCreateNew = () => {
        navigate({ to: "/page/app/form-builder" });
    };

    // console.log(workPermits);
    console.log(companyData);
    
    const filteredPermits = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return workPermits;
        return workPermits.filter(wp =>
            (wp.title || "").toLowerCase().includes(q) ||
            (wp.workPermitNo || "").toString().toLowerCase().includes(q)
        );
    }, [workPermits, search]);

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
                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Work Permit Forms
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Manage your work permit forms for{" "}
                        {companyData?.compName || "your company"}
                    </p>
                </div>
                <div className="w-64">
                    <input
                        type="text"
                        placeholder="Search by title or permit no..."
                        className="w-full border rounded-md px-3 py-2 text-sm"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                {/* <Button onClick={handleCreateNew} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Form
                </Button> */}
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
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No work permit forms found
                        </h3>
                        <p className="text-gray-500 mb-4">
                            Get started by creating your first work permit form.
                        </p>
                        <Button
                            onClick={handleCreateNew}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Create Work Permit Form
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Permit No</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Company</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead>Sections</TableHead>
                            <TableHead className="text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredPermits.map((workPermit) => (
                            <TableRow key={workPermit.id}>
                                <TableCell className="text-gray-600">
                                    {workPermit.id}
                                </TableCell>
                                <TableCell className="text-gray-600">
                                    {workPermit.workPermitNo || "-"}
                                </TableCell>
                                <TableCell className="font-medium">
                                    {workPermit.title}
                                </TableCell>
                                <TableCell>
                                    {companyData?.compName || "Your Company"}
                                </TableCell>
                                <TableCell>
                                    {new Date(
                                        workPermit.createdAt,
                                    ).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    {workPermit.sections?.length || 0}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => navigate({ to: `/page/app/form-builder/view/${workPermit.id}` })}
                                        >
                                            <Eye className="mr-1 h-3 w-3" /> View
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => navigate({ to: `/page/app/form-builder/${workPermit.id}` })}
                                        >
                                            <Edit className="mr-1 h-3 w-3" /> Edit
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                handleDuplicateWorkPermit(
                                                    workPermit.id,
                                                )
                                            }
                                        >
                                            <Copy className="mr-1 h-3 w-3" />{" "}
                                            Duplicate
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableCaption>Work permits</TableCaption>
                </Table>
            )}
        </div>
    );
}

export { WorkPermitList };
