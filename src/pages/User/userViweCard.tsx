import { User } from "@/pages/User/userTable";
import { Separator } from "@/components/ui/separator";

interface UserViewCardProps {
  user: User;
}

export function UserViewCard({ user }: UserViewCardProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        {user.image ? (
          <img
            src={user.image}
            alt={`${user.firstName} ${user.lastName}`}
            className="w-16 h-16 rounded-full object-cover border-2 border-gray-700"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        <div className={`w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg ${user.image ? 'hidden' : ''}`}>
          {user.firstName.charAt(0)}
          {user.lastName.charAt(0)}
        </div>
        <div>
          <h3 className="font-semibold text-white text-lg">
            {user.firstName} {user.lastName}
          </h3>
          <p className="text-sm text-orange-400">@{user.username}</p>
        </div>
      </div>

      <Separator className="bg-gray-700" />

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="font-medium text-gray-300">Email</p>
          <p className="text-gray-400">{user.email}</p>
        </div>
        <div>
          <p className="font-medium text-gray-300">Phone</p>
          <p className="text-gray-400">{user.phone}</p>
        </div>
        <div>
          <p className="font-medium text-gray-300">Age</p>
          <p className="text-gray-400">{user.age}</p>
        </div>
        <div>
          <p className="font-medium text-gray-300">Gender</p>
          <p className="text-gray-400 capitalize">{user.gender}</p>
        </div>
      </div>
    </div>
  );
}

// Keep the old dialog component for backward compatibility
export function UserViewDialog({
  user,
  open,
  onOpenChange,
}: {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!user) return null;

  return (
    <div>Deprecated - use UserViewCard instead</div>
  );
}
