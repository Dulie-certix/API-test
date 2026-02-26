"use client";

import { useState, useEffect } from "react";
import {
  userColumns,
  useUserDialog,
  setEditDialogState,
  setRefreshFunction,
  type User,
} from "./userTable";
import { DataTable } from "../../components/customUi/data-table";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Plus } from "lucide-react";
import { UserViewDialog } from "./userViewCard";
import { UserForm } from "./userForm";

export default function UserPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { selectedUser, dialogOpen, setDialogOpen } = useUserDialog();

  const refreshUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("http://localhost:5000/api/users");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  // Set edit dialog state functions and refresh function
  useEffect(() => {
    setEditDialogState(setEditUser, setEditDialogOpen);
    setRefreshFunction(refreshUsers);
  }, []);

  useEffect(() => {
    refreshUsers();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-center">
          <div className="text-lg">Loading users...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center text-red-500">
          <h2 className="mb-2 text-xl font-bold">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">User Management ({users.length})</h1>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
            </DialogHeader>
            <UserForm
              onSuccess={() => {
                setAddDialogOpen(false);
                refreshUsers();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
      <DataTable
        columns={userColumns}
        data={users}
        filterColumn="firstName"
        filterPlaceholder="Filter by name..."
      />
      <UserViewDialog
        user={selectedUser}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update User</DialogTitle>
          </DialogHeader>
          <UserForm
            editUser={editUser}
            isEditing={true}
            onSuccess={() => {
              setEditDialogOpen(false);
              refreshUsers();
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export { userColumns, useUserDialog };
