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
} from "lucide-react";

const permitStats = [
    {
        label: "New",
        value: 2,
        icon: Clock,
        color: "bg-blue-500",
        textColor: "text-blue-600",
    },
    {
        label: "Approved",
        value: 102,
        icon: CheckCircle,
        color: "bg-green-500",
        textColor: "text-green-600",
    },
    {
        label: "Closed",
        value: 27,
        icon: XCircle,
        color: "bg-gray-500",
        textColor: "text-gray-600",
    },
    {
        label: "Overdue",
        value: 8,
        icon: AlertTriangle,
        color: "bg-orange-500",
        textColor: "text-orange-600",
    },
    {
        label: "Revoked",
        value: 15,
        icon: Ban,
        color: "bg-red-500",
        textColor: "text-red-600",
    },
    {
        label: "Rejected",
        value: 2,
        icon: XCircle,
        color: "bg-red-500",
        textColor: "text-red-600",
    },
    {
        label: "Extended",
        value: 32,
        icon: RotateCcw,
        color: "bg-purple-500",
        textColor: "text-purple-600",
    },
];

const kpiData = [
    {
        metric: "Permits Approved on Time",
        target: "100%",
        actual: "96%",
        count: "90/100",
    },
    {
        metric: "Permits Closed on Time",
        target: "100%",
        actual: "68%",
        count: "68/100",
    },
    {
        metric: "Permits Pending Closure >2 Days",
        target: "0",
        actual: "10%",
        count: "10/100",
    },
    {
        metric: "Permits Pending Approval",
        target: "0",
        actual: "3%",
        count: "3/100",
    },
];

const permitsByType = [
    { type: "Hot Work", totalCount: 5, workers: 50, sites: 3 },
    { type: "Confined Space", totalCount: 2, workers: 20, sites: 2 },
    { type: "Working at Height", totalCount: 1, workers: 10, sites: 1 },
    { type: "Excavation", totalCount: 0, workers: 0, sites: 0 },
];

const permitsByLocation = [
    { location: "Plant 1 / CO-CO2 / Coke Oven", count: 50, progress: 85 },
    { location: "Plant 1 / CO-CO2 / CCD", count: 20, progress: 60 },
    { location: "Plant 2 / BF1-6 / Blast Furnace 7", count: 10, progress: 40 },
    { location: "Plant 3 / Water Treatment Plant", count: 10, progress: 40 },
    { location: "Plant 2 / Watch Tower 2", count: 5, progress: 20 },
];

export function PermitsDashboard() {
    return (
        <div className="p-6 space-y-6 bg-background min-h-screen">
            {/* Alert Notifications */}
            <div className="space-y-2">
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
            </div>

            {/* Navigation Tabs */}
            <Tabs defaultValue="permits" className="w-full">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <TabsList className="grid w-full lg:max-w-2xl grid-cols-2 lg:grid-cols-4 h-auto">
                        <TabsTrigger value="permits" className="text-xs lg:text-sm px-2 lg:px-4 py-2">
                            <span className="hidden sm:inline">PERMITS</span>
                            <span className="sm:hidden">PERMITS</span>
                        </TabsTrigger>
                        <TabsTrigger value="observations" className="text-xs lg:text-sm px-2 lg:px-4 py-2">
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
                        </TabsTrigger>
                    </TabsList>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto">
                        <Button variant="outline" size="sm" className="justify-start sm:justify-center">
                            <Settings className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span className="truncate">Site: Overall</span>
                        </Button>
                        <Button variant="outline" size="sm" className="justify-start sm:justify-center">
                            <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span className="truncate">Select FY: 2022-23</span>
                        </Button>
                    </div>
                </div>

                <TabsContent value="permits" className="space-y-6">
                    {/* Permits Overview */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h2 className="text-xl lg:text-2xl font-bold text-foreground">
                                178 Permits
                            </h2>
                            <p className="text-sm lg:text-base text-muted-foreground">
                                19 - 23 Mar 2023
                            </p>
                        </div>
                        <Button variant="outline" size="sm" className="self-start sm:self-auto">
                            <Filter className="h-4 w-4 mr-2" />
                            All Sites
                        </Button>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 lg:gap-4">
                        {permitStats.map((stat) => (
                            <Card
                                key={stat.label}
                                className="relative overflow-hidden hover:shadow-md transition-shadow"
                            >
                                <CardContent className="p-3 lg:p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xl lg:text-2xl font-bold text-card-foreground">
                                                {stat.value}
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

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {/* KPI Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base lg:text-lg font-semibold">
                                    E-PTW Monthly KPI Summary - Sep 2022
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="text-xs lg:text-sm">
                                                    Key Performance Indicator
                                                </TableHead>
                                                <TableHead className="text-xs lg:text-sm">Target</TableHead>
                                                <TableHead className="text-xs lg:text-sm">Actual</TableHead>
                                                <TableHead className="text-xs lg:text-sm">Count</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {kpiData.map((item, index) => (
                                                <TableRow key={index}>
                                                    <TableCell className="font-medium text-xs lg:text-sm">
                                                        {item.metric}
                                                    </TableCell>
                                                    <TableCell className="text-xs lg:text-sm">
                                                        {item.target}
                                                    </TableCell>
                                                    <TableCell className="text-xs lg:text-sm">
                                                        <Badge
                                                            variant={
                                                                item.actual ===
                                                                "100%"
                                                                    ? "default"
                                                                    : "secondary"
                                                            }
                                                        >
                                                            {item.actual}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-xs lg:text-sm">
                                                        {item.count}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Permits by Location */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base lg:text-lg font-semibold">
                                    Permits by Location
                                </CardTitle>
                                <p className="text-xs lg:text-sm text-muted-foreground">
                                    Site / Division / Plant
                                </p>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {permitsByLocation.map((location, index) => (
                                    <div key={index} className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs lg:text-sm font-medium text-card-foreground truncate pr-2">
                                                {location.location}
                                            </span>
                                            <span className="text-xs lg:text-sm font-bold text-card-foreground flex-shrink-0">
                                                {location.count}
                                            </span>
                                        </div>
                                        <Progress
                                            value={location.progress}
                                            className="h-2"
                                        />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

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
                                            <TableHead className="text-xs lg:text-sm">No. of Workers</TableHead>
                                            <TableHead className="text-xs lg:text-sm">No. of Sites</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {permitsByType.map((permit, index) => (
                                            <TableRow key={index}>
                                                <TableCell className="font-medium text-xs lg:text-sm">
                                                    {permit.type}
                                                </TableCell>
                                                <TableCell className="text-xs lg:text-sm">
                                                    {permit.totalCount}
                                                </TableCell>
                                                <TableCell className="text-xs lg:text-sm">
                                                    {permit.workers}
                                                </TableCell>
                                                <TableCell className="text-xs lg:text-sm">
                                                    {permit.sites}
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
