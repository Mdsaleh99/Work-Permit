import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { workPermitService } from '@/services/workPermit.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, XCircle, Eye, Calendar } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { format } from 'date-fns';

export function PermitApprovalPage() {
    const { authUser } = useAuthStore();
    const navigate = useNavigate();
    const [pendingForms, setPendingForms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState({});

    useEffect(() => {
        if (authUser?.role === 'SUPER_ADMIN') {
            fetchPendingForms();
        }
    }, [authUser]);

    const fetchPendingForms = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('Fetching pending forms for super admin:', authUser?.name);
            console.log('Auth user details:', authUser);
            const forms = await workPermitService.getFormsPendingApproval();
            console.log('Received forms:', forms);
            setPendingForms(forms);
        } catch (err) {
            console.error('Error fetching pending forms:', err);
            console.error('Error details:', {
                message: err.message,
                status: err.response?.status,
                statusText: err.response?.statusText,
                data: err.response?.data
            });
            setError(`Failed to fetch pending forms: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (workPermitFormId) => {
        try {
            setActionLoading(prev => ({ ...prev, [workPermitFormId]: 'approve' }));
            await workPermitService.approveWorkPermit(workPermitFormId);
            await fetchPendingForms(); // Refresh the list
        } catch (err) {
            console.error('Error approving form:', err);
            setError('Failed to approve form');
        } finally {
            setActionLoading(prev => ({ ...prev, [workPermitFormId]: null }));
        }
    };

    const handleClose = async (workPermitFormId) => {
        try {
            setActionLoading(prev => ({ ...prev, [workPermitFormId]: 'close' }));
            await workPermitService.closeWorkPermit(workPermitFormId);
            await fetchPendingForms(); // Refresh the list
        } catch (err) {
            console.error('Error closing form:', err);
            setError('Failed to close form');
        } finally {
            setActionLoading(prev => ({ ...prev, [workPermitFormId]: null }));
        }
    };

    const handleViewForm = (workPermitFormId) => {
        navigate({ to: `/page/app/form-builder/${workPermitFormId}` });
    };

    const handleViewSubmission = (submission) => {
        // Open a modal or navigate to a submission view
        // For now, let's navigate to the form builder with submission data
        navigate({ to: `/page/app/form-builder/${submission.workPermitForm.id}` });
    };

    if (authUser?.role !== 'SUPER_ADMIN') {
        return (
            <div className="container mx-auto p-6">
                <Alert>
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>
                        Access denied. Only Super Admins can view this page.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <span className="ml-2">Loading pending forms...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Permit Approval</h1>
                <p className="text-muted-foreground mt-2">
                    Review and approve work permit forms assigned to you as the issuing authority
                </p>
            </div>

            {error && (
                <Alert className="mb-6" variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {pendingForms.length === 0 ? (
                <Card>
                    <CardContent className="p-6 text-center">
                        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Pending Approvals</h3>
                        <p className="text-muted-foreground">
                            There are no work permit forms pending your approval at this time.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>Pending Forms ({pendingForms.length})</CardTitle>
                        <CardDescription>
                            Forms where you were selected as the Permit Issuing Authority
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Form Name</TableHead>
                                    <TableHead>Company</TableHead>
                                    <TableHead>Submitted By</TableHead>
                                    <TableHead>Submitted Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pendingForms.map((submission) => (
                                    <TableRow key={submission.id}>
                                        <TableCell className="font-medium">
                                            {submission.workPermitForm.title}
                                        </TableCell>
                                        <TableCell>
                                            {submission.workPermitForm.company.name}
                                        </TableCell>
                                        <TableCell>
                                            {submission.submittedBy.name}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center">
                                                <Calendar className="h-4 w-4 mr-2" />
                                                {format(new Date(submission.createdAt), 'MMM dd, yyyy')}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">
                                                {submission.workPermitForm.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleViewForm(submission.workPermitForm.id)}
                                                >
                                                    <Eye className="h-4 w-4 mr-1" />
                                                    View Form
                                                </Button>
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() => handleViewSubmission(submission)}
                                                >
                                                    <Eye className="h-4 w-4 mr-1" />
                                                    View Submission
                                                </Button>
                                                <Button
                                                    variant="default"
                                                    size="sm"
                                                    onClick={() => handleApprove(submission.workPermitForm.id)}
                                                    disabled={actionLoading[submission.workPermitForm.id] === 'approve'}
                                                >
                                                    {actionLoading[submission.workPermitForm.id] === 'approve' ? (
                                                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                                    ) : (
                                                        <CheckCircle className="h-4 w-4 mr-1" />
                                                    )}
                                                    Approve
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleClose(submission.workPermitForm.id)}
                                                    disabled={actionLoading[submission.workPermitForm.id] === 'close'}
                                                >
                                                    {actionLoading[submission.workPermitForm.id] === 'close' ? (
                                                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                                    ) : (
                                                        <XCircle className="h-4 w-4 mr-1" />
                                                    )}
                                                    Close
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
