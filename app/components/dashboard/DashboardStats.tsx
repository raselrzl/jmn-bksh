import prisma from "@/app/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, EuroIcon, PartyPopper, ShoppingBag, User2 } from "lucide-react";
import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";

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
  noStore();
  const { user, paymentDetails } = await getData();

  // Calculate totalRevenue as a floating point number
  const totalRevenue = paymentDetails.reduce((accumulator, currentValue) => {
    return accumulator + currentValue.sendingAmountInEuro + currentValue.fees;
  }, 0);

  // Calculate totalProfit (fees)
  const totalProfit = paymentDetails.reduce((accumulator, currentValue) => {
    return accumulator + currentValue.fees;
  }, 0);

  // Calculate total value excluding revenue
  const totalWithoutRevenue = paymentDetails.reduce((accumulator, currentValue) => {
    return accumulator + currentValue.receivingAmountInBDT;
  }, 0);

  // Calculate total sending value in Euro
  const totalSendingValueInEuro = paymentDetails.reduce((accumulator, currentValue) => {
    return accumulator + currentValue.sendingAmountInEuro;
  }, 0);

  const totalSales = paymentDetails.length;

  // Format totalRevenue, totalWithoutRevenue, and totalSendingValueInEuro to always display two decimal places
  const formattedTotalRevenue = totalRevenue.toFixed(2); // Keep 2 decimal places
  const formattedTotalWithoutRevenue = totalWithoutRevenue.toFixed(2); // Keep 2 decimal places
  const formattedTotalSendingValueInEuro = totalSendingValueInEuro.toFixed(2); // Keep 2 decimal places

  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-6">
      {/* Existing Total Revenue Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Total Revenue</CardTitle>
          <EuroIcon className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            {new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR" }).format(
              parseFloat(formattedTotalRevenue)
            )}
          </p>
          <p className="text-xs text-muted-foreground">Based on payment details</p>
        </CardContent>
      </Card>

       {/* New Card for Total Sending Value in Euro */}
       <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Total Sending Value in EUR</CardTitle>
          <EuroIcon className=" h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            {new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR" }).format(
              parseFloat(formattedTotalSendingValueInEuro)
            )}
          </p>
          <p className="text-xs text-muted-foreground">Based on sending amounts in Euro</p>
        </CardContent>
      </Card>

      {/* Total Bikash Amount */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Total Bikash Amount (BDT)</CardTitle>
          <p className="text-2xl text-green-500">৳</p>
        </CardHeader>
        <CardContent>
          <p className="text-md font-bold">
            {new Intl.NumberFormat("en-US", { style: "currency", currency: "BDT" }).format(
              parseFloat(formattedTotalWithoutRevenue)
            )}
          </p>
          <p className="text-xs text-muted-foreground">Excluding revenue</p>
        </CardContent>
      </Card>

      {/* Existing Total Transaction Card */}
      <Card>
      <Link href="/dashboard/paymentDetails">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
        
          <CardTitle>Total Transaction</CardTitle>
          <ShoppingBag className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{totalSales}</p>
          <p className="text-xs text-muted-foreground">Total Payment Details</p>
        </CardContent>
        </Link>
      </Card>
       {/* Existing Total Employees Card */}
       
       <Card>
       <Link href="/users">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Total Employees</CardTitle>
          <User2 className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{user.length}</p>
          <p className="text-xs text-muted-foreground">Total Users Signed Up</p>
        </CardContent>
        </Link>
      </Card>
      
    

      {/* Existing Total Profit Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Total Profit</CardTitle>
          <ShoppingBag className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            {new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR" }).format(totalProfit)}
          </p>
          <p className="text-xs text-muted-foreground">Based on fees from payment details</p>
        </CardContent>
      </Card>

     

      

     
    </div>
  );
}
