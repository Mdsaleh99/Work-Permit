import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import React from "react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader, Building2, User } from "lucide-react";
import { useCompanyStore } from "@/store/useCompanyStore";
import { CompanyMemberRoles } from "@/lib/constants";

const SignInSchema = z.object({
    companyId: z.string().min(1, { message: "Company ID is required for member signin" }),
    email: z.email({ error: "incorrect email or password" }),
    password: z.string({ error: "password is required" }),
});

export function CompanyMemberSignin({ className, ...props }) {
    const search = useSearch({ from: "/company-member/signin" });
    const defaultCompanyId = search?.companyId || "";

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        setValue,
        watch,
    } = useForm({ resolver: zodResolver(SignInSchema), defaultValues: { companyId: defaultCompanyId } });
    
    const {
        getCompanyByUser,
        companyError,
        companyMemberSignIn,
        getCurrentCompanyMember,
        clearCompanyError,
        isCompanyMemberSigningIn,
    } = useCompanyStore();
    const navigate = useNavigate();

    React.useEffect(() => {
        // Clear any stale errors when landing on the page or when query changes
        clearCompanyError()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search?.from]);

    const onSubmit = async (data) => {
        try {
            // Use company ID from form (prefilled from URL if present)
            const companyId = data.companyId?.trim();
            if (!companyId) return; // zod covers validation

            const { email, password } = data;
            const member = await companyMemberSignIn({ email, password }, companyId);
            
            // Navigate based on member role
            const role = member?.role;
            if (role === CompanyMemberRoles.MANAGER) {
                navigate({ to: "/page/app/dashboard" });
            } else if (role === CompanyMemberRoles.COMPANY_MEMBER) {
                navigate({ to: "/page/app/form-fill/$workPermitId" });
            } else {
                // Fallback
                navigate({ to: "/page/app/dashboard" });
            }
        } catch (error) {
            // Map server field errors to form fields if provided
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

    return (
        <div
            className={cn(
                "min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4",
                className,
            )}
            {...props}
        >
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-blue-600 rounded-full">
                            <Building2 className="h-8 w-8 text-white" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Company Member Sign In
                    </h1>
                    <p className="text-gray-600">
                        Access your company workspace
                    </p>
                </div>

                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                    <CardHeader className="space-y-1 pb-4">
                        <CardTitle className="text-xl text-center">
                            Welcome Back
                        </CardTitle>
                        <CardDescription className="text-center">
                            Sign in to continue to your company dashboard
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form
                            className="space-y-4"
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            {(companyError || errors.root) && (
                                <Alert variant="destructive">
                                    <AlertDescription>
                                        {errors.root?.message || 
                                         companyError?.message ||
                                         "Please check your credentials and try again"}
                                    </AlertDescription>
                                </Alert>
                            )}
                            
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="companyId" className="text-sm font-medium">
                                        Company ID
                                    </Label>
                                    <div className="relative">
                                        <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="companyId"
                                            type="text"
                                            {...register("companyId")}
                                            placeholder="Enter your company ID"
                                            className={`pl-10 ${errors.companyId ? "border-red-500 focus:border-red-500" : ""}`}
                                        />
                                    </div>
                                    {errors.companyId && (
                                        <p className="text-red-500 text-sm">
                                            {errors.companyId.message}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-medium">
                                        Email Address
                                    </Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="email"
                                            type="email"
                                            {...register("email")}
                                            placeholder="member@company.com"
                                            className={`pl-10 ${errors.email ? "border-red-500 focus:border-red-500" : ""}`}
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="text-red-500 text-sm">
                                            {errors.email.message}
                                        </p>
                                    )}
                                </div>
                                
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-sm font-medium">
                                        Password
                                    </Label>
                                    <PasswordInput
                                        id="password"
                                        register={register("password")}
                                        placeholder="Enter your password"
                                        className={errors.password ? "border-red-500 focus:border-red-500" : ""}
                                    />
                                    {errors.password && (
                                        <p className="text-red-500 text-sm">
                                            {errors.password.message}
                                        </p>
                                    )}
                                </div>
                                
                                <Button
                                    type="submit"
                                    disabled={isCompanyMemberSigningIn}
                                    className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                                >
                                    {isCompanyMemberSigningIn ? (
                                        <>
                                            <Loader className="h-4 w-4 animate-spin mr-2" />
                                            Signing In...
                                        </>
                                    ) : (
                                        "Sign In"
                                    )}
                                </Button>
                            </div>
                        </form>
                        
                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Need help?{" "}
                                <Link 
                                    to="/contact" 
                                    className="text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    Contact Support
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
