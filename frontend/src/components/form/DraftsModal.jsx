import React from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { X, Edit, Trash2, Copy, Calendar, Clock } from "lucide-react";
import { cn } from "../../lib/utils";

/**
 * Modal component for managing drafts
 */
const DraftsModal = ({
    showDraftsModal,
    setShowDraftsModal,
    drafts,
    onLoadDraft,
    onDeleteDraft,
    onDuplicateDraft,
    isLoading,
}) => {
    if (!showDraftsModal) return null;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString();
    };

    return (
        <div className="fixed inset-0 bg-transparent z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">My Drafts</h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Manage your saved work permit form drafts
                        </p>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowDraftsModal(false)}
                        className="p-2"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <span className="ml-2 text-gray-600">Loading drafts...</span>
                        </div>
                    ) : drafts && drafts.length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {drafts.map((draft) => (
                                <Card key={draft.id} className="hover:shadow-md transition-shadow">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <CardTitle className="text-lg font-semibold text-gray-900 truncate">
                                                {draft.title}
                                            </CardTitle>
                                            <div className="flex items-center space-x-1 ml-2">
                                                {draft.isAutoSave && (
                                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                                        Auto-save
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <div className="space-y-3">
                                            {/* Draft info */}
                                            <div className="text-sm text-gray-600">
                                                <div className="flex items-center space-x-2">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>Created: {formatDate(draft.createdAt)}</span>
                                                </div>
                                                <div className="flex items-center space-x-2 mt-1">
                                                    <Clock className="w-4 h-4" />
                                                    <span>Updated: {formatTime(draft.updatedAt)}</span>
                                                </div>
                                                <div className="mt-2">
                                                    <span className="text-xs text-gray-500">
                                                        {draft.sections?.length || 0} sections
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Action buttons */}
                                            <div className="flex items-center space-x-2 pt-2">
                                                <Button
                                                    size="sm"
                                                    onClick={() => {
                                                        onLoadDraft(draft.id);
                                                        setShowDraftsModal(false);
                                                    }}
                                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                                                >
                                                    <Edit className="w-4 h-4 mr-1" />
                                                    Open
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => onDuplicateDraft(draft.id)}
                                                    className="px-3"
                                                >
                                                    <Copy className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => onDeleteDraft(draft.id)}
                                                    className="px-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-gray-400 mb-4">
                                <Edit className="w-16 h-16 mx-auto" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No drafts yet</h3>
                            <p className="text-gray-600 mb-4">
                                Start creating a form to see your drafts here
                            </p>
                            <Button
                                onClick={() => setShowDraftsModal(false)}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                Start Creating
                            </Button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end p-6 border-t border-gray-200 bg-gray-50">
                    <Button
                        variant="outline"
                        onClick={() => setShowDraftsModal(false)}
                    >
                        Close
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default DraftsModal;
