import { z } from "zod";

export const paymentDetailsSchema = z.object({
  senderName: z.string(),
  senderPhoneNumber: z.string(),
  senderEmail: z.string().optional(),
  senderAddress: z.string().optional(),
  sendingAmountInEuro: z.number().min(0.01),
  fees: z.number().min(0),
  exchangeRate: z.number().min(0.01),
  receiverName: z.string(),
  bikashPhoneNumber: z.string(),
  receiverAddress: z.string(),
  isPaid: z.boolean().optional(),
});


export const updatepaymentDetailsSchema = z.object({
  isPaid: z.boolean().optional(),
});