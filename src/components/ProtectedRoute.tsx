import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import { authService } from "../services/authService";
import { AuthUser } from "@/types/auth";

interface ProtectedRouteProps {
	children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
	const [user, setUser] = useState<AuthUser | null>(null);

	useEffect(() => {
		const verifyToken = async () => {
			try {
				// Call the verify endpoint to validate the token server-side
				// The token is sent automatically in the HTTP-only cookie
				const response = await fetch("http://localhost:5000/api/auth/verify", {
					credentials: "include",
				});

				if (response.ok) {
					const data = await response.json();
					setUser(data.user);
					setIsAuthenticated(true);
				} else {
					// Token is invalid or expired
					setIsAuthenticated(false);
					// Clear any local storage user data
					localStorage.removeItem("user");
				}
			} catch (error) {
				console.error("Token verification failed:", error);
				setIsAuthenticated(false);
			}
		};

		verifyToken();
	}, []);

	if (isAuthenticated === null) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
			</div>
		);
	}

	// Store user in localStorage for other components that might need it
	if (user) {
		localStorage.setItem("user", JSON.stringify(user));
	}

	return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
