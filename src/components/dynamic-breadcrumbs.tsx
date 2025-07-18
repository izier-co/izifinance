"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { assemblePathName } from "@/lib/lib";
import { usePathname } from "next/navigation";

export function DynamicBreadcrumbs({
  ...props
}: React.ComponentProps<typeof Breadcrumb>) {
  const pathName = usePathname();
  const pathNameList = pathName.split("/");
  // ignores empty string before first /
  const breadCrumbPathList = pathNameList.slice(1);
  function capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadCrumbPathList.map((name, index) => {
          const baseUrl = "localhost:3000/";
          const pathUrl = baseUrl + assemblePathName(breadCrumbPathList, index);
          if (index + 1 === breadCrumbPathList.length) {
            return (
              <BreadcrumbItem key={index} className="hidden md:block">
                <BreadcrumbLink href={pathUrl}>
                  {capitalizeFirstLetter(name)}
                </BreadcrumbLink>
              </BreadcrumbItem>
            );
          } else {
            return (
              <>
                <BreadcrumbItem key={index} className="hidden md:block">
                  <BreadcrumbLink href={pathUrl}>
                    {capitalizeFirstLetter(name)}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator key={index + 1} />
              </>
            );
          }
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
