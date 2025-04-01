// app/users/page.tsx
import prisma from "@/app/lib/db";
import { UserList } from "./UserList";
import { redirect } from "next/navigation";
import { getKindeServerSession, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/server";
import { NoItems } from "../components/NoItem";
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CircleUser } from "lucide-react";
import { unstable_noStore as noStore } from "next/cache";

// Fetch users from the database
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

export default async function UsersPage() {
  noStore();
  const users = await getUsers();

  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const adminUser = users.find((dbUser) => dbUser.isAdmin && dbUser.email === user?.email);
  if (!adminUser) {
    return redirect("/"); 
  }

  return (
    <div className="container mx-auto px-5 mt-10">
      <header className="sticky top-0 flex h-16 items-center justify-between gap-4 border-b bg-white rounded-lg">
        <nav className="hidden font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6 ml-6">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/dashboard/paymentDetails">All Payment Records</Link>
        </nav>

        <DropdownMenu>
          <DropdownMenuTrigger asChild className="cursor-pointer">
          <img
          src={
            user?.picture ??
            "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
          }
          alt="Image of the user"
          className="rounded-full h-8 w-8 text-red-800"
        />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{user.given_name}</DropdownMenuLabel>
            <DropdownMenuLabel className="text-xs text-gray-600">
              {user.email}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard" className="cursor-pointer">Dashboard</Link>
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
            <DropdownMenuItem asChild className="mt-4 font-bold cursor-pointer text-center">
              <LogoutLink>Logout</LogoutLink>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
      <h2 className="text-2xl font-semibold tracking-tight text-center uppercase mt-4">All Employees</h2>

      {users.length === 0 ? (
         <NoItems
                title="There is no any user registered"
                description="if there is user you will see it right here..."
              />
      ) : (
        <UserList users={users} />
      )}
    </div>
  );
}
