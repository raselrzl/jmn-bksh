"use client";
import { unstable_noStore as noStore } from "next/cache";
noStore();
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { paymentDetailsSchema } from "@/app/lib/zodSchemas";
import { createPaymentDetails } from "@/app/action";
import { useActionState } from "react";
import { SubmitButton } from "@/app/components/SubmitButtons";
import { useState, useEffect } from "react";

export default function PaymentDetailsCreateRoute() {
  noStore();
  const [lastResult, action] = useActionState(createPaymentDetails, undefined);
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      console.log("Validation failed");
      return parseWithZod(formData, { schema: paymentDetailsSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  // State for the multiplication result of exchange rate and sending amount
  const [exchangeRate, setExchangeRate] = useState(0);
  const [sendingAmount, setSendingAmount] = useState(0);
  const [calculatedAmount, setCalculatedAmount] = useState(0);

  // Handle the exchange rate input change
  const handleExchangeRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rate = parseFloat(e.target.value || "0");
    setExchangeRate(rate);
  };

  // Handle the sending amount input change
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = parseFloat(e.target.value || "0");
    setSendingAmount(amount);
  };

  // Calculate the result whenever exchange rate or sending amount changes
  useEffect(() => {
    setCalculatedAmount(exchangeRate * sendingAmount);
  }, [exchangeRate, sendingAmount]);

  return (
    <form id={form.id} onSubmit={form.onSubmit} action={action}>
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/paymentDetails">
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </Button>
        <h1 className="text-xl font-semibold tracking-tight">New Payment</h1>
      </div>

      {/* Exchange rate and amount input section */}
      <Card className="mt-5">
        <CardContent>
          <div className="flex flex-col gap-3">
            <h2 className="font-semibold text-lg">Exchange Rate Calculation</h2>

            {/* Flex container to display inputs on the same line */}
            <div className="flex items-center gap-4">
           

              {/* Amount Input */}
              <div className="flex flex-col gap-1">
                <Label>Amount (EUR)</Label>
                <Input
                  type="number"
                  value={sendingAmount || ""}
                  onChange={handleAmountChange}
                  placeholder="Enter Amount"
                />
              </div>

                 {/* Exchange Rate Input */}
                 <div className="flex flex-col gap-1">
                <Label>Exchange Rate</Label>
                <Input
                  type="number"
                  value={exchangeRate || ""}
                  onChange={handleExchangeRateChange}
                  placeholder="Enter Rate"
                />
              </div>

              {/* Output (Calculated Amount) */}
              <div className="flex flex-col gap-1">
                <Label>Amount (BDT)</Label>
                <Input
                  type="text"
                  value={calculatedAmount ? calculatedAmount.toFixed(2) : "0.00"} // Show result with 2 decimal places
                  readOnly
                  placeholder="Calculated Amount"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-5">
        <CardHeader>
          <div >
          <CardTitle className="text-center font-bold">Payment</CardTitle>
          <CardDescription className="text-center">Create a new Payment Details</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Sender Info Section */}
            <div className="flex flex-col gap-3 ">
              <h2 className="font-extrabold uppercase text-lg text-center">Sender Details</h2>

              <div className="flex flex-col gap-3">
                <Label>Sender Name</Label>
                <Input
                  type="text"
                  name={fields.senderName.name}
                  defaultValue={fields.senderName.initialValue}
                  placeholder="Sender Name"
                />
                <p className="text-red-500">{fields.senderName.errors}</p>
              </div>

              <div className="flex flex-col gap-3">
                <Label>Sender Phone Number</Label>
                <Input
                  type="text"
                  name={fields.senderPhoneNumber.name}
                  defaultValue={fields.senderPhoneNumber.initialValue}
                  placeholder="Sender Phone Number"
                />
                <p className="text-red-500">{fields.senderPhoneNumber.errors}</p>
              </div>

              <div className="flex flex-col gap-3">
                <Label>Sender Email (Optional)</Label>
                <Input
                  type="email"
                  name={fields.senderEmail.name}
                  defaultValue={fields.senderEmail.initialValue}
                  placeholder="Sender Email"
                />
              </div>

              <div className="flex flex-col gap-3">
                <Label>Sender Address (Optional)</Label>
                <Input
                  type="text"
                  name={fields.senderAddress.name}
                  defaultValue={fields.senderAddress.initialValue}
                  placeholder="Sender Address"
                />
              </div>
              <h2 className="font-extrabold uppercase text-lg text-center">Transection Details</h2>
              <div className="flex flex-col gap-3">
                <Label>Sending Amount in Euro</Label>
                <Input
                  type="number"
                  name={fields.sendingAmountInEuro.name}
                  defaultValue={fields.sendingAmountInEuro.initialValue}
                  placeholder="Amount in Euro"
                  step="any"
                />
                <p className="text-red-500">{fields.sendingAmountInEuro.errors}</p>
              </div>

              

              <div className="flex flex-col gap-3">
                <Label>Exchange Rate</Label>
                <Input
                  type="number"
                  name={fields.exchangeRate.name}
                  defaultValue={fields.exchangeRate.initialValue}
                  placeholder="Exchange Rate"
                  step="any"
                />
                <p className="text-red-500">{fields.exchangeRate.errors}</p>
              </div>
              <div className="flex flex-col gap-3">
                <Label>Fees</Label>
                <Input
                  type="number"
                  name={fields.fees.name}
                  defaultValue={fields.fees.initialValue}
                  placeholder="Fees"
                  step="any"
                />
                <p className="text-red-500">{fields.fees.errors}</p>
              </div>
            </div>

            {/* Receiver Info Section */}
            <div className="flex flex-col gap-3">
              <h2 className="font-extrabold uppercase text-lg text-center">Receiver Details</h2>

              <div className="flex flex-col gap-3">
                <Label>Receiver Name</Label>
                <Input
                  type="text"
                  name={fields.receiverName.name}
                  defaultValue={fields.receiverName.initialValue}
                  placeholder="Receiver Name"
                />
                <p className="text-red-500">{fields.receiverName.errors}</p>
              </div>

              <div className="flex flex-col gap-3">
                <Label>Bikash Phone Number</Label>
                <Input
                  type="text"
                  name={fields.bikashPhoneNumber.name}
                  defaultValue={fields.bikashPhoneNumber.initialValue}
                  placeholder="Bikash Phone Number"
                />
                <p className="text-red-500">{fields.bikashPhoneNumber.errors}</p>
              </div>

              <div className="flex flex-col gap-3">
                <Label>Receiver Address</Label>
                <Input
                  type="text"
                  name={fields.receiverAddress.name}
                  defaultValue={fields.receiverAddress.initialValue}
                  placeholder="Receiver Address"
                />
                <p className="text-red-500">{fields.receiverAddress.errors}</p>
              </div>

              <div className="flex flex-col gap-3">
                <Label>Bikash Status</Label>
                <Switch
                  key={fields.isPaid.key}
                  name={fields.isPaid.name}
                  defaultValue={fields.isPaid.initialValue}
                />
                <p className="text-red-500">{fields.isPaid.errors}</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <SubmitButton text="Create a new Payment" />
        </CardFooter>
      </Card>
    </form>
  );
}
