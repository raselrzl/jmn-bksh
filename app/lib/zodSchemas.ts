import { z } from "zod";

// Update schema for the float fields
export const paymentDetailsSchema = z.object({
  senderName: z.string(),
  senderPhoneNumber: z.string(),
  senderEmail: z.string().optional(),
  senderAddress: z.string().optional(),
  sendingAmountInEuro: z
    .number()
    .min(0.01, "Amount must be greater than 0")
    .refine(val => !isNaN(val), { message: "Invalid float value" }),

  fees: z
    .number()
    .min(0, "Fees must be greater than or equal to 0")
    .refine(val => !isNaN(val), { message: "Invalid float value" }),

  exchangeRate: z
    .number()
    .min(0.01, "Exchange rate must be greater than 0")
    .refine(val => !isNaN(val), { message: "Invalid float value" }),

  receiverName: z.string(),
  bikashPhoneNumber: z.string(),
  receiverAddress: z.string(),
  isPaid: z.boolean().optional(),
});



export const updatepaymentDetailsSchema = z.object({
  isPaid: z.boolean().optional(),
});