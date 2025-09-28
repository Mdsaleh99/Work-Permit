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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useWorkPermitStore } from "@/store/useWorkPermitStore";

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
    const { getAllWorkPermits } = useWorkPermitStore();
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

    const [availablePermits, setAvailablePermits] = React.useState([]);
    const [selectedPermitIds, setSelectedPermitIds] = React.useState([]);

    React.useEffect(() => {
        if (!open) return;
        (async () => {
            try {
                const companyData = await getCompanyByUser();
                const all = await getAllWorkPermits();
                const list = Array.isArray(all)
                    ? all.filter((p) => !companyData?.id || p.companyId === companyData.id)
                    : [];
                setAvailablePermits(list);
            } catch {}
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    const togglePermit = (id) => {
        setSelectedPermitIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
        );
    };

    const onSubmit = async (data) => {
        try {
            const companyData = await getCompanyByUser();
            const companyId = companyData?.id;
            // console.log("companyId: ", companyId);
            // console.log("data: ", data);
            await createCompanyMember({ ...data, allowedWorkPermitIds: selectedPermitIds }, companyId);
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
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Add New Member</DialogTitle>
                    <DialogDescription>
                        Create a new company member with access to work permits.
                    </DialogDescription>
                </DialogHeader>
                <form
                    className="space-y-3"
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
                <div className="mt-4 border-t pt-3">
                    <div className="text-sm font-medium mb-2">Allow permits for this member</div>
                    <div className="max-h-40 overflow-auto space-y-2">
                        {availablePermits.length === 0 ? (
                            <div className="text-xs text-gray-500">No permits available</div>
                        ) : (
                            availablePermits.map((p) => (
                                <label key={p.id} className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4"
                                        checked={selectedPermitIds.includes(p.id)}
                                        onChange={() => togglePermit(p.id)}
                                    />
                                    <span>{p.title}{p.workPermitNo ? ` — ${p.workPermitNo}` : ""}</span>
                                </label>
                            ))
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
