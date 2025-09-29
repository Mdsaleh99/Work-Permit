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
import { useCompanyStore } from "@/store/useCompanyStore";

const SignInSchema = z.object({
    email: z.email({ error: "incorrect email or password" }),
    password: z.string()
});

export function SignInForm({ className, ...props }) {
    const { register, handleSubmit, formState: { errors }, setError } = useForm({ resolver: zodResolver(SignInSchema) })
    const { isSignIn, signin, authError, clearAuthError, googleAuth } = useAuthStore()
    const { getCompanyByUser } = useCompanyStore();
    const navigate = useNavigate();
    const search = useSearch({ from: "/auth/signin" })



    // const targetHref = companyData ? "/page/app/dashboard" : "/company";
    // console.log("companyData in signin before useEffect: ", companyData);
    // console.log("targetHref in signin before useEffect: ", targetHref);
    

    React.useEffect(() => {
        // Clear any stale errors when landing on the page or when query changes
        clearAuthError()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search?.from])

    // React.useEffect(() => {
    //     getCompanyByUser()
    // }, [])

    // console.log("signin companyData: ", companyData);
    

    // useSearch() is a TanStack Router hook to read search params (query string) from the URL. It auto-syncs with the router and gives you type-safety if your route defines search params.
    // useLocation() gives you the current location object of the router. Think of it as React Router’s useLocation, but typed and reactive.
    // useStateRouter() gives you direct access to the router instance. It’s like the “engine” of TanStack Router in hook form.

    const onSubmit = async (data) => {
        try {
            await signin(data)
            clearAuthError()
            
            // After successful signin, check if user has a company
            try {
                const company = await getCompanyByUser();
                if (company) {
                    // User has a company, go to dashboard
                    navigate({to: "/page/app/dashboard"});
                } else {
                    // User doesn't have a company, go to create company
                    navigate({to: "/company/"});
                }
            } catch (companyError) {
                // If 404 error, user doesn't have a company
                if (companyError.response?.status === 404) {
                    navigate({to: "/company/"});
                } else {
                    // For other errors, still go to dashboard and let it handle the error
                    navigate({to: "/page/app/dashboard"});
                }
            }
        } catch (error) {
            // Map server field errors to form fields if provided
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
                    <CardTitle>Login to your account</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
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
                                    <Link
                                        to={"/auth/forgot-password"}
                                        className="ml-auto inline-block text-xs text-muted-foreground underline-offset-4 hover:underline"
                                    >
                                        Forgot your password?
                                    </Link>
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
                                <div className="flex flex-col gap-4">

                                    <Button
                                        variant="outline"
                                        className="w-full cursor-pointer h-10"
                                        type="button"
                                        onClick={() => googleAuth()}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                                fill="currentColor"
                                            />
                                        </svg>
                                        Login with Google
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 text-center text-sm text-muted-foreground">
                            Don&apos;t have an account?{" "}
                            <Link
                                to={"/auth/signup"}
                                className="underline underline-offset-4"
                            >
                                Sign up
                            </Link>
                        </div>
                        <div className="mt-2 text-center text-sm text-muted-foreground">
                            <span className="mr-1">Quick switch:</span>
                            <Link
                                to={"/auth/admin/signin"}
                                className="underline underline-offset-4 mr-2"
                            >
                                Sign in as Admin
                            </Link>
                            <span className="mx-1">|</span>
                            <Link
                                to={"/company-member/signin"}
                                className="underline underline-offset-4"
                            >
                                Sign in as Company Member
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
