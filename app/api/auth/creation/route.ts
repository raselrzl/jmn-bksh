import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";
import { unstable_noStore as noStore } from "next/cache";

// Function to generate a unique secret code (you can change this logic)
async function generateUniqueCode(): Promise<number> {
  return Math.floor(Math.random() * 1000000); // Example: Generate a random 6-digit code
}

export async function GET() {
  noStore();
  const { getUser } = getKindeServerSession();
  const uniqueCode = await generateUniqueCode(); // Generate secret code
  const user = await getUser();

  if (!user || user === null || !user.id) {
    throw new Error("Something went wrong, I'm sorry....");
  }

  let dbUser = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
  });

  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        email: user.email ?? "",
        firstName: user.given_name ?? "",
        lastName: user.family_name ?? "",
        id: user.id,
        isAdmin: false,
        secretCode: uniqueCode, // Assign generated secretCode
        profileImage:
          user.picture ?? `https://avatar.vercel.sh/${user.given_name}`,
      },
    });
  }

  if (user.email === "rasel6041@gmail.com") {
    dbUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        isAdmin: true,
      },
    });
  }

  // Check if running on localhost:3000 (development)
  const isDevelopment = process.env.NODE_ENV === "development";
  const redirectUrl = isDevelopment
    ? "http://localhost:3000/dashboard" // Redirect to localhost for development
    : "https://taha-plum.vercel.app/dashboard"; // Redirect to production URL

  return NextResponse.redirect(redirectUrl);
}
