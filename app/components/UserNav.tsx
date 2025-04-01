import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Accessibility, Contact2, LocateOff, MenuIcon } from "lucide-react";
import {
  RegisterLink,
  LoginLink,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Link from "next/link";
import prisma from "@/app/lib/db";
import { unstable_noStore as noStore } from "next/cache";
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

export async function UserNav() {
  noStore();
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  // Get users list to check if the current user is admin
  const users = await getUsers();
  const isAdmin = users.some((u) => u.email === user?.email && u.isAdmin);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="border-black cursor-pointer flex-row rounded-lg border px-2 py-2 lg:px-4 items-center lg:py-2 flex gap-x-3">
        <MenuIcon className="text-red-800 font-extrabold w-8 h-8" />
        <img
          src={
            user?.picture ??
            "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
          }
          alt="Image of the user"
          className="rounded-full h-8 w-8 text-red-800"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        {user ? (
          <>
            {isAdmin ? (
              <>
                {/* <DropdownMenuItem>
                <Link href="/dashboard/paymentDetails" className="w-full">
                      Payment Records
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/users" className="w-full">
                    List of Employees
                  </Link>
                </DropdownMenuItem> */}
                {/* <DropdownMenuSeparator /> */}
                <DropdownMenuItem>
                  <Link href="/dashboard" className="w-full">
                    Dashboard
                  </Link>
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuItem className="mt-4 font-bold text-center text-red-800">
                  <LocateOff className="text-red-800 font-extrabold text-3xl" />{" "}
                  You are unauthorized, Ask Admin to get access!
                </DropdownMenuItem>
              </>
            )}

            <DropdownMenuItem className="mt-4 font-bold text-center">
              <LogoutLink className="w-full">Logout</LogoutLink>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem>
              <RegisterLink className="w-full">Register</RegisterLink>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LoginLink className="w-full">Login</LoginLink>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
