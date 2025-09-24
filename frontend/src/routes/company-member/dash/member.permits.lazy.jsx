import { createLazyFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ensureCompanyMember } from "../../../lib/ensureCompanyMember.js";
import { useCompanyStore } from "@/store/useCompanyStore";
import { Button } from "@/components/ui/button";
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
    const { currentCompanyMember } = useCompanyStore();
    const navigate = useNavigate();

    const permits = Array.isArray(currentCompanyMember?.allowedWorkPermits)
        ? currentCompanyMember.allowedWorkPermits
        : [];

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
                            <TableHead className="w-[160px]">Actions</TableHead>
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
                                                onClick={() =>
                                                    navigate({
                                                        to: "/company-member/dash/member/form-fill/$workPermitId",
                                                        params: { workPermitId: p.id },
                                                    })
                                                }
                                            >
                                                Fill
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

