import { ChartLineDefault } from "@/components/chart-line-default";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Page() {
  return (
    // {/* Suspense Elements */}
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Reimbursements</CardTitle>
          </CardHeader>
          <CardContent>+3 more notes since last 24 hours</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            IDR 240.350 worth of items pending approval overall
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Orders</CardTitle>
          </CardHeader>
          <CardContent>
            IDR 150.000 worth of subscription fees are due this week
          </CardContent>
        </Card>
      </div>
      <ChartLineDefault />
    </div>
  );
}
