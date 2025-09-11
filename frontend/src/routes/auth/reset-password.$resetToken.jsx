import React from "react";
import {
    createFileRoute,
    useParams,
    Link,
    useNavigate,
} from "@tanstack/react-router";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

export const Route = createFileRoute("/auth/reset-password/$resetToken")({
    component: RouteComponent,
});

const Schema = z.object({
    newPassword: z
        .string()
        .min(8, "Password must be atleast of 8 characters")
        .max(16, "password cannot exceed 16 characters"),
});

function RouteComponent() {
    const { resetToken } = useParams({
        from: "/auth/reset-password/$resetToken",
    });
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm({ resolver: zodResolver(Schema) });
    const [loading, setLoading] = React.useState(false);
    const { resetPassword, authError } = useAuthStore();

    const onSubmit = async (data) => {
        try {
            setLoading(true);
          await resetPassword(resetToken, data.newPassword);
          toast.success("Password reset successful. Redirecting to sign in...");
            setTimeout(() => navigate({ to: "/auth/signin" }), 2000);
        } catch (error) {
            setLoading(false);
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
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
            <Card className="w-full max-w-xl shadow-sm border-border">
                <CardHeader className="space-y-2">
                    <CardTitle>Reset password</CardTitle>
                    <CardDescription>Enter your new password</CardDescription>
                </CardHeader>
                <CardContent>
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
                        <div className="grid gap-3">
                            <Label htmlFor="password">New Password</Label>
                            <PasswordInput
                                id="password"
                                register={register("newPassword")}
                                placeholder="******"
                                error={errors.newPassword?.message}
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="cursor-pointer"
                        >
                            {loading ? "Saving..." : "Set new password"}
                        </Button>
                        <div className="text-center text-sm text-muted-foreground">
                            Remembered your password?{" "}
                            <Link
                                to="/auth/signin"
                                className="underline underline-offset-4"
                            >
                                Sign in
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
