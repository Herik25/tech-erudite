import Image from "next/image";
import Header from "./header/Header";
import { Card } from "@/components/ui/card";

export default function Home() {
  return (
    <div className=" font-poppins p-4">
      <Card className="flex flex-col shadow-none p-2">
        <Header />
      </Card>
      Home Page
    </div>
  );
}
