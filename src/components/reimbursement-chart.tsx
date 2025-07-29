import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Bar, BarChart, XAxis } from "recharts";

const chartConfig = {
  reimbursement: {
    label: "Reimbursement",
    color: "#2563eb",
  },
} satisfies ChartConfig;

const chartData = [
  { day: "January", reimbursement: 186 },
  { day: "February", reimbursement: 305 },
  { day: "March", reimbursement: 237 },
  { day: "April", reimbursement: 73 },
  { day: "May", reimbursement: 209 },
  { day: "June", reimbursement: 214 },
];

export function ReimbursementChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart data={chartData}>
        <XAxis
          dataKey="day"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <Bar
          dataKey="reimbursement"
          fill="var(--color-reimbursement)"
          radius={4}
        />
      </BarChart>
    </ChartContainer>
  );
}
