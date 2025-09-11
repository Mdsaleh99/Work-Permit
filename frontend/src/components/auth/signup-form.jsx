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
import { useAuthStore } from "@/store/useAuthStore";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { zodResolver } from "@hookform/resolvers/zod";
import {z} from "zod";
import { useForm } from "react-hook-form";
import { Loader } from "lucide-react";


const SignUpSchema = z.object({
    email: z.email({ error: "Enter valid email" }),
    password: z
        .string()
        .min(8, "Password must be atleast of 8 characters")
        .max(16, "password cannot exceed 16 characters"),
    name: z
        .string()
        .min(3, "name should be at least 3 character")
        .max(20, "name cannot exceed 20 character"),
});

export function SignUpForm({ className, ...props }) {
    // const [form, setForm] = useState({ email: "", password: "", name: "" });
    const {register, handleSubmit, formState: {errors}, setError} = useForm({resolver: zodResolver(SignUpSchema)})
    const navigate = useNavigate();
    const { isSignUp, signup, authError, clearAuthError, googleAuth } = useAuthStore();
    const search = useSearch({ from: "/auth/signup" })

    React.useEffect(() => {
        // Clear any stale errors when landing on the page or when query changes
        clearAuthError()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search?.from])

    // const handleChange = (e) => {
            // Copy the old form state (...form)
            // Update only the field that changed ([e.target.name]) with new value (e.target.value)
            // [] here means dynamic key, not array.
            // It uses input's name as the object key. like email, password
    //     setForm({ ...form, [e.target.name]: e.target.value });
    //     console.log(form);
    // };
    /*
        const field = "email";
        const value = "abc@test.com";
        const obj = {
        [field]: value,  // creates { email: "abc@test.com" }
        };
    */

    
    const onSubmit = async (data) => {
        // e.preventDefault()
        try {
            console.log(data);
            await signup(data)
            clearAuthError()
            // only navigate if signup succeeded
            navigate({ to: "/auth/verify-email" });
        } catch (error) {
            // prevent navigation on error; map server field errors if provided
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
                <CardHeader className="text-center space-y-2">
                    <CardTitle className="text-xl">Welcome</CardTitle>
                    <CardDescription>
                        Sign up with your GitHub or Google account
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                    <form
                        className="space-y-6"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        {authError && (
                            <Alert variant="destructive">
                                <AlertDescription>
                                    {authError.message}
                                </AlertDescription>
                            </Alert>
                        )}
                        {(authError || search?.from === "resend") && (
                            <Alert variant="destructive">
                                <AlertDescription>
                                    {authError?.message || "Please create an account to continue"}
                                </AlertDescription>
                            </Alert>
                        )}
                        <div className="grid gap-4">
                            <div className="grid gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full cursor-pointer h-10"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        role="img"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                    >
                                        <title>Microsoft</title>
                                        <rect
                                            x="1"
                                            y="1"
                                            width="10"
                                            height="10"
                                            rx="1"
                                        />
                                        <rect
                                            x="13"
                                            y="1"
                                            width="10"
                                            height="10"
                                            rx="1"
                                        />
                                        <rect
                                            x="1"
                                            y="13"
                                            width="10"
                                            height="10"
                                            rx="1"
                                        />
                                        <rect
                                            x="13"
                                            y="13"
                                            width="10"
                                            height="10"
                                            rx="1"
                                        />
                                    </svg>
                                    Sign up with Microsoft
                                </Button>

                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full cursor-pointer h-10"
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
                                    Sign up with Google
                                </Button>
                            </div>
                            <div className="after:border-border relative text-center text-xs text-muted-foreground after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                                <span className="bg-card text-muted-foreground relative z-10 px-2">
                                    Or continue with
                                </span>
                            </div>
                            <div className="grid gap-4">
                                <div className="grid gap-3">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        name="name"
                                        {...register("name")}
                                        placeholder="john23"
                                        className={`border bg-background placeholder:text-muted-foreground ${
                                            errors.name ? "input-error" : ""
                                        }`}
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-sm">
                                            {errors.name.message}
                                        </p>
                                    )}
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        name="email"
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
                                        <Label htmlFor="password">
                                            Password
                                        </Label>
                                    </div>
                                    <PasswordInput
                                        id="password"
                                        register={register("password")}
                                        placeholder="******"
                                        className={`"border bg-background placeholder:text-muted-foreground ${errors.password ? "input-error" : ""}`}
                                        error={errors.password?.message}
                                    />
                                    {errors.password && (
                                        <p className="text-red-500 text-sm">
                                            {errors.password.message}
                                        </p>
                                    )}
                                </div>
                                <Button
                                    type="submit"
                                    disabled={isSignUp} // if isSignUp is ture then disabled
                                    className="w-full cursor-pointer h-10"
                                >
                                    {isSignUp ? (
                                        <>
                                            <Loader className="h-5 w-5 animate-spin mr-2" />
                                            Loading...
                                        </>
                                    ) : (
                                        "Sign up"
                                    )}
                                </Button>
                            </div>
                            <div className="text-center text-sm text-muted-foreground">
                                Already have an account?{" "}
                                <Link
                                    to={"/auth/signin"}
                                    className="underline underline-offset-4 cursor-pointer"
                                >
                                    Sign in
                                </Link>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
