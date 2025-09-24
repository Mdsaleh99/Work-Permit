import { createLazyFileRoute } from "@tanstack/react-router";
import React from "react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useCompanyStore } from "@/store/useCompanyStore";
import AddMemberModal from "@/components/company/AddMemberModal";
import { Select } from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useWorkPermitStore } from "@/store/useWorkPermitStore";

export const Route = createLazyFileRoute("/page/app/company-members")({
    component: RouteComponent,
});

function RouteComponent() {
    const {
        companyMembers,
        getAllCompanyMembers,
        getCompanyByUser,
        updateCompanyMemberRole,
        deleteCompanyMember,
    } = useCompanyStore();
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState("");
    const [company, setCompany] = React.useState(null);
    const [members, setMembers] = React.useState([]);
    const [openModal, setOpenModal] = React.useState(false);
    const [submitting, setSubmitting] = React.useState(false);
    const [confirmDeleteFor, setConfirmDeleteFor] = React.useState(null);

    console.log(companyMembers);

    const load = async () => {
        setLoading(true);
        setSubmitting(true);
        setError("");
        try {
            const companyData = await getCompanyByUser();
            setCompany(companyData || null);
            const companyId = companyData?.id;
            const list = await getAllCompanyMembers(companyId);
            setMembers(Array.isArray(list) ? list : []);
        } catch (e) {
            setError(e?.message || "Failed to load company members");
        } finally {
            setLoading(false);
            setSubmitting(false);
        }
    };

    React.useEffect(() => {
        load();
    }, []);

    // Keep local members in sync with store updates (e.g., after create)
    React.useEffect(() => {
        if (Array.isArray(companyMembers)) {
            setMembers(companyMembers);
        }
    }, [companyMembers]);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white border-b p-4 sticky top-0 z-40">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-semibold text-gray-900">
                            Company Members
                        </h1>
                        {company?.compName && (
                            <p className="text-sm text-gray-500 border-1 p-1 flex items-center justify-center rounded-2xl border-blue-500 mt-2 font-bold">
                                {company.compName}
                            </p>
                        )}
                    </div>
                    <Button
                        onClick={() => setOpenModal(true)}
                        size="sm"
                        className="cursor-pointer"
                    >
                        Add Member
                    </Button>
                </div>
            </div>

            <div className="max-w-6xl mx-auto p-4">
                {error && (
                    <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                        {error}
                    </div>
                )}
                {loading ? (
                    <div className="text-sm text-gray-600">
                        Loading members…
                    </div>
                ) : (
                    <div className="bg-white border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[80px]">
                                        #
                                    </TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Joined</TableHead>
                                    <TableHead className="w-[320px]">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {members.length === 0 && (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="text-center text-sm text-gray-500 py-8"
                                        >
                                            No members yet
                                        </TableCell>
                                    </TableRow>
                                )}
                                {members.map((m, idx) => (
                                    <TableRow key={m.id || m.userId || idx}>
                                        <TableCell>{idx + 1}</TableCell>
                                        <TableCell>
                                            {m.user?.fullName || m.name || "-"}
                                        </TableCell>
                                        <TableCell>
                                            {m.user?.email || m.email || "-"}
                                        </TableCell>
                                        <TableCell>
                                            {m.role || "UNKOWN ROLE"}
                                        </TableCell>
                                        <TableCell>
                                            {m.createdAt
                                                ? new Date(
                                                      m.createdAt,
                                                  ).toLocaleDateString()
                                                : "-"}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        asChild
                                                    >
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="cursor-pointer"
                                                        >
                                                            Update Role
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="start">
                                                        <DropdownMenuLabel>
                                                            Select role
                                                        </DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        {[
                                                            "COMPANY_MEMBER",
                                                            "MANAGER",
                                                        ].map((r) => (
                                                            <DropdownMenuItem
                                                                key={r}
                                                                onClick={async () => {
                                                                    try {
                                                                        const companyId =
                                                                            company?.id;
                                                                        const memberId =
                                                                            m.id;
                                                                        if (
                                                                            !companyId ||
                                                                            !memberId
                                                                        )
                                                                            return;
                                                                        await updateCompanyMemberRole(
                                                                            companyId,
                                                                            memberId,
                                                                            r,
                                                                        );
                                                                    } catch (e) {
                                                                        console.error(
                                                                            e,
                                                                        );
                                                                    }
                                                                }}
                                                            >
                                                                {r}
                                                            </DropdownMenuItem>
                                                        ))}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                                <AllowPermitButton companyId={company?.id} member={m} />
                                                <Popover
                                                    open={
                                                        confirmDeleteFor ===
                                                        (m.id || m.userId)
                                                    }
                                                    onOpenChange={(open) =>
                                                        setConfirmDeleteFor(
                                                            open ? m.id : null,
                                                        )
                                                    }
                                                >
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            className="cursor-pointer"
                                                            onClick={() =>
                                                                setConfirmDeleteFor(
                                                                    m.id
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent
                                                        align="end"
                                                        className="w-64"
                                                    >
                                                        <div className="text-sm font-medium mb-2">
                                                            Delete member?
                                                        </div>
                                                        <p className="text-xs text-gray-600 mb-3">
                                                            This action cannot
                                                            be undone.
                                                        </p>
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="cursor-pointer"
                                                                onClick={() =>
                                                                    setConfirmDeleteFor(
                                                                        null,
                                                                    )
                                                                }
                                                            >
                                                                Cancel
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="destructive"
                                                                className="cursor-pointer"
                                                                onClick={async () => {
                                                                    try {
                                                                        const companyId =
                                                                            company?.id;
                                                                        const memberId =
                                                                            m.id ||
                                                                            m.userId;
                                                                        if (
                                                                            !companyId ||
                                                                            !memberId
                                                                        )
                                                                            return;
                                                                        await deleteCompanyMember(
                                                                            companyId,
                                                                            memberId,
                                                                        );
                                                                    } catch (e) {
                                                                        console.error(
                                                                            e,
                                                                        );
                                                                    } finally {
                                                                        setConfirmDeleteFor(
                                                                            null,
                                                                        );
                                                                    }
                                                                }}
                                                            >
                                                                Confirm
                                                            </Button>
                                                        </div>
                                                    </PopoverContent>
                                                </Popover>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>

            <AddMemberModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                loading={submitting}
            />
        </div>
    );
}

function AllowPermitButton({ companyId, member }) {
    const { getCompanyByUser } = useCompanyStore();
    const { getAllWorkPermits } = useWorkPermitStore();
    const { updateCompanyMemberAllowedPermits } = useCompanyStore();
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [list, setList] = React.useState([]);
    const [selected, setSelected] = React.useState(
        Array.isArray(member?.allowedWorkPermits)
            ? member.allowedWorkPermits.map((p) => p.id)
            : []
    );

    React.useEffect(() => {
        if (!open) return;
        (async () => {
            try {
                const companyData = await getCompanyByUser();
                const store = getAllWorkPermits();
                const all = await store;
                const filtered = Array.isArray(all)
                    ? all.filter((p) => !companyData?.id || p.companyId === companyData.id)
                    : [];
                setList(filtered);
            } catch {}
        })();
    }, [open]);

    const toggle = (id) => {
        setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    };

    const submit = async () => {
        if (!companyId || !member?.id) return;
        setLoading(true);
        try {
            await updateCompanyMemberAllowedPermits(companyId, member.id, selected);
            setOpen(false);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button size="sm" variant="outline" className="cursor-pointer" onClick={() => setOpen(true)}>
                Allow Permit
            </Button>
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/20" onClick={() => !loading && setOpen(false)} />
                    <div className="relative z-10 w-full max-w-lg rounded-md border bg-white p-4 shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                            <div className="text-base font-semibold">Allow Permits</div>
                            <button className="text-gray-500" onClick={() => !loading && setOpen(false)}>✕</button>
                        </div>
                        <div className="max-h-72 overflow-auto space-y-2">
                            {list.length === 0 ? (
                                <div className="text-sm text-gray-500">No permits</div>
                            ) : (
                                list.map((p) => (
                                    <label key={p.id} className="flex items-center gap-2 text-sm">
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4"
                                            checked={selected.includes(p.id)}
                                            onChange={() => toggle(p.id)}
                                        />
                                        <span>{p.title}{p.workPermitNo ? ` — ${p.workPermitNo}` : ""}</span>
                                    </label>
                                ))
                            )}
                        </div>
                        <div className="mt-3 flex items-center justify-end gap-2">
                            <Button size="sm" variant="outline" className="cursor-pointer" onClick={() => setOpen(false)} disabled={loading}>Cancel</Button>
                            <Button size="sm" className="cursor-pointer" onClick={submit} disabled={loading}>{loading ? "Saving…" : "Save"}</Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
