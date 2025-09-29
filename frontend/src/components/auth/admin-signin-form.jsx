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
import { useAuthStore } from "@/store/useAuthStore";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader } from "lucide-react";

const AdminSignInSchema = z.object({
    companyId: z.string().min(1, { message: "Company ID is required" }),
    email: z.email({ error: "incorrect email or password" }),
    password: z.string(),
});

export function AdminSignInForm({ className, ...props }) {
    const { register, handleSubmit, formState: { errors }, setError } = useForm({ resolver: zodResolver(AdminSignInSchema) })
    const { isSignIn, signinAdmin, authError, clearAuthError } = useAuthStore()
    const navigate = useNavigate();
    const search = useSearch({ from: "/auth/admin/signin" })

    React.useEffect(() => {
        clearAuthError()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search?.from])

    const onSubmit = async (data) => {
        try {
            const { companyId, email, password } = data;
            await signinAdmin(companyId, { email, password })
            // Only ADMIN allowed on this page
            const user = useAuthStore.getState().authUser;
            if (!user || user.role !== 'ADMIN') {
                setError('email', { type: 'server', message: 'Only Admin can sign in on this page' });
                return;
            }
            navigate({ to: "/page/app/dashboard" })
        } catch (error) {
            if (Array.isArray(error?.errors)) {
                error.errors.forEach((e) => {
                    if (e?.filePath && e?.message) {
                        setError(e.filePath, { type: "server", message: e.message })
                    }
                })
            }
        }
    }

    return (
        <div
            className={cn(
                "min-h-screen flex items-center justify-center bg-muted/20 p-4",
                className,
            )}
            {...props}
        >
            <Card className="w-full max-w-xl shadow-sm border-border">
            <CardHeader className="space-y-2">
                <CardTitle>Admin Sign In</CardTitle>
                <CardDescription>
                    Enter your company ID and credentials to sign in
                </CardDescription>
            </CardHeader>
                <CardContent className="pt-0">
                    <form
                        className="space-y-6"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        {(authError || search?.from === "resend") && (
                            <Alert variant="destructive">
                                <AlertDescription>
                                    {authError?.message || "Please login to continue"}
                                </AlertDescription>
                            </Alert>
                        )}
                        <div className="flex flex-col gap-4">
                            <div className="grid gap-3">
                                <Label htmlFor="companyId">Company ID</Label>
                                <Input
                                    id="companyId"
                                    type="text"
                                    {...register("companyId")}
                                    placeholder="Enter company ID"
                                    className={`${errors.companyId ? "input-error" : ""}`}
                                />
                                {errors.companyId && (
                                    <p className="text-red-500 text-sm">
                                        {errors.companyId.message}
                                    </p>
                                )}
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    {...register("email")}
                                    placeholder="m@example.com"
                                    className={`"border bg-background placeholder:text-muted-foreground ${errors.email ? "input-error" : ""}`}
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>
                            <div className="grid gap-3">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                </div>
                                <PasswordInput
                                    id="password"
                                    register={register("password")}
                                    placeholder="*******"
                                    className={`"border bg-background placeholder:text-muted-foreground`}
                                />
                            </div>
                            <div className="flex flex-col gap-3">
                                <Button
                                    type="submit"
                                    disabled={isSignIn}
                                    className="w-full cursor-pointer h-10"
                                >
                                    {isSignIn ? (
                                        <>
                                            <Loader className="h-5 w-5 animate-spin mr-2" />
                                            Loading...
                                        </>
                                    ) : (
                                        "Login"
                                    )}
                                </Button>
                                <div className="text-center text-sm text-muted-foreground">
                                    <Link to={"/auth/signin"} className="underline underline-offset-4">Back to Super Admin sign in</Link>
                                </div>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}


