import Header from "./header/Header";
import { Card } from "@/components/ui/card";
import TableHead from "@/components/TableHead";
import { useTheme } from "next-themes";
import { DeleteDialog } from "@/components/DeleteDialog";

export default function Home() {
  return (
    <div className="font-poppins p-4 border- w-full min-h-screen">
      <Card className="flex flex-col shadow-none p-2">
        <Header />
        <TableHead />
        <DeleteDialog />
      </Card>
    </div>
  );
}
