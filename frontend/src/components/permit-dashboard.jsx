"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    AlertTriangle,
    CheckCircle,
    Clock,
    XCircle,
    RotateCcw,
    Ban,
    Calendar,
    Settings,
    Filter,
    FileText,
    Files,
    PencilRuler,
    Plus,
} from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import React from "react";
import { useWorkPermitStore } from "@/store/useWorkPermitStore";

// Cards will be built dynamically from backend data

// Removed KPI static data – dashboard now uses live data only

// Types aggregated from work permits (by title)

// Removed location widget – not required

export function PermitsDashboard() {
    const navigate = useNavigate();
    const { getAllWorkPermits, workPermits, isFetching } = useWorkPermitStore();

    React.useEffect(() => {
        getAllWorkPermits().catch(() => {});
    }, [getAllWorkPermits]);

    const statusCounts = React.useMemo(() => {
        const stats = { PENDING: 0, APPROVED: 0, CLOSED: 0, CANCELLED: 0 };
        (workPermits || []).forEach(wp => {
            const s = (wp.status || 'PENDING').toUpperCase();
            if (stats[s] !== undefined) stats[s] += 1;
        });
        return stats;
    }, [workPermits]);

    const cards = React.useMemo(() => ([
        { key: 'PENDING', label: 'Pending', value: statusCounts.PENDING, icon: Clock, color: 'bg-blue-500' },
        { key: 'APPROVED', label: 'Approved', value: statusCounts.APPROVED, icon: CheckCircle, color: 'bg-green-500' },
        { key: 'CLOSED', label: 'Closed', value: statusCounts.CLOSED, icon: XCircle, color: 'bg-gray-500' },
        { key: 'CANCELLED', label: 'Rejected', value: statusCounts.CANCELLED, icon: Ban, color: 'bg-red-500' },
    ]), [statusCounts]);

    const typesAggregated = React.useMemo(() => {
        const map = new Map();
        (workPermits || []).forEach(wp => {
            const type = wp.title || 'Unknown';
            map.set(type, (map.get(type) || 0) + 1);
        });
        return Array.from(map.entries()).map(([type, count]) => ({ type, totalCount: count }));
    }, [workPermits]);

    const handleCreateNewForm = () => {
        navigate({ to: "/page/app/form-builder" });
    };

    const handleViewWorkPermits = () => {
        navigate({ to: "/page/app/work-permits" });
    };

    return (
        <div className="p-6 space-y-6 bg-background min-h-screen">
            {/* Alert Notifications */}
            {/* <div className="space-y-2">
                <Alert className="border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                        16 Observations assigned to you
                    </AlertDescription>
                </Alert>
                <Alert className="border-yellow-200 bg-yellow-50">
                    <Clock className="h-4 w-4 text-yellow-600" />
                    <AlertDescription className="text-yellow-800">
                        12 Permits need your approval
                    </AlertDescription>
                </Alert>
            </div> */}

            {/* Navigation Tabs */}
            <Tabs defaultValue="permits" className="w-full">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <TabsList className="grid w-full lg:max-w-2xl grid-cols-2 lg:grid-cols-4 h-auto">
                        <TabsTrigger value="permits" className="text-xs lg:text-sm px-2 lg:px-4 py-2">
                            <span className="hidden sm:inline">PERMITS</span>
                            <span className="sm:hidden">PERMITS</span>
                        </TabsTrigger>
                        {/* <TabsTrigger value="observations" className="text-xs lg:text-sm px-2 lg:px-4 py-2">
                            <span className="hidden sm:inline">OBSERVATIONS</span>
                            <span className="sm:hidden">OBS</span>
                        </TabsTrigger>
                        <TabsTrigger value="audits" className="text-xs lg:text-sm px-2 lg:px-4 py-2">
                            <span className="hidden sm:inline">AUDITS</span>
                            <span className="sm:hidden">AUDITS</span>
                        </TabsTrigger>
                        <TabsTrigger value="fleet" className="text-xs lg:text-sm px-2 lg:px-4 py-2">
                            <span className="hidden sm:inline">FLEET MGMT</span>
                            <span className="sm:hidden">FLEET</span>
                        </TabsTrigger> */}
                    </TabsList>

                    {/* Removed site/financial year selectors as requested */}
                </div>

                <TabsContent value="permits" className="space-y-6">
                    {/* Permits Overview */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div />
                        <div className="flex flex-col sm:flex-row gap-2">
                            <Button 
                                onClick={handleCreateNewForm}
                                size="sm" 
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Create New Form
                            </Button>
                            <Button 
                                onClick={handleViewWorkPermits}
                                variant="outline" 
                                size="sm"
                            >
                                <FileText className="h-4 w-4 mr-2" />
                                View All Forms
                            </Button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3 lg:gap-4">
                        {cards.map((stat) => (
                            <Card
                                key={stat.key}
                                className="relative overflow-hidden hover:shadow-md transition-shadow"
                            >
                                <CardContent className="p-3 lg:p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xl lg:text-2xl font-bold text-card-foreground">
                                                {isFetching ? '-' : stat.value}
                                            </p>
                                            <p className="text-xs lg:text-sm text-muted-foreground truncate">
                                                {stat.label}
                                            </p>
                                        </div>
                                        <div
                                            className={`p-1.5 lg:p-2 rounded-full ${stat.color} flex-shrink-0 ml-2`}
                                        >
                                            <stat.icon className="h-3 w-3 lg:h-4 lg:w-4 text-white" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Removed KPI and Location sections as requested */}

                    {/* Permits by Type */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base lg:text-lg font-semibold">
                                Permits by Type
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="text-xs lg:text-sm">Permit Type</TableHead>
                                            <TableHead className="text-xs lg:text-sm">Total Count</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {typesAggregated.map((permit, index) => (
                                            <TableRow key={index}>
                                                <TableCell className="font-medium text-xs lg:text-sm">
                                                    {permit.type}
                                                </TableCell>
                                                <TableCell className="text-xs lg:text-sm">
                                                    {permit.totalCount}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                {/* Observations Dashboard */}
                <TabsContent value="observations" className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h2 className="text-xl lg:text-2xl font-bold text-foreground">Observations</h2>
                            <p className="text-sm lg:text-base text-muted-foreground">Overview and KPIs</p>
                        </div>
                    </div>
                    <Card>
                        <CardContent className="p-4 lg:p-6 text-muted-foreground text-center">
                            <div className="py-8">
                                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                                <p className="text-lg font-medium">Observation dashboard content goes here.</p>
                                <p className="text-sm mt-2">This section will contain observation data and analytics.</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Audits Dashboard */}
                <TabsContent value="audits" className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h2 className="text-xl lg:text-2xl font-bold text-foreground">Audits</h2>
                            <p className="text-sm lg:text-base text-muted-foreground">Overview and KPIs</p>
                        </div>
                    </div>
                    <Card>
                        <CardContent className="p-4 lg:p-6 text-muted-foreground text-center">
                            <div className="py-8">
                                <Files className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                                <p className="text-lg font-medium">Audit dashboard content goes here.</p>
                                <p className="text-sm mt-2">This section will contain audit data and analytics.</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Fleet Management Dashboard */}
                <TabsContent value="fleet" className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h2 className="text-xl lg:text-2xl font-bold text-foreground">Fleet Management</h2>
                            <p className="text-sm lg:text-base text-muted-foreground">Overview and KPIs</p>
                        </div>
                    </div>
                    <Card>
                        <CardContent className="p-4 lg:p-6 text-muted-foreground text-center">
                            <div className="py-8">
                                <PencilRuler className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                                <p className="text-lg font-medium">Fleet management dashboard content goes here.</p>
                                <p className="text-sm mt-2">This section will contain fleet data and analytics.</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
