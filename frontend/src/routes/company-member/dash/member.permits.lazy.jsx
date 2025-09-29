import { createLazyFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ensureCompanyMember } from "../../../lib/ensureCompanyMember.js";
import { useCompanyStore } from "@/store/useCompanyStore";
import { Button } from "@/components/ui/button";
import { workPermitService } from "@/services/workPermit.service";
import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export const Route = createLazyFileRoute(
    "/company-member/dash/member/permits",
)({
    beforeLoad: ensureCompanyMember,
    component: RouteComponent,
});

function RouteComponent() {
    const { currentCompanyMember, getCurrentCompanyMember } = useCompanyStore();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                if (!currentCompanyMember || !Array.isArray(currentCompanyMember.allowedWorkPermits)) {
                    await getCurrentCompanyMember();
                }
            } finally {
                if (mounted) setIsLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, []);

    const permits = Array.isArray(currentCompanyMember?.allowedWorkPermits)
        ? currentCompanyMember.allowedWorkPermits
        : [];

    const [memberSubmissions, setMemberSubmissions] = useState({});

    useEffect(() => {
        (async () => {
            try {
                const map = {};
                const results = await Promise.all(
                    (permits || []).map(async (p) => {
                        try {
                            const resp = await workPermitService.listSubmissions(p.id);
                            const subs = Array.isArray(resp?.data) ? resp.data : [];
                            const mine = subs.find((s) => s?.submittedBy?.id === currentCompanyMember?.id);
                            return { id: p.id, mine };
                        } catch {
                            return { id: p.id, mine: null };
                        }
                    })
                );
                results.forEach(({ id, mine }) => { if (mine) map[id] = mine; });
                setMemberSubmissions(map);
            } catch {}
        })();
    }, [JSON.stringify(permits), currentCompanyMember?.id]);

    if (isLoading) {
        return (
            <div className="max-w-5xl mx-auto p-4">
                <div className="bg-white border rounded-md p-8 text-center text-gray-500 text-sm">
                    Loading...
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-4">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-lg font-semibold">Allowed Work Permits</h1>
            </div>
            <div className="bg-white border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">#</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Permit No</TableHead>
                            <TableHead className="w-[300px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {permits.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center text-sm text-gray-500 py-8">
                                    No permits assigned
                                </TableCell>
                            </TableRow>
                        ) : (
                            permits.map((p, idx) => (
                                <TableRow key={p.id}>
                                    <TableCell>{idx + 1}</TableCell>
                                    <TableCell>{p.title || "-"}</TableCell>
                                    <TableCell>{p.workPermitNo || "-"}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                size="sm"
                                                className="cursor-pointer"
                                                disabled={Boolean(memberSubmissions[p.id])}
                                                onClick={() =>
                                                    navigate({
                                                        to: "/company-member/dash/member/form-fill/$workPermitId",
                                                        params: { workPermitId: p.id },
                                                    })
                                                }
                                            >
                                                Fill
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                className="cursor-pointer"
                                                disabled={!Boolean(memberSubmissions[p.id]) || Boolean(memberSubmissions[p.id]?.answers?.['member-closed'])}
                                                onClick={() =>
                                                    navigate({
                                                        to: "/company-member/dash/member/form-fill/$workPermitId",
                                                        params: { workPermitId: p.id },
                                                        search: { edit: true }
                                                    })
                                                }
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                className="cursor-pointer"
                                                disabled={!Boolean(memberSubmissions[p.id]) || Boolean(memberSubmissions[p.id]?.answers?.['member-closed'])}
                                                onClick={async () => {
                                                    try {
                                                        const existing = memberSubmissions[p.id];
                                                        const merged = { ...(existing?.answers || {}), ['member-closed']: true };
                                                        await workPermitService.updateSubmission(p.id, merged);
                                                        setMemberSubmissions(prev => ({ ...prev, [p.id]: { ...(existing || {}), answers: merged } }));
                                                    } catch (e) {
                                                        console.error(e);
                                                    }
                                                }}
                                            >
                                                Close
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

