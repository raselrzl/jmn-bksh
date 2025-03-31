import prisma from "@/app/lib/db";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { PaymentDetailsTable } from "./PaymentDetailsTable";

// Fetch payment details from the database
async function getPaymentDetails() {
  const paymentDetails = await prisma.paymentDetails.findMany({
    orderBy: {
      createdAt: "desc", // Optionally order by creation date
    },
  });

  return paymentDetails;
}

export default async function PaymentDetailsRoute() {
  noStore();
  const paymentDetails = await getPaymentDetails(); // Fetch payment details

  return (
    <>
      <div className="flex items-center justify-end mb-4">
        {" "}
        {/* Use justify-end to align to the right */}
        {/* Add Payment Button */}
        <Button
          asChild
          className="flex items-center gap-x-2"
          variant={"destructive"}
        >
          <Link href="/dashboard/paymentDetails/create">
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Payment</span>
          </Link>
        </Button>
      </div>

      {/* Pass paymentDetails as prop to the client component */}
      <PaymentDetailsTable paymentDetails={paymentDetails} />
    </>
  );
}
