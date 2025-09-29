"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Clock, CheckCircle, XCircle, Ban } from "lucide-react";
import { useCompanyStore } from "@/store/useCompanyStore";
import { workPermitService } from "@/services/workPermit.service";

export function MemberPermitsDashboard() {
    const { currentCompanyMember, getCurrentCompanyMember } = useCompanyStore();
    const [formsForCounts, setFormsForCounts] = React.useState([]);
    const [isFetching, setIsFetching] = React.useState(false);

    React.useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setIsFetching(true);
                const member = currentCompanyMember || await getCurrentCompanyMember();
                const companyId = member?.companyId;
                if (companyId) {
                    const all = await workPermitService.getCompanyWorkPermits(companyId);
                    if (mounted) setFormsForCounts(Array.isArray(all) ? all : []);
                } else {
                    const permits = Array.isArray(member?.allowedWorkPermits) ? member.allowedWorkPermits : [];
                    if (mounted) setFormsForCounts(permits);
                }
            } finally {
                if (mounted) setIsFetching(false);
            }
        })();
        return () => { mounted = false; };
    }, [currentCompanyMember?.id]);

    const statusCounts = React.useMemo(() => {
        const stats = { PENDING: 0, APPROVED: 0, CLOSED: 0, CANCELLED: 0 };
        (formsForCounts || []).forEach((wp) => {
            const st = (wp?.status || "PENDING").toUpperCase();
            if (stats[st] !== undefined) stats[st] += 1;
        });
        return stats;
    }, [formsForCounts]);

    const typesAggregated = React.useMemo(() => {
        const map = new Map();
        (formsForCounts || []).forEach((wp) => {
            const title = wp?.title || "Unknown";
            map.set(title, (map.get(title) || 0) + 1);
        });
        return Array.from(map.entries()).map(([type, totalCount]) => ({ type, totalCount }));
    }, [formsForCounts]);

    const cards = [
        { key: "PENDING", label: "Pending", value: statusCounts.PENDING, icon: Clock, color: "bg-blue-500" },
        { key: "APPROVED", label: "Approved", value: statusCounts.APPROVED, icon: CheckCircle, color: "bg-green-500" },
        { key: "CLOSED", label: "Closed", value: statusCounts.CLOSED, icon: XCircle, color: "bg-gray-500" },
        { key: "CANCELLED", label: "Rejected", value: statusCounts.CANCELLED, icon: Ban, color: "bg-red-500" },
    ];

    return (
        <div className="p-4 sm:p-6 space-y-6 bg-background min-h-screen">
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
                {cards.map((c) => (
                    <Card key={c.key} className="relative overflow-hidden hover:shadow-md transition-shadow">
                        <CardContent className="p-3 sm:p-4">
                            <div className="flex items-center justify-between">
                                <div className="min-w-0 flex-1">
                                    <p className="text-xl sm:text-2xl font-bold text-card-foreground">{isFetching ? "-" : c.value}</p>
                                    <p className="text-xs sm:text-sm text-muted-foreground truncate">{c.label}</p>
                                </div>
                                <div className={`p-1.5 sm:p-2 rounded-full ${c.color} flex-shrink-0 ml-2`}>
                                    <c.icon className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Removed Permits by Type table for member dashboard */}
        </div>
    );
}

export default MemberPermitsDashboard;


