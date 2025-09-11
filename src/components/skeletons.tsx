// src/components/skeletons.tsx
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

export function DashboardCardSkeleton() {
  return (
    <div className="space-y-2 mt-2 ">
      <Skeleton className="h-5 w-45 xl:w-38" />
      <Skeleton className="h-4 w-30" />
    </div>
  );
}

export function BarChartSkeleton() {
  const heights = [88, 112, 100, 136, 104, 152, 120, 96, 130, 118, 92, 144, 88, 112, 100, 136, 104, 88, 112, 100, 136, 104, 152, 120, 96, 130, 118, 92, 144];
  return (
    <div className="flex flex-col items-center justify-center ">
      <div className="w-full px-4 py-2 flex items-end justify-center gap-2 mb-2">
        {heights.map((h, i) => (
          <Skeleton key={i} className="w-4 rounded-sm" style={{ height: h }} />
        ))}
      </div>
      <Skeleton className="h-4 w-50" />
    </div>
  );
}

export function TableSkeleton({ colSpan, rows = 5 }: { colSpan: number; rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <TableRow key={i}>
          <TableCell colSpan={colSpan}>
            <div className="flex space-x-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-1/6" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

export function DetailViewSkeleton() {
  const rowsDetail = Array.from({ length: 13 });
  return (
    <>
      <Table className="mb-6 max-w-[85%] mx-auto">
        <TableHeader>
          <TableRow>
            <TableHead>Information</TableHead>
            <TableHead>Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rowsDetail.map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="h-4 w-28" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-40" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
