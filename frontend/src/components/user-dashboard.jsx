import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
    LogOut,
    User,
    Mail,
    Shield,
    Hash,
    Copy,
    Check,
    KeyRound,
    UserPen,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Link } from "@tanstack/react-router";

export default function UserDashboard() {
    const [copiedField, setCopiedField] = useState(null);
    const { authUser, isAuthCheck } = useAuthStore();

    const copyToClipboard = async (text, field) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedField(field);
            setTimeout(() => setCopiedField(null), 2000);
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    };

    // console.log("auth user, user dashboard, before useEffect: ", authUser); // here signin data is comming
    // ✅ Don't call checkAuth() in every component
    // Root runs it once and sets authUser in store
    // Components should only read { authUser, isAuthCheck }
    // Show loading UI until isAuthCheck is false
    // Logs may show null at first = normal async behavior

    // useEffect(() => {
    //     checkAuth()
    //     console.log("auth user, user dashboard, inside useEffect: ", authUser);
    // }, [])
    // console.log("auth user, user dashboard, after useEffect: ", authUser);

    if(isAuthCheck || !authUser) {
        return <div>Loading...</div>;
    }

    const userCreatedDate = new Date(authUser.createdAt);
    const dateOnly = userCreatedDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const userData = {
        name: authUser.name || "Unknown",
        email: authUser.email || "No email",
        role: authUser.role || "USER",
        accountId: authUser.id ? `${authUser.id}-75dk05` : "unknown-60hyt7d0",
        avatar: "/placeholder.svg?height=80&width=80",
        loginType: authUser.loginType || "Email",
        createdAt: dateOnly,
    };

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground mb-2">
                            Dashboard
                        </h1>
                        <p className="text-muted-foreground">
                            Manage your account and profile settings
                        </p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Profile Card */}
                    <Card className="lg:col-span-2">
                        <CardHeader className="pb-6">
                            <CardTitle className="flex items-center gap-2">
                                <User className="w-5 h-5" />
                                Profile Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Avatar and Basic Info */}
                            <div className="flex items-start gap-6">
                                <Avatar className="w-20 h-20">
                                    <AvatarImage
                                        src={
                                            userData.avatar ||
                                            "/placeholder.svg"
                                        }
                                        alt={userData.name}
                                    />
                                    <AvatarFallback className="text-lg">
                                        {userData.name.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground block mb-1">
                                            Full Name
                                        </label>
                                        <p className="text-lg font-semibold text-foreground">
                                            {userData.name}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground block mb-1">
                                            Account Role
                                        </label>
                                        <Badge
                                            variant="secondary"
                                            className="flex items-center justify-center text-center"
                                        >
                                            <Shield className="w-3 h-3 mr-0.5" />
                                            <span className="mb-0.5">
                                                {userData.role}
                                            </span>
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* Contact Information */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-lg border">
                                    <div className="flex items-center gap-3">
                                        <Mail className="w-5 h-5 text-muted-foreground" />
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground block">
                                                Email Address
                                            </label>
                                            <p className="font-medium">
                                                {userData.email}
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            copyToClipboard(
                                                userData.email,
                                                "email",
                                            )
                                        }
                                        className="text-muted-foreground"
                                    >
                                        {copiedField === "email" ? (
                                            <Check className="w-4 h-4" />
                                        ) : (
                                            <Copy className="w-4 h-4" />
                                        )}
                                    </Button>
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-lg border">
                                    <div className="flex items-center gap-3">
                                        <Hash className="w-5 h-5 text-muted-foreground" />
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground block">
                                                Account ID
                                            </label>
                                            <p className="font-mono text-sm">
                                                {userData.accountId}
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            copyToClipboard(
                                                userData.accountId,
                                                "accountId",
                                            )
                                        }
                                        className="text-muted-foreground"
                                    >
                                        {copiedField === "accountId" ? (
                                            <Check className="w-4 h-4" />
                                        ) : (
                                            <Copy className="w-4 h-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Actions Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">
                                Quick Actions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button
                                variant="outline"
                                className="w-full justify-start cursor-pointer"
                            >
                                <UserPen className="w-4 h-4 mr-2" />
                                Company Details
                            </Button>
                            <Link to={"/page/app/change-password"}>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start cursor-pointer"
                                >
                                    <KeyRound className="w-4 h-4 mr-2" />
                                    Change Password
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>

                {/* Account Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-muted-foreground text-sm font-medium">
                                        Login Type
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {userData.loginType}
                                    </p>
                                </div>
                                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-primary/10">
                                    <Shield className="w-6 h-6 text-primary" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-muted-foreground text-sm font-medium">
                                        Member Since
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {userData.createdAt}
                                    </p>
                                </div>
                                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-secondary/20">
                                    <User className="w-6 h-6 text-secondary-foreground" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* <Card className="bg-neutral-900/50 border-neutral-700/50 backdrop-blur-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-neutral-400 text-sm font-medium">
                                        Security Level
                                    </p>
                                    <p className="text-2xl font-bold text-yellow-400">
                                        Standard
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                                    <Shield className="w-6 h-6 text-yellow-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card> */}
                </div>
            </div>
        </div>
    );
}
