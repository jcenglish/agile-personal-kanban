/**
 * uiStore — Zustand store for ephemeral client UI state.
 *
 * This state lives here (not in React Query) because it has no server
 * representation. React Query owns all server data. Zustand owns what
 * only the browser knows: which modal is open, which story is selected,
 * whether the sidebar is collapsed, and what is being dragged right now.
 *
 * Shape to implement:
 *
 *   isModalOpen: boolean          — true when StoryModal is visible
 *   selectedStoryId: string|null  — ID of the story shown in the modal
 *   isSidebarOpen: boolean        — sidebar collapsed/expanded state
 *   dragState: { activeId: string | null }  — story being dragged mid-flight
 *
 * Actions to implement:
 *   openModal(storyId: string): void   — set isModalOpen=true, selectedStoryId=storyId
 *   closeModal(): void                 — set isModalOpen=false, selectedStoryId=null
 *   toggleSidebar(): void              — flip isSidebarOpen
 *   setDragActive(id: string): void    — set dragState.activeId
 *   clearDrag(): void                  — set dragState.activeId=null
 *
 * Example implementation using Zustand:
 *   import { create } from 'zustand'
 *   export const useUIStore = create<UIStore>((set) => ({ ... }))
 */

// USER IMPLEMENTS: replace this export with a real Zustand store.
export interface UIStore {
  isModalOpen: boolean;
  selectedStoryId: string | null;
  isSidebarOpen: boolean;
  dragState: { activeId: string | null };
  openModal: (storyId: string) => void;
  closeModal: () => void;
  toggleSidebar: () => void;
  setDragActive: (id: string) => void;
  clearDrag: () => void;
}

export function useUIStore(): UIStore {
  throw new Error("USER IMPLEMENTS");
}
