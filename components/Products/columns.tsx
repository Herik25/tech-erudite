"use client";

import React, { ReactNode } from "react";
import { Column, ColumnDef } from "@tanstack/react-table";
import ProductDropDown from "./ProductDropDown";
import { IoArrowDown, IoArrowUp } from "react-icons/io5";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";

// Updated Product type - icon is now a string
export type Product = {
  _id: string;
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
  quantityInStock: number;
  price: number;
  icon: string; // Changed from 'iconName: string' to 'icon: string'
  createdAt: Date;
};

// Icon mapping - add your icons here
import {
  Package,
  Laptop,
  Smartphone,
  Shirt,
  Book,
  Palette,
  Dumbbell,
  Home,
  Tv,
  ShoppingCart,
  // Add more icons as needed
} from "lucide-react";

const iconMap: Record<string, ReactNode> = {
  // Electronics
  laptop: <Laptop className="h-4 w-4" />,
  smartphone: <Smartphone className="h-4 w-4" />,
  tv: <Tv className="h-4 w-4" />,

  // Clothing
  shirt: <Shirt className="h-4 w-4" />,

  // Books
  book: <Book className="h-4 w-4" />,

  // Beauty
  palette: <Palette className="h-4 w-4" />,

  // Sports
  dumbbell: <Dumbbell className="h-4 w-4" />,

  // Home/Furniture
  home: <Home className="h-4 w-4" />,

  // Default/Others
  package: <Package className="h-4 w-4" />,
  cart: <ShoppingCart className="h-4 w-4" />,
};

// Helper function to get icon component from name - NOW EXPORTED
export const getIconComponent = (iconName: string): ReactNode => {
  return iconMap[iconName] || iconMap.package; // fallback to package icon
};

// Helper function to get available icon names - NOW EXPORTED
export const getAvailableIconNames = (): string[] => {
  return Object.keys(iconMap);
};

type SortableHeaderProps = {
  column: Column<any, unknown>;
  label: String;
};

const SortableHeader: React.FC<SortableHeaderProps> = ({ column, label }) => {
  const isSorted = column.getIsSorted();
  const SortingIcon =
    isSorted === "asc"
      ? ArrowDown
      : isSorted === "desc"
      ? ArrowUp
      : ArrowUpDown;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="" asChild>
        <Button variant={"ghost"} aria-label={`Sort by ${label}`}>
          {label}
          <SortingIcon className=" h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="bottom">
        <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
          <ArrowUp className="mr-2 h-4 w-4" />
          Asc
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
          <ArrowDown className="mr-2 h-4 w-4" />
          Desc
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    cell: ({ row }) => {
      // Get icon component from icon name
      const iconComponent = getIconComponent(row.original.icon);
      const name = row.original.name;
      return (
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-sm bg-primary/10 text-primary">
            {iconComponent}
          </div>
          <span>{name}</span>
        </div>
      );
    },
    header: ({ column }) => <SortableHeader column={column} label="Name" />,
  },
  {
    accessorKey: "sku",
    header: ({ column }) => <SortableHeader column={column} label="Sku" />,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <SortableHeader column={column} label="Created At" />
    ),
    cell: ({ getValue }) => {
      const dateValue = getValue<Date | string>();
      const date = dateValue instanceof Date ? dateValue : new Date(dateValue);

      // Check if date is valid
      if (isNaN(date.getTime())) {
        return <span>Invalid Date</span>;
      }

      return (
        <span>
          {date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      );
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => <SortableHeader column={column} label="Price" />,
    cell: ({ getValue }) => {
      const price = getValue<number>();
      return price !== undefined && price !== null
        ? `$${price.toFixed(2)}`
        : "$0.00";
    },
  },
  {
    accessorKey: "category",
    filterFn: "multiSelect",
    header: ({ column }) => <SortableHeader column={column} label="Category" />,
  },
  {
    accessorKey: "quantityInStock",
    header: ({ column }) => <SortableHeader column={column} label="Quantity" />,
  },
  {
    accessorKey: "supplier",
    header: ({ column }) => <SortableHeader column={column} label="Supplier" />,
  },
  {
    accessorKey: "actions",
    cell: ({ row }) => {
      return <ProductDropDown row={row} />;
    },
  },
];
