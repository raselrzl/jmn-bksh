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
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { paymentDetailsSchema } from "@/app/lib/zodSchemas";
import { createPaymentDetails } from "@/app/action";
import { useActionState } from "react";
import { SubmitButton } from "@/app/components/SubmitButtons";

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

      <Card className="mt-5">
        <CardHeader>
          <CardTitle>Payment Details</CardTitle>
          <CardDescription>Create Payment Details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            {/* Sender Information */}
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

            <div className="flex flex-col gap-3">
              <Label>Sending Amount in Euro</Label>
              <Input
                type="number"
                name={fields.sendingAmountInEuro.name}
                defaultValue={fields.sendingAmountInEuro.initialValue}
                placeholder="Amount in Euro"
              />
              <p className="text-red-500">
                {fields.sendingAmountInEuro.errors}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Label>Fees</Label>
              <Input
                type="number"
                name={fields.fees.name}
                defaultValue={fields.fees.initialValue}
                placeholder="Fees"
              />
              <p className="text-red-500">{fields.fees.errors}</p>
            </div>

            <div className="flex flex-col gap-3">
              <Label>Exchange Rate</Label>
              <Input
                type="number"
                name={fields.exchangeRate.name}
                defaultValue={fields.exchangeRate.initialValue}
                placeholder="Exchange Rate"
              />
              <p className="text-red-500">{fields.exchangeRate.errors}</p>
            </div>

            {/* Receiver Information */}
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
              <Label>Bikash status</Label>
              <Switch
                key={fields.isPaid.key}
                name={fields.isPaid.name}
                defaultValue={fields.isPaid.initialValue}
              />
              <p className="text-red-500">{fields.isPaid.errors}</p>
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
