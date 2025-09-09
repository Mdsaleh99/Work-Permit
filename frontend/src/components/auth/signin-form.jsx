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
import { Label } from "@/components/ui/label";
import { Link } from "@tanstack/react-router";

export function SignInForm({ className, ...props }) {
    return (
        <div
            className={cn(
                "min-h-screen flex items-center justify-center bg-muted/20 p-4",
                className,
            )}
            {...props}
        >
            <Card className="w-full max-w-xl shadow-sm border-border">
                <CardHeader className="space-y-2">
                    <CardTitle>Login to your account</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                    <form className="space-y-6">
                        <div className="flex flex-col gap-4">
                            <div className="grid gap-3">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    className="border bg-background placeholder:text-muted-foreground"
                                />
                            </div>
                            <div className="grid gap-3">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    <a
                                        href="#"
                                        className="ml-auto inline-block text-xs text-muted-foreground underline-offset-4 hover:underline"
                                    >
                                        Forgot your password?
                                    </a>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="*******"
                                    className="border bg-background placeholder:text-muted-foreground"
                                />
                            </div>
                            <div className="flex flex-col gap-3">
                                <Button
                                    type="submit"
                                    className="w-full cursor-pointer h-10"
                                >
                                    Login
                                </Button>
                                <div className="flex flex-col gap-4">
                                    <Button
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
                                        Login with Microsoft
                                    </Button>

                                    <Button
                                        variant="outline"
                                        className="w-full cursor-pointer h-10"
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
                                        Login with Google
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 text-center text-sm text-muted-foreground">
                            Don&apos;t have an account?{" "}
                            <Link
                                to={"/auth/signup"}
                                className="underline underline-offset-4"
                            >
                                Sign up
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
