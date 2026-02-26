import { useState, useEffect } from "react";
import { DataTable } from "@/components/customUi/data-table";
import { createUserColumns, type User } from "./userTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UserForm } from "./userForm";
import { UserViewCard } from "./userViewCard";
import { getAllUsers } from "@/apis/userService";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editUser, setEditUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const result = await getAllUsers();
      if (result.success && result.data) {
        const dbUsers = result.data;
        
        // Add hardcoded admin to the list
        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
        const adminUser = {
          _id: "admin",
          firstName: "Admin",
          lastName: "User",
          email: "admin@gmail.com",
          age: 30,
          gender: "N/A",
          phone: "N/A",
          role: "admin" as const,
        };
        
        // Only add admin if current user is admin
        const allUsers = currentUser.role === "admin" ? [adminUser, ...dbUsers] : dbUsers;
        setUsers(allUsers);
      } else {
        console.error("Error fetching users:", result.message);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSuccess = () => {
    setDialogOpen(false);
    setEditDialogOpen(false);
    fetchUsers();
  };

  const handleView = (user: User) => {
    setSelectedUser(user);
    setViewDialogOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditUser(user);
    setEditDialogOpen(true);
  };

  const handleDelete = async (user: User) => {
    // Delete functionality handled in userTable
    fetchUsers();
  };

  const columns = createUserColumns(handleView, handleEdit, handleDelete);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Users</h1>
          <p className="text-gray-400">Manage user accounts</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-500 hover:bg-orange-600">
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-800 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">Add New User</DialogTitle>
            </DialogHeader>
            <UserForm onSuccess={handleSuccess} />
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="bg-gray-900 border border-gray-800 rounded-lg">
        <DataTable columns={columns} data={users} />
      </div>

      {/* View User Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && <UserViewCard user={selectedUser} />}
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">Edit User</DialogTitle>
          </DialogHeader>
          {editUser && (
            <UserForm 
              onSuccess={handleSuccess} 
              editUser={editUser} 
              isEditing={true} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}