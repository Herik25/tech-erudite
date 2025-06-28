"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MdError } from "react-icons/md";
import { useForm } from "react-hook-form";

export default function Supplier() {
  const {
    register,
    formState: { errors },
  } = useForm();
  return (
    <div className=" flex flex-col gap-2">
      <Label htmlFor="supplier-name" className="text-slate-600">
        {`Supplier's name`}
      </Label>
      <Input
        {...register("supplier")}
        type="text"
        id="supplier-name"
        className="h-11 shadow-none"
        placeholder="TechWorld..."
      />
      {errors.supplier && (
        <div className="text-red-500 flex gap-1 items-center text-[13px]">
          <MdError />
          <p>
            <>{errors.supplier.message}</>
          </p>
        </div>
      )}
    </div>
  );
}
