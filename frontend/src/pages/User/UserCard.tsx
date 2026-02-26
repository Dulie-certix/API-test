import { User } from "./userTable";

interface UserCardProps {
  user: User;
  onClick?: () => void;
}

export function UserCard({ user, onClick }: UserCardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-orange-500 transition-all ${
        onClick ? "cursor-pointer" : ""
      }`}
    >
      <div className="flex items-center space-x-4">
        {user.image ? (
          <img
            src={user.image}
            alt={`${user.firstName} ${user.lastName}`}
            className="w-16 h-16 rounded-full object-cover border-2 border-orange-500"
          />
        ) : (
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg border-2 border-orange-500">
            {user.firstName.charAt(0)}
            {user.lastName.charAt(0)}
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white text-lg truncate">
            {user.firstName} {user.lastName}
          </h3>
          <p className="text-sm text-orange-400 truncate">@{user.username}</p>
          <p className="text-sm text-gray-400 truncate">{user.email}</p>
        </div>
      </div>
    </div>
  );
}
