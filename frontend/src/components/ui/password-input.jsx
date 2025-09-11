import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

export function PasswordInput({ id, placeholder = "******", className = "", register, error, ...props }) {
    const [show, setShow] = React.useState(false)
    return (
        <div className="relative">
            <Input
                id={id}
                type={show ? "text" : "password"}
                placeholder={placeholder}
                className={className}
                {...register}
                {...props}
            />
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute inset-y-0 right-1 my-auto h-8 w-8 text-muted-foreground cursor-pointer"
                onClick={() => setShow((s) => !s)}
                aria-label={show ? "Hide password" : "Show password"}
            >
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            {error && (
                <p className="mt-1 text-red-500 text-sm">{error}</p>
            )}
        </div>
    )
}


