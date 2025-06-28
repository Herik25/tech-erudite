"use client";
import React, { useState } from "react";

interface FormData {
  productName: string;
  sku: string;
  supplier: string;
  category: string;
  quantity: string;
  price: string;
  selectedIcon: React.ReactNode | null;
}

interface FormErrors {
  productName?: string;
  sku?: string;
  supplier?: string;
  category?: string;
  quantity?: string;
  price?: string;
}
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

export default function ProductDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    productName: "",
    sku: "",
    supplier: "",
    category: "Electronics",
    quantity: "",
    price: "",
    selectedIcon: null,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const categories = [
    "Electronics",
    "Clothing",
    "Books",
    "Home & Garden",
    "Sports",
    "Food",
  ];

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.productName.trim()) {
      newErrors.productName = "Product name is required";
    }

    if (!formData.sku.trim()) {
      newErrors.sku = "SKU is required";
    } else if (!/^[a-zA-Z0-9-_]+$/.test(formData.sku)) {
      newErrors.sku = "SKU must be alphanumeric";
    }

    if (!formData.supplier.trim()) {
      newErrors.supplier = "Supplier is required";
    }

    const quantity = parseInt(formData.quantity);
    if (isNaN(quantity) || quantity < 0) {
      newErrors.quantity = "Quantity must be a non-negative number";
    }

    const price = parseFloat(formData.price);
    if (isNaN(price) || price < 0) {
      newErrors.price = "Price must be a non-negative number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleIconChange = (selectedIcon: React.ReactNode): void => {
    setFormData((prev) => ({
      ...prev,
      selectedIcon,
    }));
  };

  const handleInputChange = (field: keyof FormData, value: string): void => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field when user starts typing
    if (field in errors) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newProduct = {
        id: Date.now().toString(),
        productName: formData.productName,
        sku: formData.sku,
        supplier: formData.supplier,
        category: formData.category,
        quantity: parseInt(formData.quantity),
        price: parseFloat(formData.price),
        selectedIcon: formData.selectedIcon,
        createdAt: new Date().toISOString(),
      };

      console.log("New Product Created:", newProduct);

      // Reset form and close dialog
      handleReset();
      setIsOpen(false);
    } catch (error) {
      console.error("Error adding product:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = (): void => {
    setFormData({
      productName: "",
      sku: "",
      supplier: "",
      category: "Electronics",
      quantity: "",
      price: "",
      selectedIcon: null,
    });
    setErrors({});
  };

  const handleClose = (): void => {
    handleReset();
    setIsOpen(false);
  };

  return (
    <div className="p-8">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="h-10 gap-2">
            <Package size={16} />
            Add Product
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[600px] p-0">
          <DialogHeader className="p-6 pb-4">
            <DialogTitle className="text-2xl">Add Product</DialogTitle>
            <DialogDescription>
              Fill in the form to add a new product to your inventory
            </DialogDescription>
          </DialogHeader>

          <Separator />

          <div className="p-6 space-y-6">
            {/* Product Name & Icon Row */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              <div className="md:col-span-12 space-y-2">
                <Label htmlFor="productName">Product Name *</Label>
                <div className="grid grid-cols-[1fr_auto] gap-4">
                  <Input
                    id="productName"
                    value={formData.productName}
                    onChange={(e) =>
                      handleInputChange("productName", e.target.value)
                    }
                    placeholder="Enter product name"
                    className={`h-11 ${
                      errors.productName ? "border-red-500" : ""
                    }`}
                  />
                  <IconSelector onUpdateIcon={handleIconChange} />
                </div>
                {errors.productName && (
                  <p className="text-sm text-red-500">{errors.productName}</p>
                )}
              </div>
            </div>

            {/* SKU */}
            <div className="space-y-2">
              <Label htmlFor="sku">SKU *</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => handleInputChange("sku", e.target.value)}
                placeholder="Enter SKU"
                className={errors.sku ? "border-red-500" : ""}
              />
              {errors.sku && (
                <p className="text-sm text-red-500">{errors.sku}</p>
              )}
            </div>

            {/* Supplier & Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="supplier">Supplier *</Label>
                <Input
                  id="supplier"
                  value={formData.supplier}
                  onChange={(e) =>
                    handleInputChange("supplier", e.target.value)
                  }
                  placeholder="Enter supplier name"
                  className={errors.supplier ? "border-red-500" : ""}
                />
                {errors.supplier && (
                  <p className="text-sm text-red-500">{errors.supplier}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    handleInputChange("category", value)
                  }
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
              </div>
            </div>

            {/* Quantity & Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="0"
                  value={formData.quantity}
                  onChange={(e) =>
                    handleInputChange("quantity", e.target.value)
                  }
                  placeholder="Enter quantity"
                  className={errors.quantity ? "border-red-500" : ""}
                />
                {errors.quantity && (
                  <p className="text-sm text-red-500">{errors.quantity}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  placeholder="Enter price"
                  className={errors.price ? "border-red-500" : ""}
                />
                {errors.price && (
                  <p className="text-sm text-red-500">{errors.price}</p>
                )}
              </div>
            </div>
          </div>

          <Separator />

          <DialogFooter className="p-6 pt-4">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Adding...
                </>
              ) : (
                <>
                  <ShoppingCart size={16} />
                  Add Product
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
