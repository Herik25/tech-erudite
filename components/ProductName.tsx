"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MdError } from "react-icons/md";
import { useForm } from "react-hook-form";
import { ReactNode } from "react";
import IconSelector from "./ProductDialog/IconSelector";
export default function ProductName({
  onSelectedIcon,
}: // onSelectedIcon,
{
  onSelectedIcon: (selectedIcon: ReactNode) => void;
}) {
  const {
    register,
    formState: { errors },
  } = useForm();

  function getSelectedIcon(selectedIcon: ReactNode) {
    onSelectedIcon(selectedIcon);
  }
  return (
    <div className="mt-5 flex flex-col gap-2">
      <Label htmlFor="product-name" className="text-slate-600">
        {`Product's Name`}
      </Label>
      <div className="flex gap-2 items-center">
        <Input
          {...register("productName")}
          type="text"
          id="product-name"
          className="h-11 shadow-none"
          placeholder="Laptop..."
        />
        <IconSelector onUpdateIcon={getSelectedIcon} />
      </div>

      {errors.productName && (
        <div className="text-red-500 flex gap-1 items-center text-[13px]">
          <MdError />
          <p>The product name is required</p>
        </div>
      )}
    </div>
  );
}
