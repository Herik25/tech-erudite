import { connectDB } from "@/lib/db";
import Product from "@/app/models/Products";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectDB();
  const { name, supplier, sku, category, quantityInStock, price, icon } =
    await req.json();

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  try {
    const newProduct = await Product.create({
      name,
      supplier,
      sku,
      category,
      quantityInStock,
      price,
      icon,
    });
    console.log("from body : ", newProduct);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Product name must be unique" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const categories = searchParams.get("categories")?.split(",") || [];

  const query: any = {
    name: { $regex: search, $options: "i" },
  };

  if (categories.length > 0) {
    query.categories = { $in: categories };
  }

  const products = await Product.find(query).sort({ createdAt: -1 });
  return NextResponse.json(products);
}
