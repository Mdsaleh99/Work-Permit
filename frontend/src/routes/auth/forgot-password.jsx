import React from "react";
import {
    createFileRoute,
    Link,
} from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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

export const Route = createFileRoute("/auth/forgot-password")({
    component: RouteComponent,
});

const Schema = z.object({ email: z.email({ error: "Enter a valid email" }) });

function RouteComponent() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm({ resolver: zodResolver(Schema) });
    const [loading, setLoading] = React.useState(false);
    const { forgotPassword, authError } = useAuthStore();

  const onSubmit = async (data) => {
      try {
          setLoading(true);
        await forgotPassword(data.email);
        // console.log("data: ", data);
        // console.log("emai: ", data.email);
          toast.success("a reset link has been sent to your email.");
      } catch (error) {
          setLoading(false);
          toast.error(error?.message || "Something went wrong. Please try again.");
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
                    <CardTitle>Forgot password</CardTitle>
                    <CardDescription>
                        Enter your email to receive a reset link
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
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                
                                placeholder="m@example.com"
                                {...register("email")}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="cursor-pointer"
                        >
                            {loading ? "Sending..." : "Send reset link"}
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
