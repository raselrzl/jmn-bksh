"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { paymentDetailsSchema, updatepaymentDetailsSchema } from "@/app/lib/zodSchemas";
import { editProduct } from "@/app/action";
import { SubmitButton } from "../SubmitButtons";

interface iAppProps {
  data: {
    id: string;
    isPaid: boolean;
  };
}

export function EditForm({ data }: iAppProps) {
  const [lastResult, action] = useActionState(editProduct, undefined);
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: updatepaymentDetailsSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  return (
    <form id={form.id} onSubmit={form.onSubmit} action={action}>
      <input type="hidden" name="productId" value={data.id} />
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/paymentDetails">
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </Button>
        <h1 className="text-xl font-semibold tracking-tight">Update Payment Status</h1>
      </div>

      <Card className="mt-5">
        <CardHeader>
          <CardTitle>Payment Status</CardTitle>
          <CardDescription>
            In this form, you can update the payment status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            <Label>Payment Status</Label>
            <Switch
              key={fields.isPaid.key}
              name={fields.isPaid.name}
              defaultChecked={data.isPaid}
              className="cursor-pointer"
            />
            <p className="text-red-500">{fields.isPaid.errors}</p>
          </div>
        </CardContent>
        <CardFooter >
          <SubmitButton text="Update Payment Status" />
        </CardFooter>
      </Card>
    </form>
  );
}