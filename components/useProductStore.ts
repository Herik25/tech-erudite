import { create } from "zustand";
import { Product } from "./Products/columns";

interface ProductState {
  allProducts: Product[];
  isLoading: boolean;
  openDialog: boolean;
  setOpenDialog: (openDialog: boolean) => void;
  openProductDialog: boolean;
  setOpenProductDialog: (openProductDialog: boolean) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  setAllProducts: (allProducts: Product[]) => void;
  loadProducts: () => Promise<void>;
  addProduct: (product: Product) => Promise<{ success: boolean }>;
  updateProduct: (updatedProduct: Product) => Promise<{ success: boolean }>;
  deleteProduct: (productId: string) => Promise<{ success: boolean }>;
}

export const useProductStore = create<ProductState>((set) => ({
  allProducts: [],
  isLoading: false,
  selectedProduct: null,
  openDialog: false,
  setOpenDialog: (openDialog) => set({ openDialog }),
  openProductDialog: false,
  setOpenProductDialog: (openProductDialog) => set({ openProductDialog }),
  setSelectedProduct: (product) => set({ selectedProduct: product }),
  setAllProducts: (allProducts) => set({ allProducts }),

  loadProducts: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      set({ allProducts: data });
    } catch (err) {
      console.error("Failed to load products", err);
    } finally {
      set({ isLoading: false });
    }
  },

  addProduct: async (product: Product) => {
    console.log("new product : ", product);

    set({ isLoading: true });
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });

      if (!res.ok) {
        const error = await res.json();
        console.error("Error:", error.error);
        return { success: false };
      }

      const newProduct = await res.json();
      set((state) => ({
        allProducts: [...state.allProducts, newProduct],
      }));

      return { success: true };
    } catch (error) {
      console.error("Error adding product:", error);
      return { success: false };
    } finally {
      set({ isLoading: false });
    }
  },

  updateProduct: async (updatedProduct: Product) => {
    set({ isLoading: true });
    console.log("update product :", updatedProduct);

    try {
      const res = await fetch(`/api/products/${updatedProduct._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProduct),
      });

      if (!res.ok) {
        console.error("Update failed");
        return { success: false };
      }

      const data = await res.json();

      set((state) => ({
        allProducts: state.allProducts.map((product) =>
          product._id === updatedProduct._id ? data : product
        ),
      }));

      return { success: true };
    } catch (error) {
      console.error("Error updating product:", error);
      return { success: false };
    } finally {
      set({
        isLoading: false,
        openProductDialog: false,
        selectedProduct: null,
      });
    }
  },

  deleteProduct: async (productId: string) => {
    set({ isLoading: true });
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        console.error("Failed to delete");
        return { success: false };
      }

      set((state) => ({
        allProducts: state.allProducts.filter((p) => p._id !== productId),
      }));

      return { success: true };
    } catch (error) {
      console.error("Delete error:", error);
      return { success: false };
    } finally {
      set({
        isLoading: false,
        openDialog: false,
        selectedProduct: null,
      });
    }
  },
}));
