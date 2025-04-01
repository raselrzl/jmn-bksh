"use client"; // This directive tells Next.js that this is a client-side component

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";


interface Payment {
    id: string;
    senderName: string;
    sendingAmountInEuro: number;
    senderEmail: string | null; // Allow null
    senderPhoneNumber: string;
    senderAddress: string | null;
    receiverName: string;
    receivingAmountInBDT: number;
    receiverAddress: string;
    isPaid: boolean;
    bikashPhoneNumber: string;
    createdAt: Date;
    fees: number;
  }
  
  interface PaymentDetailsTableProps {
    paymentDetails: Payment[];
  }

export const PaymentDetailsTable: React.FC<PaymentDetailsTableProps> = ({ paymentDetails }) => {
    noStore();
  const [searchQuery, setSearchQuery] = useState(""); // State for the search query

  // Filter payment details based on the phone number
  const filteredPaymentDetails = paymentDetails.filter((payment) =>
    payment.senderPhoneNumber.includes(searchQuery)
  );

  return (
    <div >
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by Senders phone number"
        className="border p-2 mb-4 w-full"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)} // Update search query on input change
      />

      <Table className="border-2">
        <TableHeader>
          <TableRow>
            <TableHead>Payment Id</TableHead>
            <TableHead>Sender Details</TableHead>
            <TableHead>Receiver Details</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Bikash Details</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-end">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPaymentDetails.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell>{payment.id}</TableCell>
              <TableCell>
                <p>Name: {payment.senderName}</p>
                <p>Amount(EUR): {payment.sendingAmountInEuro}</p>
                <p>Fees(EUR): {payment.fees}</p>
                <p>Email: {payment.senderEmail}</p>
                <p>Phone: {payment.senderPhoneNumber}</p>
                <p>Address: {payment.senderAddress}</p>
              </TableCell>
              <TableCell>
                <p>Name: {payment.receiverName}</p>
                <p>Amount(BDT): {payment.receivingAmountInBDT}</p>
                <p>Address: {payment.receiverAddress}</p>
              </TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  className={
                    payment.isPaid
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }
                >
                  {payment.isPaid ? "Completed" : "Pending"}
                </Button>
              </TableCell>

              <TableCell>
                <p className="font-bold">Amount: {payment.receivingAmountInBDT} BDT</p>
                <p className="font-bold">Bikash Number: {payment.bikashPhoneNumber}</p>
              </TableCell>
              <TableCell>
                {new Intl.DateTimeFormat("en-US").format(payment.createdAt)}
              </TableCell>
              <TableCell className="text-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="ghost">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/paymentDetails/${payment.id}`}>Update Payment Status</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/paymentDetails/${payment.id}/delete`}>Delete</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
