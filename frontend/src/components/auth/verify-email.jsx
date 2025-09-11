import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MailCheck } from "lucide-react";

export default function VerifyEmail({ email }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-6">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-2 text-center">
                    <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <MailCheck className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle>Verify your email</CardTitle>
                    <CardDescription>
                        We sent a verification link to {email || "your email"}. Please check
                        your inbox and click the link to continue.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-center text-sm text-muted-foreground">
                    If you don't see the email, check your spam folder. You can request a new
                    verification link from your account later if needed.
                </CardContent>
            </Card>
        </div>
    );
}


