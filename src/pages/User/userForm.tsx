import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { saveUser, updateUser } from "@/apis/userService";
import { userSchema, type UserFormData } from "@/lib/validations";
import type { User } from "./userTable";
import toast from "react-hot-toast";

interface UserFormProps {
	onSuccess?: () => void;
	editUser?: User | null;
	isEditing?: boolean;
}

export function UserForm({
	onSuccess,
	editUser,
	isEditing = false,
}: UserFormProps) {
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [successMessage, setSuccessMessage] = useState<string>("");
	const [submitError, setSubmitError] = useState<string>("");
	const [user, setUser] = useState<UserFormData>({
		firstName: "",
		lastName: "",
		age: 18,
		gender: "male",
		email: "",
		phone: "",
		username: "",
		password: "",
	});

	// Load user data when editing
	useEffect(() => {
		if (isEditing && editUser) {
			setUser({
				firstName: editUser.firstName || "",
				lastName: editUser.lastName || "",
				age: editUser.age || 18,
				gender: (editUser.gender as "male" | "female") || "male",
				email: editUser.email || "",
				phone: editUser.phone || "",
				username: editUser.username || "",
				password: "", // Always start with empty password for security
			});
		} else {
			// Reset form for new user
			setUser({
				firstName: "",
				lastName: "",
				age: 18,
				gender: "male",
				email: "",
				phone: "",
				username: "",
				password: "",
			});
		}
		setErrors({}); // Clear any previous errors
		setSuccessMessage(""); // Clear any previous success messages
	}, [isEditing, editUser]);

	const validateField = (fieldName: keyof UserFormData, value: any) => {
		try {
			if (fieldName === "password" && isEditing && !value) {
				// Skip password validation for editing if empty
				return true;
			}

			const fieldSchema = userSchema.shape[fieldName];
			fieldSchema.parse(value);

			// Clear error for this field if validation passes
			setErrors((prev) => {
				const newErrors = { ...prev };
				delete newErrors[fieldName];
				return newErrors;
			});
			return true;
		} catch (error: any) {
			const errorMessage = error.errors?.[0]?.message || `Invalid ${fieldName}`;
			setErrors((prev) => ({ ...prev, [fieldName]: errorMessage }));
			return false;
		}
	};

	const handleFieldChange = (fieldName: keyof UserFormData, value: any) => {
		setUser((prev) => ({ ...prev, [fieldName]: value }));
		// Validate field on change for better UX
		setTimeout(() => validateField(fieldName, value), 300); // Debounce validation
	};

	const validateForm = () => {
		try {
			// For editing, make password optional if it's empty
			if (isEditing && !user.password) {
				const { password, ...userWithoutPassword } = user;
				const editSchema = userSchema.omit({ password: true });
				editSchema.parse(userWithoutPassword);
			} else {
				userSchema.parse(user);
			}
			setErrors({});
			return true;
		} catch (error: any) {
			const fieldErrors: Record<string, string> = {};
			error.errors?.forEach((err: any) => {
				if (err.path) {
					fieldErrors[err.path[0]] = err.message;
				}
			});
			setErrors(fieldErrors);
			return false;
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitError("");

		if (!validateForm()) {
			setSubmitError("Please fix the errors above.");
			return;
		}

		setLoading(true);
		setErrors({}); // Clear any previous errors

		try {
			const userData: any = {
				firstName: user.firstName?.trim(),
				lastName: user.lastName?.trim(),
				age: Number(user.age) || 18,
				gender: user.gender,
				email: user.email?.trim(),
				phone: user.phone?.trim(),
				username: user.username?.trim(),
				password: user.password,
			};

			console.log("🔄 Sending user data:", userData);

			if (isEditing && editUser) {
				if (!user.password) delete userData.password;
				console.log(`📝 Updating user ${editUser._id}...`);
				const result = await updateUser(editUser._id, userData);
				console.log("✅ User updated", result);
			} else {
				console.log("➕ Creating new user...");
				const result = await saveUser(userData);
				console.log("✅ User created", result);
			}

			// Reset form for new users only
			if (!isEditing) {
				setUser({
					firstName: "",
					lastName: "",
					age: 18,
					gender: "male",
					email: "",
					phone: "",
					username: "",
					password: "",
				});
			}

			setSuccessMessage(
				`User ${isEditing ? "updated" : "created"} successfully!`
			);
			toast.success(`User ${isEditing ? "updated" : "created"} successfully!`);
			onSuccess?.();
		} catch (error: any) {
			console.error(
				`❌ Error ${isEditing ? "updating" : "adding"} user:`,
				error
			);
			const errorMsg =
				error?.response?.data?.message ||
				error?.message ||
				`Failed to ${isEditing ? "update" : "save"} user`;
			setSubmitError(errorMsg);
			toast.error(errorMsg);
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			{submitError && (
				<div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-2 rounded-md text-sm">
					⚠️ {submitError}
				</div>
			)}

			{successMessage && (
				<div className="bg-green-900/20 border border-green-500 text-green-400 px-4 py-2 rounded-md">
					{successMessage}
				</div>
			)}

			<div>
				<Input
					placeholder="First Name"
					value={user.firstName}
					onChange={(e) => handleFieldChange("firstName", e.target.value)}
					className={`bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 ${
						errors.firstName ? "border-red-500" : ""
					}`}
				/>
				{errors.firstName && (
					<p className="text-red-400 text-sm mt-1">{errors.firstName}</p>
				)}
			</div>

			<div>
				<Input
					placeholder="Last Name"
					value={user.lastName}
					onChange={(e) => handleFieldChange("lastName", e.target.value)}
					className={`bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 ${
						errors.lastName ? "border-red-500" : ""
					}`}
				/>
				{errors.lastName && (
					<p className="text-red-400 text-sm mt-1">{errors.lastName}</p>
				)}
			</div>

			<div>
				<Input
					type="number"
					placeholder="Age"
					value={user.age}
					onChange={(e) =>
						handleFieldChange("age", Number(e.target.value) || 18)
					}
					className={`bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 ${
						errors.age ? "border-red-500" : ""
					}`}
				/>
				{errors.age && (
					<p className="text-red-400 text-sm mt-1">{errors.age}</p>
				)}
			</div>

			<div>
				<Select
					value={user.gender}
					onValueChange={(value) =>
						handleFieldChange("gender", value as "male" | "female")
					}>
					<SelectTrigger
						className={`bg-gray-800 border-gray-700 text-white ${
							errors.gender ? "border-red-500" : ""
						}`}>
						<SelectValue placeholder="Select gender" />
					</SelectTrigger>
					<SelectContent className="bg-gray-800 border-gray-700">
						<SelectItem value="male" className="text-white hover:bg-gray-700">
							Male
						</SelectItem>
						<SelectItem value="female" className="text-white hover:bg-gray-700">
							Female
						</SelectItem>
					</SelectContent>
				</Select>
				{errors.gender && (
					<p className="text-red-400 text-sm mt-1">{errors.gender}</p>
				)}
			</div>

			<div>
				<Input
					type="email"
					placeholder="Email"
					value={user.email}
					onChange={(e) => handleFieldChange("email", e.target.value)}
					className={`bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 ${
						errors.email ? "border-red-500" : ""
					}`}
				/>
				{errors.email && (
					<p className="text-red-400 text-sm mt-1">{errors.email}</p>
				)}
			</div>

			<div>
				<Input
					placeholder="Phone"
					value={user.phone}
					onChange={(e) => handleFieldChange("phone", e.target.value)}
					className={`bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 ${
						errors.phone ? "border-red-500" : ""
					}`}
				/>
				{errors.phone && (
					<p className="text-red-400 text-sm mt-1">{errors.phone}</p>
				)}
			</div>

			<div>
				<Input
					placeholder="Username"
					value={user.username}
					onChange={(e) => handleFieldChange("username", e.target.value)}
					className={`bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 ${
						errors.username ? "border-red-500" : ""
					}`}
				/>
				{errors.username && (
					<p className="text-red-400 text-sm mt-1">{errors.username}</p>
				)}
			</div>

			<div>
				<div className="relative">
					<Input
						type={showPassword ? "text" : "password"}
						placeholder={
							isEditing ? "Password (leave empty to keep current)" : "Password"
						}
						value={user.password}
						onChange={(e) => handleFieldChange("password", e.target.value)}
						className={`bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 pr-10 ${
							errors.password ? "border-red-500" : ""
						}`}
					/>
					<button
						type="button"
						onClick={() => setShowPassword(!showPassword)}
						className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-300">
						{showPassword ?
							<EyeOff size={16} />
						:	<Eye size={16} />}
					</button>
				</div>
				{errors.password && (
					<p className="text-red-400 text-sm mt-1">{errors.password}</p>
				)}
			</div>

			<Button
				type="submit"
				className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50"
				disabled={loading}>
				{loading ?
					<>
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						{isEditing ? "Updating..." : "Saving..."}
					</>
				: isEditing ?
					"Update User"
				:	"Add User"}
			</Button>
		</form>
	);
}
