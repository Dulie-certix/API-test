import { useState } from "react";

interface UserDetails {
  name: string;
  email: string;
  phone: string;
}

export function useUser() {
  const [users, setUsers] = useState<UserDetails[]>([]);

  const addUser = (user: UserDetails) => {
    setUsers((prev) => [...prev, user]);
  };

  return { users, addUser };
}
