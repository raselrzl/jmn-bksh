import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardStats } from "../components/dashboard/DashboardStats";
import { RecentSales } from "../components/dashboard/RecentSales";

import { unstable_noStore as noStore } from "next/cache";
import { Chart } from "../components/dashboard/Chart";
import prisma from "@/app/lib/db";
async function getData() {
  const data = await prisma.paymentDetails.findMany({
    select: {
      createdAt: true,
      sendingAmountInEuro: true,
      fees: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 7,
  });

  if (!data) return [];

  const chartData = data.map((item) => ({
    date: new Intl.DateTimeFormat("en-US").format(item.createdAt),
    revenue: item.sendingAmountInEuro + item.fees,
  }));

  return chartData;
}

export default async function Dashboard() {
  noStore();
  const data = await getData();
  return (
    <>
      <DashboardStats />

      <div className="grid gap-4 md:gp-8 lg:grid-cols-2 xl:grid-cols-3 mt-10">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
            <CardDescription>
              Recent transactions from the last 7 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Chart data={data} />
          </CardContent>
        </Card>

        <RecentSales />
      </div>
    </>
  );
}
