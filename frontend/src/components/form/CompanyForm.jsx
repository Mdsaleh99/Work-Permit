import React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import z from "zod";
import { useCompanyStore } from "@/store/useCompanyStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertDescription } from "../ui/alert";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

const CompanySchema = z.object({
    compName: z
        .string()
        .min(3, "company name should be at least 3 character")
        .max(30, "company name can not exceed 30 character"),
    description: z
        .string()
        .max(200, "description can not be exceed 200 character")
        .optional(),
    email: z.email({ error: "Please enter a valid company email address" }),
    mobileNo: z
        .string({ required_error: "please provide your company mobile no" })
        .min(1, "Mobile number is required"),
});

function CompanyForm() {
    const { isCreateCompany, createCompany, companyError, clearCompanyError } =
        useCompanyStore();
    // const { markSetupCompleted } = useAuthStore();
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm({ resolver: zodResolver(CompanySchema) });
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            await createCompany(data);
            // markSetupCompleted(); // Mark setup as completed
            toast.success("Company created successfully");
            setTimeout(() => navigate({ to: "/page/app/dashboard" }), 1000);
        } catch (error) {
            if (Array.isArray(error?.errors)) {
                error.errors.forEach((e) => {
                    if (e?.filePath && e?.message) {
                        setError(e.filePath, {
                            type: "server",
                            message: e.message,
                        });
                    }
                });
            }
        }
    };

    // Clear error on component mount
    React.useEffect(() => {
        clearCompanyError();
    }, [clearCompanyError]);

    return (
        <div className="max-w-2xl mx-auto p-6 mt-20">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">
                        Create Company
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        {companyError && (
                            <Alert variant="destructive">
                                <AlertDescription>
                                    {companyError.message}
                                </AlertDescription>
                            </Alert>
                        )}
                        <div className="space-y-2">
                            <Label
                                htmlFor="compName"
                                className="text-sm font-medium"
                            >
                                Company Name *
                            </Label>
                            <Input
                                type="text"
                                {...register("compName")}
                                placeholder="Enter company name"
                                className={
                                    errors.compName ? "border-red-500" : ""
                                }
                            />
                            {errors.compName && (
                                <p className="text-sm text-red-500">
                                    {errors.compName.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="description"
                                className="text-sm font-medium"
                            >
                                Description
                            </Label>
                            <textarea
                                {...register("description")}
                                placeholder="Enter company description"
                                rows={4}
                                className={`w-full px-3 py-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.description ? "border-red-500" : "border-gray-300"}`}
                            />
                            {errors.description && (
                                <p className="text-sm text-red-500">
                                    {errors.description.message}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="email"
                                className="text-sm font-medium"
                            >
                                Email *
                            </Label>
                            <Input
                                type="email"
                                {...register("email")}
                                placeholder="Enter company email"
                                className={errors.email ? "border-red-500" : ""}
                            />
                            {errors.email && (
                                <p className="text-sm text-red-500">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Mobile Number */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="mobileNo"
                                className="text-sm font-medium"
                            >
                                Mobile Number *
                            </Label>
                            <Input
                                type="tel"
                                {...register("mobileNo")}
                                placeholder="Enter mobile number"
                                className={
                                    errors.mobileNo ? "border-red-500" : ""
                                }
                            />
                            {errors.mobileNo && (
                                <p className="text-sm text-red-500">
                                    {errors.mobileNo.message}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end space-x-4">
                            <Button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
                            >
                                {isCreateCompany ? (
                                    <>
                                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    "Create Company"
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

export default CompanyForm;
