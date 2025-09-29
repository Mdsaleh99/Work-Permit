import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useCompanyStore } from "@/store/useCompanyStore";
import { useAuthStore } from "@/store/useAuthStore";

const AdminSchema = z.object({
    name: z.string().min(3, "Name should be at least 3 characters").max(50),
    email: z.email({ error: "Enter valid email" }),
    password: z
        .string({ required_error: "Password is required" })
        .min(8, "Password must be atleast of 8 characters")
        .max(16, "Password cannot exceed 16 characters"),
});

export function AdminCreateInline() {
    const { getCompanyByUser } = useCompanyStore();
    const { authError, createAdmin, isCreatingAdmin } = useAuthStore();
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState("");

    const { register, handleSubmit, formState: { errors }, setError, reset } = useForm({ resolver: zodResolver(AdminSchema) });

    React.useEffect(() => {
        if (open) {
            reset({ name: "", email: "", password: "" });
            setSuccess("");
        }
    }, [open, reset]);

    const onSubmit = async (data) => {
        setSuccess("");
        setLoading(true);
        try {
            const company = await getCompanyByUser();
            const companyId = company?.id;
            if (!companyId) throw new Error("Company not found");
            await createAdmin(companyId, data);
            setSuccess("Admin created");
            reset({ name: "", email: "", password: "" });
            setOpen(false);
            // Optional: soft refresh list by emitting event or expose getAdmins()
        } catch (error) {
            if (Array.isArray(error?.errors)) {
                error.errors.forEach((e) => {
                    if (e?.filePath && e?.message) {
                        setError(e.filePath, { type: "server", message: e.message });
                    }
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="cursor-pointer">
                    Add Admin
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Create Admin</DialogTitle>
                    <DialogDescription>
                        Add a new admin to your company.
                    </DialogDescription>
                </DialogHeader>
                {(authError || success) && (
                    <Alert variant={authError ? "destructive" : "default"}>
                        <AlertDescription>
                            {authError?.message || success}
                        </AlertDescription>
                    </Alert>
                )}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                    <div>
                        <Label htmlFor="a_name">Full name</Label>
                        <Input id="a_name" placeholder="Full name" aria-invalid={!!errors.name} {...register("name")} />
                        {errors.name && (
                            <p className="text-xs text-red-600">{errors.name.message}</p>
                        )}
                    </div>
                    <div>
                        <Label htmlFor="a_email">Email</Label>
                        <Input id="a_email" type="email" placeholder="admin@example.com" aria-invalid={!!errors.email} {...register("email")} />
                        {errors.email && (
                            <p className="text-xs text-red-600">{errors.email.message}</p>
                        )}
                    </div>
                    <div>
                        <Label htmlFor="a_password">Password</Label>
                        <PasswordInput id="a_password" register={register("password")} placeholder="*******" className={"border bg-background placeholder:text-muted-foreground"} />
                        {errors.password && (
                            <p className="text-xs text-red-600">{errors.password.message}</p>
                        )}
                    </div>
                    <div className="flex items-center justify-end gap-2 pt-1">
                        <Button type="button" variant="outline" size="sm" className="cursor-pointer" onClick={() => setOpen(false)} disabled={loading}>Cancel</Button>
                        <Button type="submit" size="sm" className="cursor-pointer" disabled={loading}>{loading ? 'Creating…' : 'Create'}</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}


