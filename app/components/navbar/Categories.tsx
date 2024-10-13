"use client";
import Container from "../Container";

import { usePathname, useSearchParams } from "next/navigation";

import CategoryBox from "../CategoryBox";
import { categories } from "@/app/libs/Categories";

export default function Categories() {
  const pathname = usePathname();
  const params = useSearchParams();
  const category = params?.get("category");

  const isMainPage = pathname == "/";
  if (!isMainPage) {
    return null;
  }
  return (
    <Container>
      <div className="pt-4 flex flex-row items-center justify-between overflow-x-auto">
        {categories.map((item) => (
          <CategoryBox
            key={item.label}
            label={item.label}
            selected={category === item.label}
            icon={item.icon}
          />
        ))}
      </div>
    </Container>
  );
}
