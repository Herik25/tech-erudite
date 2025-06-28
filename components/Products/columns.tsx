"use client";

import { ReactNode } from "react";
import { ColumnDef } from "@tanstack/react-table";
import ProductDropDown from "./ProductDropDown";

export type Product = {
  id: string;
  name: string;
  supplier: string;
  sku: string;
  category:
    | "Electronics"
    | "Furniture"
    | "Clothing"
    | "Books"
    | "Toys"
    | "Beauty"
    | "Sports"
    | "Home Decor"
    | "Home Appliances"
    | "Others";
  //   status: "Published" | "Inactive" | "Draft";
  quantityInStock: number;
  price: number;
  icon: ReactNode;
  createdAt: Date;
};

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const Icon = row.original.icon;
      const name = row.original.name;
      return (
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-sm bg-primary/10 text-primary">
            {Icon}
          </div>

          <span>{name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "sku",
    header: "Sku",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ getValue }) => `$${getValue<number>().toFixed(2)}`,
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "quantityInStock",
    header: "Quantity",
  },
  {
    accessorKey: "supplier",
    header: "Supplier",
  },
  {
    accessorKey: "actions",
    cell: ({ row }) => {
      return <ProductDropDown row={row} />;
    },
  },
];
