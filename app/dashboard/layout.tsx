import { ReactNode } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { CircleUser, MenuIcon, MenuSquareIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import prisma from "@/app/lib/db";

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

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  noStore();
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const users = await getUsers();
  const isAdmin = users.some((u) => u.email === user?.email && u.isAdmin);
  console.log(isAdmin);
  if (!isAdmin) {
    return redirect("/");
  }
  /*  if (!user || user.email !== "rasel6041@gmail.com") {
    return redirect("/");
  } */

  return (
    <div className="flex w-full flex-col max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
      <header className="sticky top-0 flex h-16 items-center justify-between gap-4 border-b bg-white rounded-lg">
        <nav className="hidden font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6 ml-6">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/dashboard/paymentDetails">All Payment Records</Link>
        </nav>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <img
              src={
                user?.picture ??
                "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
              }
              alt="Image of the user"
              className="rounded-full h-8 w-8 text-red-800 cursor-pointer"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{user.given_name}</DropdownMenuLabel>
            <DropdownMenuLabel className="text-xs text-gray-600">
              {user.email}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard" className="w-full cursor-pointer">Dashboard</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/dashboard/paymentDetails" className="w-full">
                Records
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/dashboard/paymentDetails/create" className="w-full">
                Create a new Record
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/users" className="w-full">
                List of Employees
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="mt-4 font-bold text-center cursor-pointer">
              <LogoutLink>Logout</LogoutLink>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
      <main className="my-5">{children}</main>
    </div>
  );
}
