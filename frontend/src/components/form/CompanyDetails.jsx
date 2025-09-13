import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "@tanstack/react-router";
import { useCompanyStore } from "@/store/useCompanyStore";
import { Loader, Building2, Mail, Phone, FileText, Edit, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

function CompanyDetails() {
    const { getCompanyByUser, companyData } = useCompanyStore();
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCompany();
    }, []);

    const fetchCompany = async () => {
        try {
            setLoading(true);
            await getCompanyByUser();
            console.log("Company data: ", companyData);
            
            setCompany(companyData || null);
        } catch (error) {
            console.error("Error fetching company:", error);
            toast.error("Failed to fetch company");
        } finally {
            setLoading(false);
        }
    };

    // ! const handleEditCompany = (companyId) => {
    // !    navigate({ to: `/page/app/edit-company/${companyId}` });
    //! };

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto p-6 mt-20">
                <div className="flex items-center justify-center h-64">
                    <Loader className="h-8 w-8 animate-spin" />
                    <span className="ml-2">Loading company...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 mt-20">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Company Details</h1>
                <p className="text-gray-600 mt-2">Your company information</p>
            </div>

            {!company ? (
                <Card>
                    <CardContent className="text-center py-12">
                        <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No company found</h3>
                        <p className="text-gray-500 mb-4">Get started by creating your company.</p>
                        <Button 
                            onClick={() => navigate({ to: "/company/" })} 
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Create Company
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Building2 className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-semibold text-gray-900">
                                        {company.compName}
                                    </CardTitle>
                                    <Badge variant="secondary" className="mt-1">
                                        Active
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                                <Mail className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-600">{company.email}</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Phone className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-600">{company.mobileNo}</span>
                            </div>
                            {company.description && (
                                <div className="flex items-start space-x-3">
                                    <FileText className="h-4 w-4 text-gray-400 mt-0.5" />
                                    <p className="text-sm text-gray-600">
                                        {company.description}
                                    </p>
                                </div>
                            )}
                        </div>
                        
                        {/* <div className="flex space-x-2 mt-4 pt-4 border-t">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditCompany(company.id)}
                                className="flex-1"
                            >
                                <Edit className="mr-1 h-3 w-3" />
                                Edit Company
                            </Button>
                        </div> */}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

export { CompanyDetails };
