import ProductDialog from "./ProductDialog/ProductDialog";
import { columns } from "./Products/columns";
import { products } from "./Products/productData";
import ProductTable from "./Products/ProductTable";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export default function TableHead() {
  return (
    <div>
      <Card className="flex flex-col shadow-none font-poppins border-none">
        <CardHeader className="flex justify-between p-2">
          <div className="flex justify-between items-center w-full">
            <div>
              <CardTitle className="font-bold text-2xl">Products</CardTitle>
              <p className="text-sm text-slate-600 dark:text-gray-300">
                34 Products
              </p>
            </div>
            <ProductDialog />
          </div>
        </CardHeader>
        <CardContent>
          <ProductTable columns={columns} data={products} />
        </CardContent>
      </Card>
    </div>
  );
}
