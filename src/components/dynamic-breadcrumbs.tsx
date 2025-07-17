"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";

export function DynamicBreadcrumbs({
  ...props
}: React.ComponentProps<typeof Breadcrumb>) {
  const pathName = usePathname();
  const pathNameList = pathName.split("/");
  // ignores empty string before first /
  const breadCrumbPathList = pathNameList.slice(1);
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadCrumbPathList.map((name) => (
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink href="#">{name}</BreadcrumbLink>
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
