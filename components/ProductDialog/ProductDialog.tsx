"use client";
import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

export type ProductCategory =
  | "Electronics"
  | "Clothing"
  | "Books"
  | "Sports"
  | "Furniture"
  | "Toys"
  | "Beauty"
  | "Home Decor"
  | "Home Appliances"
  | "Others";

// Zod schema for form validation
const productSchema = z.object({
  productName: z.string().min(1, "Product name is required").trim(),
  sku: z
    .string()
    .min(1, "SKU is required")
    .regex(/^[a-zA-Z0-9-_]+$/, "SKU must be alphanumeric")
    .trim(),
  supplier: z.string().min(1, "Supplier is required").trim(),
  category: z.enum([
    "Electronics",
    "Clothing",
    "Books",
    "Sports",
    "Furniture",
    "Toys",
    "Beauty",
    "Home Decor",
    "Home Appliances",
    "Others",
  ]),
  quantity: z
    .string()
    .min(1, "Quantity is required")
    .refine((val) => {
      const num = parseInt(val, 10);
      return !isNaN(num) && num > 0;
    }, "Quantity must be greater than 0"),
  price: z
    .string()
    .min(1, "Price is required")
    .refine((val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    }, "Price must be a greater than 0 "),
  selectedIcon: z.any().nullable().optional(),
});

type FormData = z.infer<typeof productSchema>;

import { Package, ShoppingCart } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import IconSelector from "./IconSelector";
import { useProductStore } from "../useProductStore";
import { toast } from "sonner";

export default function ProductDialog() {
  const {
    allProducts,
    addProduct,
    isLoading,
    openProductDialog,
    setOpenProductDialog,
    setSelectedProduct,
    selectedProduct,
    updateProduct,
  } = useProductStore();

  const categories: ProductCategory[] = [
    "Electronics",
    "Clothing",
    "Books",
    "Sports",
    "Furniture",
    "Toys",
    "Beauty",
    "Home Decor",
    "Home Appliances",
    "Others",
  ];

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      productName: "",
      sku: "",
      supplier: "",
      category: "Electronics",
      quantity: "",
      price: "",
      selectedIcon: null,
    },
  });

  //   Watch for selectedIcon changes
  //   const selectedIcon = watch("selectedIcon");

  useEffect(() => {
    if (selectedProduct) {
      // Populate form with selected product data for editing
      reset({
        productName: selectedProduct.name || "",
        sku: selectedProduct.sku || "",
        supplier: selectedProduct.supplier || "",
        category: selectedProduct.category || "Electronics",
        quantity: selectedProduct.quantityInStock?.toString() || "",
        price: selectedProduct.price?.toString() || "",
        selectedIcon: selectedProduct.icon || null,
      });
      
    }
  }, [selectedProduct, reset]);

  const handleIconChange = (icon: React.ReactNode): void => {
    setValue("selectedIcon", icon);
  };

  const onSubmit = async (data: FormData): Promise<void> => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Convert string values to numbers
      const quantity = parseInt(data.quantity, 10);
      const price = parseFloat(data.price);

      if (selectedProduct) {
        // Update existing product
        const updatedProduct = {
          ...selectedProduct,
          name: data.productName,
          sku: data.sku,
          supplier: data.supplier,
          category: data.category,
          quantityInStock: quantity,
          price: price,
          icon: data.selectedIcon,
          updatedAt: new Date(),
        };

        const result = await updateProduct(updatedProduct);
        if (result) {
          toast.success("Product updated successfully!");
          handleClose();
        }
      } else {
        // Create new product
        const newProduct = {
          id: Date.now().toString(),
          name: data.productName,
          sku: data.sku,
          supplier: data.supplier,
          category: data.category,
          quantityInStock: quantity,
          price: price,
          icon: data.selectedIcon,
          createdAt: new Date(),
        };

        console.log("New Product Created:", newProduct);
        const result = await addProduct(newProduct);

        if (result) {
          toast.success("Product added successfully!");
          handleClose();
        }
      }
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Failed to save product. Please try again.");
    }
  };

  const handleClose = (): void => {
    reset();
    setSelectedProduct(null);
    setOpenProductDialog(false);
  };

  const isEditMode = !!selectedProduct;

  return (
    <div className="p-8">
      <Dialog open={openProductDialog} onOpenChange={setOpenProductDialog}>
        <DialogTrigger asChild>
          <Button className="h-10 gap-2">
            <Package size={16} />
            Add Product
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[600px] p-0">
          <DialogHeader className="p-6 pb-4">
            <DialogTitle className="text-2xl">
              {isEditMode ? "Edit Product" : "Add Product"}
            </DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Update the product information"
                : "Fill in the form to add a new product to your inventory"}
            </DialogDescription>
          </DialogHeader>

          <Separator />

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="p-6 space-y-6">
              {/* Product Name & Icon Row */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                <div className="md:col-span-12 space-y-2">
                  <Label htmlFor="productName">Product Name *</Label>
                  <div className="grid grid-cols-[1fr_auto] gap-4">
                    <Controller
                      name="productName"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="productName"
                          placeholder="Enter product name"
                          className={`h-11 ${
                            errors.productName ? "border-red-500" : ""
                          }`}
                        />
                      )}
                    />
                    <IconSelector onUpdateIcon={handleIconChange} />
                  </div>
                  {errors.productName && (
                    <p className="text-sm text-red-500">
                      {errors.productName.message}
                    </p>
                  )}
                </div>
              </div>

              {/* SKU */}
              <div className="space-y-2">
                <Label htmlFor="sku">SKU *</Label>
                <Controller
                  name="sku"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="sku"
                      placeholder="Enter SKU"
                      className={errors.sku ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.sku && (
                  <p className="text-sm text-red-500">{errors.sku.message}</p>
                )}
              </div>

              {/* Supplier & Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="supplier">Supplier *</Label>
                  <Controller
                    name="supplier"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="supplier"
                        placeholder="Enter supplier name"
                        className={errors.supplier ? "border-red-500" : ""}
                      />
                    )}
                  />
                  {errors.supplier && (
                    <p className="text-sm text-red-500">
                      {errors.supplier.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              {/* Quantity & Price */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Controller
                    name="quantity"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="quantity"
                        type="number"
                        min="0"
                        placeholder="Enter quantity"
                        className={errors.quantity ? "border-red-500" : ""}
                      />
                    )}
                  />
                  {errors.quantity && (
                    <p className="text-sm text-red-500">
                      {errors.quantity.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price ($) *</Label>
                  <Controller
                    name="price"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="price"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Enter price"
                        className={errors.price ? "border-red-500" : ""}
                      />
                    )}
                  />
                  {errors.price && (
                    <p className="text-sm text-red-500">
                      {errors.price.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            <DialogFooter className="p-6 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting || isLoading}
                className="mr-2"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="gap-2"
              >
                {isSubmitting || isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {isEditMode ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  <>
                    <ShoppingCart size={16} />
                    {isEditMode ? "Update Product" : "Add Product"}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
