import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/db";
import { unstable_noStore as noStore } from "next/cache";
export async function POST(req: NextRequest, {
    params: paramsPromise,
  }: {
    params: Promise<{ id: string }>;
  }) {
    const params = await paramsPromise;
noStore();
  try {
    const user = await prisma.user.findUnique({
      where: { id: String(params.id) },
    });
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    if (user.isAdmin) {
      return NextResponse.json(
        { error: "User is already an admin" },
        { status: 400 }
      );
    }
    const updatedUser = await prisma.user.update({
      where: { id: String(params.id) },
      data: {
        isAdmin: true, 
      },
    });
    return NextResponse.json(
      { message: "User promoted to admin successfully", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to promote user to admin" },
      { status: 500 }
    );
  }
}
