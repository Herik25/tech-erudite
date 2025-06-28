"use client";

import { Row } from "@tanstack/react-table";
import { Product } from "./columns";

import { FaRegEdit } from "react-icons/fa";
import { MdContentCopy, MdOutlineDelete } from "react-icons/md";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { nanoid } from "nanoid";
import { useProductStore } from "../useProductStore";
import { JSX } from "react";

type MenuItem = {
  icon?: JSX.Element;
  label?: string;
  className?: string;
  separator?: boolean;
};

export default function ProductDropDown({ row }: { row: Row<Product> }) {
  const { setSelectedProduct, setOpenDialog } = useProductStore();
  const menuItems: MenuItem[] = [
    { icon: <MdContentCopy />, label: "Copy", className: "" },
    { icon: <FaRegEdit />, label: "Edit", className: "" },
    { separator: true },
    {
      icon: <MdOutlineDelete className="text-lg" />,
      label: "Delete",
      className: "text-red-600",
    },
  ];

  function handleClickedItem(item: MenuItem) {
    if (item.label === "Delete") {
      setOpenDialog(true);
      setSelectedProduct(row.original);
    }
  }

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="poppins">
          {menuItems.map((item, index) =>
            item.separator ? (
              <DropdownMenuSeparator key={index} />
            ) : (
              <DropdownMenuItem
                key={index}
                className={`flex items-center gap-1 p-[10px] ${item.className}`}
                onClick={() => handleClickedItem(item)}
              >
                {item.icon}
                <span>{item.label}</span>
              </DropdownMenuItem>
            )
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
