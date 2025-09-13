import { workPermitService } from "@/services/workPermit.service";
import { create } from "zustand";

export const useWorkPermitStore = create((set, get) => ({
    // State
    workPermits: [],
    currentWorkPermit: null,
    isCreating: false,
    isFetching: false,
    isUpdating: false,
    isDeleting: false,
    workPermitError: null,

    // Actions
    clearError: () => set({ workPermitError: null }),

    createWorkPermit: async (permitData, companyId) => {
        set({ isCreating: true, workPermitError: null });
        try {
            const workPermit = await workPermitService.createWorkPermit(permitData, companyId);
            set((state) => ({ 
                workPermits: [workPermit, ...state.workPermits],
                currentWorkPermit: workPermit
            }));
            return workPermit;
        } catch (error) {
            set({ workPermitError: error });
            throw error;
        } finally {
            set({ isCreating: false });
        }
    },

    getAllWorkPermits: async () => {
        set({ isFetching: true, workPermitError: null });
        try {
            const workPermits = await workPermitService.getAllWorkPermits();
            set({ workPermits });
            return workPermits;
        } catch (error) {
            set({ workPermitError: error });
            throw error;
        } finally {
            set({ isFetching: false });
        }
    },

    getWorkPermitById: async (workPermitId) => {
        set({ isFetching: true, workPermitError: null });
        try {
            const workPermit = await workPermitService.getWorkPermitById(workPermitId);
            set({ currentWorkPermit: workPermit });
            return workPermit;
        } catch (error) {
            set({ workPermitError: error });
            throw error;
        } finally {
            set({ isFetching: false });
        }
    },

    updateWorkPermit: async (permitData, companyId, workPermitId) => {
        set({ isUpdating: true, workPermitError: null });
        try {
            const updatedWorkPermit = await workPermitService.updateWorkPermit(permitData, companyId, workPermitId);
            set((state) => ({
                workPermits: state.workPermits.map(wp => 
                    wp.id === workPermitId ? updatedWorkPermit : wp
                ),
                currentWorkPermit: updatedWorkPermit
            }));
            return updatedWorkPermit;
        } catch (error) {
            set({ workPermitError: error });
            throw error;
        } finally {
            set({ isUpdating: false });
        }
    },

    deleteWorkPermit: async (workPermitId) => {
        set({ isDeleting: true, workPermitError: null });
        try {
            await workPermitService.deleteWorkPermit(workPermitId);
            set((state) => ({
                workPermits: state.workPermits.filter(wp => wp.id !== workPermitId),
                currentWorkPermit: state.currentWorkPermit?.id === workPermitId ? null : state.currentWorkPermit
            }));
        } catch (error) {
            set({ workPermitError: error });
            throw error;
        } finally {
            set({ isDeleting: false });
        }
    },

    setCurrentWorkPermit: (workPermit) => set({ currentWorkPermit: workPermit }),
    clearCurrentWorkPermit: () => set({ currentWorkPermit: null }),
}));