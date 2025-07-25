"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { assemblePathName } from "@/lib/lib";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

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
          const pathUrl = assemblePathName(breadCrumbPathList, index);
          if (index + 1 === breadCrumbPathList.length) {
            return (
              <BreadcrumbItem key={index} className="hidden md:block">
                <BreadcrumbPage>{capitalizeFirstLetter(name)}</BreadcrumbPage>
              </BreadcrumbItem>
            );
          } else {
            return (
              <React.Fragment key={index}>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink asChild>
                    <Link href={pathUrl}> {capitalizeFirstLetter(name)}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </React.Fragment>
            );
          }
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
