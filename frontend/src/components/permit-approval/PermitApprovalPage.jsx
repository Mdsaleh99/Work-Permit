import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { workPermitService } from '@/services/workPermit.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, CheckCircle, XCircle, Eye, Calendar, Edit, RefreshCw } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { format } from 'date-fns';
import { toast } from 'sonner';

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

    // State for close dialog
    const [showCloseDialog, setShowCloseDialog] = useState(false);
    const [selectedFormForClose, setSelectedFormForClose] = useState(null);
    const [workClearanceDescription, setWorkClearanceDescription] = useState('');

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
            console.log('Approving form:', workPermitFormId);
            const result = await workPermitService.approveWorkPermit(workPermitFormId);
            console.log('Approval result:', result);
            toast.success('Work permit approved successfully!');
            await fetchPendingForms(); // Refresh the list
            console.log('Form approved successfully, refreshing list...');
        } catch (err) {
            console.error('Error approving form:', err);
            setError('Failed to approve form');
        } finally {
            setActionLoading(prev => ({ ...prev, [workPermitFormId]: null }));
        }
    };

    const handleClose = (submission) => {
        setSelectedFormForClose(submission);
        setWorkClearanceDescription('');
        setShowCloseDialog(true);
    };

    const handleConfirmClose = async () => {
        if (!selectedFormForClose) return;
        
        try {
            setActionLoading(prev => ({ ...prev, [selectedFormForClose.workPermitForm.id]: 'close' }));
            
            // Prepare Opening PTW data
            const openingPTWData = {
                'permit-issuing-authority-name': authUser?.name || '',
                'permit-issuing-authority-date': new Date().toISOString().split('T')[0],
                'permit-receiving-authority-name': selectedFormForClose.submittedBy.name,
                'permit-receiving-authority-date': new Date().toISOString().split('T')[0]
            };
            
            // Use the workPermitService to close the form
            await workPermitService.closeWorkPermit(selectedFormForClose.workPermitForm.id, {
                openingPTWData,
                workClearanceDescription
            });
            
            toast.success('Work permit closed successfully!');
            setShowCloseDialog(false);
            setSelectedFormForClose(null);
            await fetchPendingForms(); // Refresh the list
        } catch (err) {
            console.error('Error closing form:', err);
            setError('Failed to close form');
        } finally {
            setActionLoading(prev => ({ ...prev, [selectedFormForClose.workPermitForm.id]: null }));
        }
    };

    const handleViewForm = (workPermitFormId) => {
        navigate({ to: `/page/app/form-builder/view/${workPermitFormId}` });
    };

    const handleEditForm = (workPermitFormId) => {
        navigate({ to: `/page/app/form-builder/${workPermitFormId}` });
    };

    const handleViewSubmission = (submission) => {
        // Open a modal or navigate to a submission view
        // For now, let's navigate to the form builder with submission data
        navigate({ to: `/page/app/form-builder/${submission.workPermitForm.id}` });
    };

    const handleResetForms = async () => {
        try {
            console.log('Resetting forms to PENDING status...');
            const response = await fetch('/api/v1/work-permit/reset-to-pending', {
                method: 'POST',
                credentials: 'include'
            });
            const result = await response.json();
            console.log('Reset result:', result);
            toast.success(`Reset ${result.data.count} forms to PENDING status`);
            await fetchPendingForms(); // Refresh the list
        } catch (err) {
            console.error('Error resetting forms:', err);
            toast.error('Failed to reset forms');
        }
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
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Permit Approval</h1>
                        <p className="text-muted-foreground mt-2">
                            Review and approve work permit forms assigned to you as the issuing authority
                        </p>
                    </div>
                    <Button 
                        onClick={fetchPendingForms}
                        variant="outline"
                        className="text-sm"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Refreshing...
                            </>
                        ) : (
                            <>
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Refresh
                            </>
                        )}
                    </Button>
                </div>
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
                                    <TableHead>Permit No</TableHead>
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
                                            {submission.workPermitForm.workPermitNo || '-'}
                                        </TableCell>
                                        <TableCell>
                                            {submission.workPermitForm.company.compName}
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
                                                    onClick={() => handleEditForm(submission.workPermitForm.id)}
                                                    disabled={submission.workPermitForm.status === 'CLOSED'}
                                                >
                                                    <Edit className="h-4 w-4 mr-1" />
                                                    Edit Form
                                                </Button>
                                                {submission.workPermitForm.status === 'PENDING' && (
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
                                                )}
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleClose(submission)}
                                                    disabled={submission.workPermitForm.status === 'CLOSED' || actionLoading[submission.workPermitForm.id] === 'close'}
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

            {/* Close Dialog */}
            <Dialog open={showCloseDialog} onOpenChange={setShowCloseDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Close Work Permit</DialogTitle>
                        <DialogDescription>
                            Complete the work clearance details to close this work permit.
                        </DialogDescription>
                    </DialogHeader>
                    
                    {selectedFormForClose && (
                        <div className="space-y-6">
                            {/* Opening PTW Section */}
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="issuing-authority">Permit Issuing Authority Name</Label>
                                        <Input
                                            id="issuing-authority"
                                            value={authUser?.name || ''}
                                            disabled
                                            className="bg-gray-50"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="issuing-date">Date</Label>
                                        <Input
                                            id="issuing-date"
                                            type="date"
                                            value={new Date().toISOString().split('T')[0]}
                                            disabled
                                            className="bg-gray-50"
                                        />
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="receiving-authority">Permit Receiving Authority Name</Label>
                                        <Input
                                            id="receiving-authority"
                                            value={selectedFormForClose.submittedBy.name}
                                            disabled
                                            className="bg-gray-50"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="receiving-date">Date</Label>
                                        <Input
                                            id="receiving-date"
                                            type="date"
                                            value={new Date().toISOString().split('T')[0]}
                                            disabled
                                            className="bg-gray-50"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Work Clearance Description */}
                            <div className="space-y-2">
                                <Label htmlFor="work-clearance">Work Clearance Description</Label>
                                <Textarea
                                    id="work-clearance"
                                    placeholder="Describe the work completion and area clearance..."
                                    value={workClearanceDescription}
                                    onChange={(e) => setWorkClearanceDescription(e.target.value)}
                                    rows={4}
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end space-x-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowCloseDialog(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleConfirmClose}
                                    disabled={!workClearanceDescription.trim() || actionLoading[selectedFormForClose.workPermitForm.id] === 'close'}
                                >
                                    {actionLoading[selectedFormForClose.workPermitForm.id] === 'close' ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Closing...
                                        </>
                                    ) : (
                                        <>
                                            <XCircle className="h-4 w-4 mr-2" />
                                            Close Work Permit
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
