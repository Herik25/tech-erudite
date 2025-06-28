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

// Updated Zod schema - fixed validation
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
    }, "Price must be greater than 0"),
  icon: z.string().min(1, "Icon is required"),
  description: z.string().optional(),
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
import { useProductStore } from "../useProductStore";
import { toast } from "sonner";
import { getIconComponent, getAvailableIconNames } from "../Products/columns";
import { Textarea } from "../ui/textarea";

// Simple Icon Selector Component
const SimpleIconSelector = ({
  selectedIcon,
  onIconSelect,
}: {
  selectedIcon: string;
  onIconSelect: (iconName: string) => void;
}) => {
  const iconNames = getAvailableIconNames();

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap justify-center gap-2 p-3 border rounded-lg max-h-32 overflow-y-auto">
        {iconNames.map((iconName) => (
          <button
            key={iconName}
            type="button"
            onClick={() => onIconSelect(iconName)}
            className={`p-2 flex items-center justify-center cursor-pointer w-12 h-12 border rounded hover:bg-gray-100 hover:text-black transition-colors ${
              selectedIcon === iconName
                ? "bg-primary text-white border-primary"
                : "border-gray-200"
            }`}
            title={iconName.charAt(0).toUpperCase() + iconName.slice(1)}
          >
            {getIconComponent(iconName)}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span>Selected:</span>
        <div className="flex items-center gap-1">
          {getIconComponent(selectedIcon)}
          <span className="capitalize">{selectedIcon}</span>
        </div>
      </div>
    </div>
  );
};

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
      icon: "package",
    },
  });

  // Watch for icon changes
  const selectedIconName = watch("icon");

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
        icon: selectedProduct.icon || "package",
        description: selectedProduct.description || "",
      });
    }
  }, [selectedProduct, reset]);

  const handleIconChange = (iconName: string): void => {
    setValue("icon", iconName);
  };

  const onSubmit = async (data: FormData): Promise<void> => {
    try {
      console.log("Form data received:", data); // Debug log

      // Validate and convert data
      const quantity = parseInt(data.quantity, 10);
      const price = parseFloat(data.price);

      console.log("Converted values:", { quantity, price }); // Debug log

      if (isNaN(quantity) || quantity <= 0) {
        toast.error("Invalid quantity value");
        return;
      }

      if (isNaN(price) || price <= 0) {
        toast.error("Invalid price value");
        return;
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

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
          icon: data.icon,
          description: data.description,
          updatedAt: new Date(),
        };

        console.log("Updated product:", updatedProduct); // Debug log
        const result = await updateProduct(updatedProduct);
        if (result.success) {
          toast.success("Product updated successfully!");
          handleClose();
        } else {
          toast.error("Failed to update product. Please try again.");
        }
      } else {
        // Create new product
        const newProduct = {
          _id: Date.now().toString(),
          name: data.productName,
          sku: data.sku,
          supplier: data.supplier,
          category: data.category,
          quantityInStock: quantity,
          price: price,
          icon: data.icon,
          description: data.description,
          createdAt: new Date(),
        };

        console.log("New Product Created:", newProduct); // Debug log
        const result = await addProduct(newProduct);

        if (result.success) {
          toast.success("Product added successfully!");
          handleClose();
        } else {
          toast.error("Failed to add product. Please try again.");
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

        <DialogContent className="sm:max-w-[700px] p-0 max-h-[90vh] overflow-y-auto">
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

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="p-6 space-y-6">
              {/* Product Name */}
              <div className="space-y-2">
                <Label htmlFor="productName">Product Name *</Label>
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
                {errors.productName && (
                  <p className="text-sm text-red-500">
                    {errors.productName.message}
                  </p>
                )}
              </div>

              {/* Icon Selection */}
              <div className="space-y-2">
                <Label>Product Icon *</Label>
                <Controller
                  name="icon"
                  control={control}
                  render={({ field }) => (
                    <SimpleIconSelector
                      selectedIcon={field.value}
                      onIconSelect={field.onChange}
                    />
                  )}
                />
                {errors.icon && (
                  <p className="text-sm text-red-500">{errors.icon.message}</p>
                )}
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
                      className={`h-11 ${errors.sku ? "border-red-500" : ""}`}
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
                        className={`h-11 ${
                          errors.supplier ? "border-red-500" : ""
                        }`}
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
                  <Label htmlFor="category">Category *</Label>
                  <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="h-11">
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
                  {errors.category && (
                    <p className="text-sm text-red-500">
                      {errors.category.message}
                    </p>
                  )}
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
                        min="1"
                        placeholder="Enter quantity"
                        className={`h-11 ${
                          errors.quantity ? "border-red-500" : ""
                        }`}
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
                        min="0.01"
                        step="0.01"
                        placeholder="Enter price"
                        className={`h-11 ${
                          errors.price ? "border-red-500" : ""
                        }`}
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

              <div className="space-y-2">
                <Label htmlFor="description">Product Description</Label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      id="description"
                      {...field}
                      //   className="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter product description"
                    />
                  )}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>

            <Separator />

            <div className="p-6 flex items-center justify-between">
              {/* Left side warning text */}
              <p className="text-xs text-yellow-600 italic">
                *Product name and SKU must be unique
              </p>

              {/* Right side buttons */}
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSubmitting || isLoading}
                  className=""
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
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
