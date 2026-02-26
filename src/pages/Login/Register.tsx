import { UserForm } from "../User/userForm";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Register = () => {
	const navigate = useNavigate();

	return (
		<div className="min-h-screen bg-gray-950 p-4">
			<div className="max-w-md mx-auto pt-8">
				<Button
					variant="ghost"
					onClick={() => navigate("/login")}
					className="mb-4 text-gray-400 hover:text-white">
					<ArrowLeft className="mr-2 h-4 w-4" />
					Back to Login
				</Button>
				<div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
					<h1 className="text-2xl font-bold text-white mb-2 text-center">
						Register
					</h1>
					<p className="text-gray-400 text-sm mb-6 text-center">
						Password will be auto-generated and sent to your email
					</p>
					<UserForm onSuccess={() => navigate("/login")} />
				</div>
			</div>
		</div>
	);
};

export default Register;
