import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearch } from "@tanstack/react-router";
import { useCompanyStore } from "@/store/useCompanyStore";
import { PasswordInput } from "../ui/password-input";
import { Label } from "../ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

const CompanyMembersSchema = z.object({
    email: z.email({ error: "Enter valid email" }),
    password: z
        .string({ required_error: "Password is required" })
        .min(8, "Password must be atleast of 8 characters")
        .max(16, "Password cannot exceed 16 characters"),
    name: z
        .string({ required_error: "Name is required" })
        .min(3, "Name should be at least 3 characters")
        .max(20, "Name cannot exceed 20 characters"),
});

export default function AddMemberModal({ open, onClose, loading }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        reset,
    } = useForm({ resolver: zodResolver(CompanyMembersSchema) });
    const {
        clearCompanyError,
        createCompanyMember,
        getCompanyByUser,
        companyError,
    } = useCompanyStore();
    const search = useSearch({ from: "/page/app/company-members" });

    React.useEffect(() => {
        // Clear any stale errors when landing on the page or when query changes
        clearCompanyError();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search?.from]);

    // console.log("companyMemberData: ", companyMemberData);

    React.useEffect(() => {
        if (open) {
            reset({ email: "", name: "", password: "" });
        }
    }, [open, reset]);

    if (!open) return null;

    const onSubmit = async (data) => {
        try {
            const companyData = await getCompanyByUser();
            const companyId = companyData?.id;
            // console.log("companyId: ", companyId);
            // console.log("data: ", data);
            await createCompanyMember(data, companyId);
            // Close immediately on success so the page can refresh the list
            onClose?.();
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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-white/20 backdrop-blur-[2px]"
                onClick={() => !loading && onClose?.()}
            ></div>
            <div className="relative z-10 w-full max-w-md rounded-md border bg-white p-4 shadow-lg">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 className="text-base font-semibold">
                            Add New Member
                        </h2>
                    </div>
                    <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() => !loading && onClose?.()}
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>
                <form
                    className="mt-4 space-y-3"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div className="space-y-1.5">
                        {(companyError || search?.from === "resend") && (
                            <Alert variant="destructive">
                                <AlertDescription>
                                    {companyError?.errors?.[0]?.message || companyError?.message ||
                                        "Please try again later"}
                                </AlertDescription>
                            </Alert>
                        )}
                        <Label htmlFor="name" className="text-sm font-medium">
                            Name
                        </Label>
                        <Input
                            type="text"
                            placeholder="Member Name"
                            aria-invalid={!!errors.name}
                            {...register("name")}
                        />
                        {errors.name && (
                            <p className="text-xs text-red-600">
                                {errors.name.message}
                            </p>
                        )}
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-sm font-medium">
                            Email
                        </Label>
                        <Input
                            type="email"
                            placeholder="member@example.com"
                            aria-invalid={!!errors.email}
                            {...register("email")}
                        />
                        {errors.email && (
                            <p className="text-xs text-red-600">
                                {errors.email.message}
                            </p>
                        )}
                    </div>
                    <div className="space-y-1.5">
                        <Label
                            htmlFor="password"
                            className="text-sm font-medium"
                        >
                            Password
                        </Label>
                        <PasswordInput
                            id="password"
                            register={register("password")}
                            placeholder="*******"
                            className={"border bg-background placeholder:text-muted-foreground"}
                        />
                        {errors.password && (
                            <p className="text-xs text-red-600">
                                {errors.password.message}
                            </p>
                        )}
                    </div>
                    <div className="pt-2 flex items-center justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onClose?.()}
                            disabled={loading}
                            className="cursor-pointer"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="cursor-pointer"
                        >
                            {loading ? "Adding…" : "Add Member"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
