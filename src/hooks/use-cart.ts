import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "sonner";

interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  flavor: string;
  variant: string;
  description: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (data: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeAll: () => void;
}

const useCart = create(
  persist<CartStore>(
    (set, get) => ({
      items: [],
      addItem: (data: CartItem) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(
          (item) =>
            item.id === data.id &&
            item.variant === data.variant &&
            item.flavor === data.flavor
        );

        if (existingItem) {
          return toast.error("Item already exists in cart");
        }

        set({ items: [...currentItems, data] });
        toast.success("Item added to cart");
      },
      removeItem: (id: string) => {
        set({ items: get().items.filter((item) => item.id !== id) });
        toast.success("Item removed from cart");
      },
      updateQuantity: (id: string, quantity: number) => {
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        });
        toast.success("Quantity updated");
      },
      removeAll: () => {
        set({ items: [] });
        toast.success("All items removed from cart");
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useCart;
