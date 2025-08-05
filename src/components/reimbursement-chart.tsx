"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { fetchJSONAPI } from "@/lib/lib";
import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

const chartConfig = {
  reimbursement: {
    label: "Reimbursements",
    color: "#2563eb",
  },
} satisfies ChartConfig;

async function generateChartData() {
  const chartData = [];
  const now = new Date();
  const firstDay = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1));
  const initDay = new Date(now.getFullYear(), now.getMonth(), 0);
  const daysCount = initDay.getDate();
  const timestamp = firstDay.toISOString();
  const dateParams = new URLSearchParams({
    createdAfter: timestamp,
  }).toString();
  const res = await fetchJSONAPI("GET", `/api/v1/reimbursements?${dateParams}`);
  const json = await res.json();
  for (let i = 0; i < daysCount; i++) {
    chartData.push({
      day: String(i + 1),
      reimbursement: 0,
    });
  }
  for (let i = 0; i < json.data.length; i++) {
    const reimbursement = json.data[i];
    const date = new Date(reimbursement.daCreatedAt);
    console.log(date.getDate());
    chartData[date.getDate() - 1].reimbursement++;
  }
  console.log(chartData);
  return chartData;
}

export function ReimbursementChart() {
  const chartDataQuery = useQuery({
    queryKey: ["reimbursement-chart-data"],
    queryFn: generateChartData,
  });

  if (chartDataQuery.isError) {
    console.error(chartDataQuery.error);
    return <>Error : {chartDataQuery.error.message}</>;
  }

  if (chartDataQuery.isLoading) {
    return <>Loading</>;
  }

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart data={chartDataQuery.data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="day"
          tickLine={false}
          tickMargin={5}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar
          dataKey="reimbursement"
          fill="var(--color-reimbursement)"
          radius={2}
        />
      </BarChart>
    </ChartContainer>
  );
}
