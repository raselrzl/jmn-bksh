import { NextResponse } from 'next/server';
import prisma from '@/app/lib/db';
import { unstable_noStore as noStore } from "next/cache";
export async function DELETE(req: Request) {
  noStore();
  try {
    // Log the incoming request body to debug
    const requestBody = await req.json();
    console.log("Request Body:", requestBody); // Add this log for debugging
    
    const { homeId } = requestBody; // Extract homeId from the request body

    if (!homeId) {
      return NextResponse.json({ message: "Home ID is required" }, { status: 400 });
    }

    // Find the home to delete
    const home = await prisma.home.findUnique({
      where: { id: homeId },
    });

    if (!home) {
      return NextResponse.json({ message: "Home not found" }, { status: 404 });
    }

    // Delete related data: Photos, Reservations, and Favorites (if necessary)
    await prisma.photo.deleteMany({
      where: { homeId },
    });

    await prisma.reservation.deleteMany({
      where: { homeId },
    });

    await prisma.favorite.deleteMany({
      where: { homeId },
    });

    // Delete the home
    await prisma.home.delete({
      where: { id: homeId },
    });

    return NextResponse.json({ message: "Home successfully deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting home:", error);
    return NextResponse.json({ message: "An error occurred while deleting the home" }, { status: 500 });
  }
}
