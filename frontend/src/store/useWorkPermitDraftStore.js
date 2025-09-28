import { workPermitDraftService } from "@/services/workPermitDraft.service";
import { create } from "zustand";

export const useWorkPermitDraftStore = create((set, get) => ({
    // State
    drafts: [],
    currentDraft: null,
    isCreating: false,
    isFetching: false,
    isUpdating: false,
    isDeleting: false,
    isAutoSaving: false,
    draftError: null,

    // Actions
    clearError: () => set({ draftError: null }),

    // Create or Update Draft (Auto-save)
    createOrUpdateDraft: async (draftData, companyId, isAutoSave = false) => {
        if (isAutoSave) {
            set({ isAutoSaving: true, draftError: null });
        } else {
            set({ isCreating: true, draftError: null });
        }

        try {
            const draft = await workPermitDraftService.createOrUpdateDraft(draftData, companyId, isAutoSave);
            
            set((state) => {
                const existingIndex = state.drafts.findIndex(d => d.id === draft.id);
                let updatedDrafts;
                
                if (existingIndex >= 0) {
                    // Update existing draft
                    updatedDrafts = [...state.drafts];
                    updatedDrafts[existingIndex] = draft;
                } else {
                    // Add new draft
                    updatedDrafts = [draft, ...state.drafts];
                }

                return {
                    drafts: updatedDrafts,
                    currentDraft: draft
                };
            });

            return draft;
        } catch (error) {
            set({ draftError: error });
            throw error;
        } finally {
            if (isAutoSave) {
                set({ isAutoSaving: false });
            } else {
                set({ isCreating: false });
            }
        }
    },

    // Get All Drafts
    getAllDrafts: async () => {
        set({ isFetching: true, draftError: null });
        try {
            const drafts = await workPermitDraftService.getAllDrafts();
            set({ drafts });
            return drafts;
        } catch (error) {
            set({ draftError: error });
            throw error;
        } finally {
            set({ isFetching: false });
        }
    },

    // Get Draft by ID
    getDraftById: async (draftId) => {
        set({ isFetching: true, draftError: null });
        try {
            const draft = await workPermitDraftService.getDraftById(draftId);
            set({ currentDraft: draft });
            return draft;
        } catch (error) {
            set({ draftError: error });
            throw error;
        } finally {
            set({ isFetching: false });
        }
    },

    // Delete Draft
    deleteDraft: async (draftId) => {
        set({ isDeleting: true, draftError: null });
        try {
            await workPermitDraftService.deleteDraft(draftId);
            set((state) => ({
                drafts: state.drafts.filter(d => d.id !== draftId),
                currentDraft: state.currentDraft?.id === draftId ? null : state.currentDraft
            }));
        } catch (error) {
            set({ draftError: error });
            throw error;
        } finally {
            set({ isDeleting: false });
        }
    },

    // Set Current Draft
    setCurrentDraft: (draft) => set({ currentDraft: draft }),

    // Clear Current Draft
    clearCurrentDraft: () => set({ currentDraft: null }),

    // Clear All Drafts
    clearDrafts: () => set({ drafts: [], currentDraft: null }),
}));
