import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link } from "react-router"

interface LoginFormProps extends React.ComponentProps<"form"> {
  loading?: boolean;
}

export function LoginForm({
  className,
  loading = false,
  ...props
}: LoginFormProps) {
  return (
		<div className="w-full max-w-md mx-auto bg-gray-900 border border-gray-800 rounded-lg p-6">
			<div className="text-center mb-6">
				<h1 className="text-2xl font-bold text-white mb-2">LOGIN</h1>
				<p className="text-gray-400 text-sm">
					Enter your email and password to login
				</p>
			</div>

			<form className={cn("space-y-4", className)} {...props}>
				<div>
					<Label htmlFor="email" className="text-gray-300 text-sm font-medium">
						Email
					</Label>
					<Input
						id="email"
						name="email"
						type="email"
						placeholder="Enter your email address"
						required
						className="mt-1 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
					/>
				</div>

				<div>
					<Label
						htmlFor="password"
						className="text-gray-300 text-sm font-medium">
						Password
					</Label>
					<Input
						id="password"
						name="password"
						type="password"
						placeholder="Enter your password"
						required
						className="mt-1 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
					/>
				</div>

				<Button
					type="submit"
					disabled={loading}
					className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2">
					{loading ? "Logging in..." : "Login"}
				</Button>
			</form>

			<div className="mt-4 text-center">
				<p className="text-gray-400 text-sm mb-3">
					Don't have an account?
					<Link
						to="/register"
						className="block text-sm text-orange-500 hover:text-orange-600 font-medium underline">
						Register Now
					</Link>
				</p>
			</div>
		</div>
	);
}
