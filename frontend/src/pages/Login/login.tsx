import { useState } from "react";
import { useNavigate } from "react-router";
import { LoginForm } from "@/components/login-form";

const Login = () => {
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		const formData = new FormData(e.currentTarget);
		const email = formData.get("email") as string;
		const password = formData.get("password") as string;

		if (!email || !password) {
			setError("Email and password are required");
			setLoading(false);
			return;
		}

		try {
			const response = await fetch("http://localhost:5000/api/auth/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include", // Important: Include credentials to send cookies
				body: JSON.stringify({ email, password }),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.message || "Login failed");
			}

			const data = await response.json();
			// Store only user in localStorage (token is now in HTTP-only cookie)
			localStorage.setItem("user", JSON.stringify(data.user));
			navigate("/dashboard");
		} catch (error) {
			setError(error instanceof Error ? error.message : "Login failed");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-950 p-4">
			<div className="w-full max-w-md">
				<LoginForm onSubmit={handleSubmit} loading={loading} />
				{error && (
					<div className="mt-4 p-3 text-red-400 text-sm bg-red-900/20 border border-red-800 rounded">
						{error}
					</div>
				)}
			</div>
		</div>
	);
};

export default Login;
