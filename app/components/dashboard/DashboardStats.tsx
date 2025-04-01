import prisma from "@/app/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, EuroIcon, PartyPopper, ShoppingBag, User2 } from "lucide-react";
import { unstable_noStore as noStore } from "next/cache";
async function getData() {
  const [user, paymentDetails] = await Promise.all([
    prisma.user.findMany({
      select: {
        id: true,
      },
    }),

    prisma.paymentDetails.findMany({
      select: {
        sendingAmountInEuro: true,
        receivingAmountInBDT: true,
        fees: true,
      },
    }),
  ]);

  return {
    user,
    paymentDetails,
  };
}

export async function DashboardStats() {
  noStore()
  const { user, paymentDetails } = await getData();
  const totalRevenue = paymentDetails.reduce((accumulator, currentValue) => {
    return accumulator + currentValue.sendingAmountInEuro + currentValue.fees;
  }, 0);

  const totalProfit = paymentDetails.reduce((accumulator, currentValue) => {
    return accumulator + currentValue.fees;
  }, 0);
  const totalSales = paymentDetails.length;

  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Total Revenue</CardTitle>
          <EuroIcon className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            {new Intl.NumberFormat("en-US").format(totalRevenue)} EUR
          </p>
          <p className="text-xs text-muted-foreground">Based on payment details</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Total Transection</CardTitle>
          <ShoppingBag className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{totalSales}</p>
          <p className="text-xs text-muted-foreground">Total Payment Details</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Total Profit</CardTitle>
          <ShoppingBag className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            {new Intl.NumberFormat("en-US").format(totalProfit)} EUR
          </p>
          <p className="text-xs text-muted-foreground">Based on fees from payment details</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Total Employees</CardTitle>
          <User2 className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{user.length}</p>
          <p className="text-xs text-muted-foreground">Total Users Signed Up</p>
        </CardContent>
      </Card>
    </div>
  );
}
