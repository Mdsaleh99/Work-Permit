import React from "react";
import { createFileRoute } from "@tanstack/react-router";
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
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

export const Route = createFileRoute("/page/app/change-password")({
    component: RouteComponent,
});

const Schema = z.object({
    oldPassword: z.string().min(1, "Old password is required"),
    newPassword: z
        .string()
        .min(8, "Password must be atleast of 8 characters")
        .max(16, "password cannot exceed 16 characters"),
});

function RouteComponent() {
    const { authUser, authError, changePassword } = useAuthStore();
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setError,
    } = useForm({ resolver: zodResolver(Schema) });
    const [loading, setLoading] = React.useState(false);

    // const onSubmit = async (data) => {
    const onSubmit = async ({ oldPassword, newPassword }) => {
        try {
            setLoading(true);
            // await changePassword(data.oldPassword, data.newPassword); OR
            // await changePassword(data); OR
            await changePassword(oldPassword, newPassword);
            toast.success("Password changed successfully");
            reset();
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
                    <CardTitle>Change password</CardTitle>
                    <CardDescription>
                        Update your password, {authUser?.name}
                    </CardDescription>
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
                            <Label htmlFor="oldPassword">Old Password</Label>
                            <Input
                                id="oldPassword"
                                type="password"
                                placeholder="******"
                                {...register("oldPassword")}
                            />
                            {errors.oldPassword && (
                                <p className="text-red-500 text-sm">
                                    {errors.oldPassword.message}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="newPassword">New Password</Label>
                            <Input
                                id="newPassword"
                                type="password"
                                placeholder="******"
                                {...register("newPassword")}
                            />
                            {errors.newPassword && (
                                <p className="text-red-500 text-sm">
                                    {errors.newPassword.message}
                                </p>
                            )}
                        </div>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="cursor-pointer"
                        >
                            {loading ? "Saving..." : "Change password"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
