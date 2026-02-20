// user-page.tsx - Component to fetch and display users data

"use client";

import { useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown, Eye, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteUser } from "@/apis/userService";

export type User = {
  _id: string;
  id?: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  username: string;
  password: string;
};

export const createUserColumns = (
  onView: (user: User) => void,
  onEdit: (user: User) => void,
  onDelete: (user: User) => void
): ColumnDef<User>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: "firstName",
    header: ({ column }) => {
      return (
        <div className="text-left">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Full Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const firstName = row.getValue("firstName") as string;
      const lastName = row.original.lastName;
      return <div className="">{`${firstName} ${lastName}`}</div>;
    },
  },
  {
    accessorKey: "username",
    header: "Username",
    cell: ({ row }) => {
      const username = row.getValue("username") as string;
      return <div className="text-orange-400">@{username}</div>;
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "age",
    header: "Age",
    cell: ({ row }) => {
      const age = row.getValue("age") as number;
      return <div>{age}</div>;
    },
  },
  {
    accessorKey: "gender",
    header: "Gender",
    cell: ({ row }) => {
      const gender = row.getValue("gender") as string;
      return (
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${
            gender === "male" ? "bg-blue-900/20 text-blue-400" : "bg-pink-900/20 text-pink-400"
          }`}
        >
          {gender}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const user = row.original;
      const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
      const [isDeleting, setIsDeleting] = useState(false);

      const handleDelete = async () => {
        setIsDeleting(true);
        const result = await deleteUser(user._id);
        if (result.success) {
          onDelete(user);
          setDeleteDialogOpen(false);
        }
        setIsDeleting(false);
      };

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView(user)}>
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(user)}>
                <Edit className="mr-2 h-4 w-4" />
                Update
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setDeleteDialogOpen(true)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialog
            open={deleteDialogOpen}
            onOpenChange={(open) => {
              if (!isDeleting) {
                setDeleteDialogOpen(open);
              }
            }}
          >
            <AlertDialogContent className="max-w-md mx-auto">
              <AlertDialogHeader className="text-center pb-4">
                <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
                <AlertDialogTitle className="text-xl font-semibold text-gray-100">
                  Delete User
                </AlertDialogTitle>
                <AlertDialogDescription className="text-sm text-gray-200 mt-2">
                  This action cannot be undone. The user account will be
                  permanently removed from the system.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <div className="my-6">
                <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-md border-2 border-white">
                        {user.firstName.charAt(0)}
                        {user.lastName.charAt(0)}
                      </div>
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <Trash2 className="h-3 w-3 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 truncate">
                        {user.firstName} {user.lastName}
                      </h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          @{user.username}
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {user.gender}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        {user.email}
                      </p>
                      <p className="text-xs text-gray-500">
                        {user.phone} • Age: {user.age}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <AlertDialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 space-y-2 space-y-reverse sm:space-y-0">
                <AlertDialogCancel className="w-full sm:w-auto border-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-gray-200">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Deleting...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <Trash2 className="h-4 w-4" />
                      <span>Delete User</span>
                    </div>
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      );
    },
  },
];

// Keep the old export for backward compatibility
export const userColumns = createUserColumns(
  () => {},
  () => {},
  () => {}
);

export default createUserColumns;
