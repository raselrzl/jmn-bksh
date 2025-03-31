"use server";
import { revalidatePath } from "next/cache";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { parseWithZod } from "@conform-to/zod";
import prisma from "@/app/lib/db";
import {
  paymentDetailsSchema,
  updatepaymentDetailsSchema,
} from "./lib/zodSchemas";

export async function verifySecretCode(
  otp: string
): Promise<{ success: boolean }> {
  try {
    console.log("Attempting to verify OTP:", otp); // Log the OTP being attempted

    // Convert the otp string to a number to match the database field type (Int)
    const parsedOtp = parseInt(otp);

    if (isNaN(parsedOtp)) {
      throw new Error("OTP should be a valid number.");
    }

    console.log("Parsed OTP:", parsedOtp); // Log the parsed OTP value

    // Query the user from the database where the secret code matches
    const user = await prisma.user.findUnique({
      where: {
        secretCode: parsedOtp, // Match with the secretCode in the database
      },
    });

    // Check if the user exists
    if (user) {
      console.log(`User with secretCode ${otp} found:`, user);
      return { success: true };
    } else {
      console.error(`No user found with secretCode: ${otp}`);
      throw new Error("Invalid SECRET Code");
    }
  } catch (error: unknown) {
    // Type guard: check if the error is an instance of Error
    if (error instanceof Error) {
      // Log the actual error message for easier debugging
      console.error("Error verifying secret code:", error.message);
      throw new Error("An error occurred while verifying the secret code.");
    } else {
      // Handle cases where the error is not an instance of Error
      console.error("Unknown error occurred while verifying the secret code.");
      throw new Error("An unknown error occurred.");
    }
  }
}

async function getUsers() {
  return await prisma.user.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      isAdmin: true,
      profileImage: true,
    },
  });
}

export async function createPaymentDetails(
  prevState: unknown,
  formData: FormData
) {
     const { getUser } = getKindeServerSession();
     const user = await getUser();
     const users = await getUsers();
     const isAdmin = users.some((u) => u.email === user?.email && u.isAdmin); 
     console.log(isAdmin)
     if (!isAdmin) {
      return redirect("/");
    }

  const submission = parseWithZod(formData, {
    schema: paymentDetailsSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const {
    senderName,
    senderPhoneNumber,
    senderEmail,
    senderAddress,
    sendingAmountInEuro,
    fees,
    exchangeRate,
    receiverName,
    bikashPhoneNumber,
    receiverAddress,
    isPaid,
  } = submission.value;

  const receivingAmountInBDT = sendingAmountInEuro * exchangeRate;

  await prisma.paymentDetails.create({
    data: {
      senderName: submission.value.senderName,
      senderPhoneNumber: submission.value.senderPhoneNumber,
      senderEmail: submission.value.senderEmail,
      senderAddress: submission.value.senderAddress,
      sendingAmountInEuro: submission.value.sendingAmountInEuro,
      fees: submission.value.fees,
      exchangeRate: submission.value.exchangeRate,
      receiverName: submission.value.receiverName,
      bikashPhoneNumber: submission.value.bikashPhoneNumber,
      receiverAddress: submission.value.receiverAddress,
      receivingAmountInBDT: receivingAmountInBDT,
      isPaid: submission.value.isPaid === true ? true : false,
    },
  });

  redirect("/dashboard/paymentDetails");
}

export async function deleteProduct(formData: FormData) {
  const { getUser } = getKindeServerSession();
     const user = await getUser();
     const users = await getUsers();
     const isAdmin = users.some((u) => u.email === user?.email && u.isAdmin); 
     console.log(isAdmin)
     if (!isAdmin) {
      return redirect("/");
    }

  await prisma.paymentDetails.delete({
    where: {
      id: formData.get("productId") as string,
    },
  });

  redirect("/dashboard/paymentDetails");
}

export async function editProduct(prevState: any, formData: FormData) {
  const { getUser } = getKindeServerSession();
     const user = await getUser();
     const users = await getUsers();
     const isAdmin = users.some((u) => u.email === user?.email && u.isAdmin); 
     console.log(isAdmin)
     if (!isAdmin) {
      return redirect("/");
    }

  const submission = parseWithZod(formData, {
    schema: updatepaymentDetailsSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const productId = formData.get("productId") as string;

  // Update the payment status (isPaid) in the database
  await prisma.paymentDetails.update({
    where: {
      id: productId,
    },
    data: {
      isPaid: submission.value.isPaid, // Directly use the `isPaid` value from form data
    },
  });

  redirect("/dashboard/paymentDetails"); // Redirect after update
}
