"use client";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { NoItems } from "../components/NoItem";

// Client component (UserList.tsx)

async function handlePromoteToAdmin(userId: string) {
  try {
    const response = await fetch(`/api/users/${userId}/admin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to promote user to admin");
    }

    const result = await response.json();
    toast.success(result.message);
    return true;
  } catch (error) {
    toast.error("Something went wrong. Please try again.");
    return false;
  }
}

async function handleRevokeAdmin(userId: string) {
  try {
    const response = await fetch(`/api/users/${userId}/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to revoke admin status");
    }

    const result = await response.json();
    toast.success(result.message);
    return true;
  } catch (error) {
    toast.error("Something went wrong. Please try again.");
    return false;
  }
}

export function UserList({ users }: { users: Array<any> }) {
  const [updatedUsers, setUpdatedUsers] = useState(users);
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const promoteToAdmin = async (userId: string) => {
    setLoadingUserId(userId); // Set loading state
    const success = await handlePromoteToAdmin(userId);

    if (success) {
      setUpdatedUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, isAdmin: true } : user
        )
      );
      // Reload the page after success
      window.location.reload();
    }
    setLoadingUserId(null); // Reset loading state
  };

  const revokeAdmin = async (userId: string) => {
    setLoadingUserId(userId); // Set loading state
    const success = await handleRevokeAdmin(userId);

    if (success) {
      setUpdatedUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, isAdmin: false } : user
        )
      );
      // Reload the page after success
      window.location.reload();
    }
    setLoadingUserId(null); // Reset loading state
  };

  // Filter users based on search term
  const filteredUsers = updatedUsers.filter((user) => {
    const fullName =
      (user.firstName || "").toLowerCase() +
      " " +
      (user.lastName || "").toLowerCase();
    const email = (user.email || "").toLowerCase();
    const lowerSearchTerm = searchTerm.toLowerCase();

    return (
      fullName.includes(lowerSearchTerm) || email.includes(lowerSearchTerm)
    );
  });

  return (
    <div className="mt-8">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 w-[250px]"
        />
      </div>

      {/* Show message if no users match the search */}
      {filteredUsers.length === 0 && searchTerm && (
        <NoItems
        title={`There is no any user registered by this ${searchTerm}`}
        description="If there is a registered user, you will see it right here."
      />
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-2">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="py-3 px-6 text-left text-sm font-semibold">
                Name
              </th>
              <th className="py-3 px-6 text-left text-sm font-semibold">
                Email
              </th>
              <th className="py-3 px-6 text-left text-sm font-semibold">
                Role
              </th>
              <th className="py-3 px-6 text-left text-sm font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-6 text-sm">
                  {user.firstName} {user.lastName}
                </td>
                <td className="py-3 px-6 text-sm">{user.email}</td>
                <td className="py-3 px-6 text-sm w-[120px]">
                  {user.isAdmin ? "Admin" : "User"}
                </td>
                <td className="py-3 px-6 text-sm">
                  {!user.isAdmin && (
                    <Button
                      onClick={() => promoteToAdmin(user.id)}
                      disabled={loadingUserId === user.id} // Disable the button while loading
                      className={`text-green-500 hover:text-green-700 ${
                        loadingUserId === user.id
                          ? "cursor-not-allowed opacity-50"
                          : ""
                      } w-[120px]`} // Fixed width
                    >
                      {loadingUserId === user.id ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : (
                        "Make Admin"
                      )}
                    </Button>
                  )}
                  {user.isAdmin && (
                    <Button
                      onClick={() => revokeAdmin(user.id)}
                      disabled={loadingUserId === user.id} // Disable the button while loading
                      className={`text-red-500 hover:text-red-700 ${
                        loadingUserId === user.id
                          ? "cursor-not-allowed opacity-50"
                          : ""
                      } w-[120px]`} // Fixed width
                    >
                      {loadingUserId === user.id ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : (
                        "Revoke Admin"
                      )}
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
