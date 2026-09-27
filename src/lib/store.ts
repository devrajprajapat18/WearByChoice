import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/types";

interface OutfitState {
  items: Product[];
  addItem: (p: Product) => void;
  removeItem: (id: string) => void;
  clear: () => void;
}

export const useOutfit = create<OutfitState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (p) => set((s) => (s.items.some((i) => i.id === p.id) ? s : { items: [...s.items, p].slice(0, 8) })),
      removeItem: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      clear: () => set({ items: [] })
    }),
    { name: "wbc-outfit" }
  )
);

interface WishlistState {
  ids: string[];
  toggle: (id: string) => void;
}
export const useWishlist = create<WishlistState>()(
  persist((set) => ({ ids: [], toggle: (id) => set((s) => ({ ids: s.ids.includes(id) ? s.ids.filter((x) => x !== id) : [...s.ids, id] })) }), { name: "wbc-wishlist" })
);

interface SessionState {
  userImage: string | null;
  setUserImage: (v: string | null) => void;
}
export const useSession = create<SessionState>()((set) => ({ userImage: null, setUserImage: (userImage) => set({ userImage }) }));
