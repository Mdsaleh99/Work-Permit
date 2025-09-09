import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { Link } from "@tanstack/react-router";

export default function VerifiedSuccess() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-6">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-2 text-center">
                    <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                    </div>
                    <CardTitle>Email verified</CardTitle>
                    <CardDescription>
                        Your email has been successfully verified. You can now sign in.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild className="w-full">
                        <Link to="/auth/signin">Go to Sign in</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}


