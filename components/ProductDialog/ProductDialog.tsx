"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import ProductName from "../ProductName";
import SKU from "../SKU";
import Supplier from "../Supplier";
import { ProductCategory } from "../ProductCategory";
import Quantity from "../Quantity";
import Price from "../Price";
import { ReactNode, useState } from "react";
import { icons } from "./Icons";

export default function ProductDialog() {
  const [selectedIcon, setSelectedIcon] = useState<null | ReactNode>(
    icons.find((icon) => icon.isSelected === true)?.icon
  );
  function onSelectedIcon(icon: ReactNode) {
    console.log(icon);

    // Ensuring that the state update happens outside of render flow
    setTimeout(() => {
      setSelectedIcon(icon);
    }, 0);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="h-10">Add Product</Button>
      </DialogTrigger>
      <DialogContent className="p-7 px-8 font-poppins">
        <DialogHeader>
          <DialogTitle className=" text-2xl">Add Product</DialogTitle>
          <DialogDescription>
            Fill in the form to add new product
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <div className="flex flex-col gap-2 mt-1">
          <div className="grid grid-cols-2 gap-7">
            <ProductName onSelectedIcon={onSelectedIcon} />
            <SKU />
          </div>

          <div className="grid grid-cols-2 gap-5 items-start mt-4">
            <Supplier />
            <ProductCategory
            //   selectedCategory={selectedCategory}
            //   setSelectedCategory={setSelectedCategory}
            />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-7 max-lg:grid-cols-2 max-lg:gap-1 max-sm:grid-cols-1">
            {/* <Description /> */}
            <Quantity />
            <Price />
          </div>
        </div>
        <DialogFooter className="mt-9 mb-4 flex items-center gap-4 ">
          <DialogClose
            // ref={dialogCloseRef}
            // onClick={() => {
            //   handleReset();
            // }}
            asChild
          >
            <Button variant={"secondary"} className="h-11 px-11 ">
              Cancel
            </Button>
          </DialogClose>

          <Button className="h-11 px-11">
            {/* {isLoading
              ? "loading..."
              : `${selectedProduct ? "Edit Product" : "Add Product"}`} */}
            Add Product
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
