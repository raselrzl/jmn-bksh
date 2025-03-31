// pages/api/users/[id]/route.ts
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
    if (!user.isAdmin) {
      return NextResponse.json(
        { error: "User is already a normal user" },
        { status: 400 }
      );
    }
    const updatedUser = await prisma.user.update({
      where: { id: String(params.id) },
      data: {
        isAdmin: false,
      },
    });
    return NextResponse.json(
      { message: "Admin status revoked successfully", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to revoke admin status" },
      { status: 500 }
    );
  }
}
