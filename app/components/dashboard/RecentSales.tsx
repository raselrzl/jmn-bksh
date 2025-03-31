import prisma from "@/app/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { unstable_noStore as noStore } from "next/cache";
async function getData() {
  const data = await prisma.paymentDetails.findMany({
    select: {
      id: true,
      sendingAmountInEuro: true,
      receiverName: true,
      receiverAddress: true,
      senderName: true,
      senderPhoneNumber: true,
      senderEmail: true,
      bikashPhoneNumber:true,
      receivingAmountInBDT:true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 7,
  });

  return data;
}

export async function RecentSales() {
  noStore()
  const data = await getData();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Payment Details</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-8">
        {data.map((item) => (
          <div className="flex items-center gap-4" key={item.id}>
            <div className="grid gap-1">
              <p className="text-sm font-medium">Sender: {item.senderName}</p>
            </div>
            <div className="ml-auto">
              <p className="text-sm font-medium">Receiver: {item.receiverName}</p>
              <p className="text-xs text-muted-foreground">Amount: {new Intl.NumberFormat("en-US").format(item.receivingAmountInBDT)} BDT</p>
              <p className="text-xs text-muted-foreground">Receiver: {item.bikashPhoneNumber}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
