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
import { Loader2, Upload, X } from "lucide-react";
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
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [successMessage, setSuccessMessage] = useState<string>("");
	const [submitError, setSubmitError] = useState<string>("");
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string>("");
	const [user, setUser] = useState<UserFormData>({
		firstName: "",
		lastName: "",
		age: 0,
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
				age: editUser.age || 0,
				gender: (editUser.gender as "male" | "female") || "male",
				email: editUser.email || "",
				phone: editUser.phone || "",
				username: editUser.username || "",
				password: "",
			});
			if (editUser.image) {
				setImagePreview(editUser.image);
			}
		} else {
			setUser({
				firstName: "",
				lastName: "",
				age: 0,
				gender: "male",
				email: "",
				phone: "",
				username: "",
				password: "",
			});
			setImagePreview("");
			setImageFile(null);
		}
		setErrors({});
		setSuccessMessage("");
	}, [isEditing, editUser]);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			if (!file.type.startsWith("image/")) {
				setErrors((prev) => ({
					...prev,
					image: "Only image files are allowed",
				}));
				return;
			}
			if (file.size > 5 * 1024 * 1024) {
				setErrors((prev) => ({
					...prev,
					image: "Image size must be less than 5MB",
				}));
				return;
			}
			setImageFile(file);
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result as string);
			};
			reader.readAsDataURL(file);
			setErrors((prev) => {
				const newErrors = { ...prev };
				delete newErrors.image;
				return newErrors;
			});
		}
	};

	const removeImage = () => {
		setImageFile(null);
		setImagePreview("");
	};

	const validateField = (fieldName: keyof UserFormData, value: any) => {
		try {
			if (fieldName === "password") {
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
			const { password, ...userWithoutPassword } = user;
			const editSchema = userSchema.omit({ password: true });
			editSchema.parse(userWithoutPassword);
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
		setErrors({});

		try {
			const formData = new FormData();
			formData.append("firstName", user.firstName?.trim());
			formData.append("lastName", user.lastName?.trim());
			formData.append("age", String(user.age || 18));
			formData.append("gender", user.gender);
			formData.append("email", user.email?.trim());
			formData.append("phone", user.phone?.trim());
			formData.append("username", user.username?.trim());
			if (imageFile) {
				console.log('📸 Image file:', imageFile.name, imageFile.size, 'bytes');
				formData.append("image", imageFile);
			} else {
				console.log('⚠️ No image file');
			}

			console.log("🔄 Sending user data...");

			if (isEditing && editUser) {
				console.log(`📝 Updating user ${editUser._id}...`);
				const result = await updateUser(editUser._id, formData);
				console.log("✅ User updated", result);
			} else {
				console.log("➕ Creating new user...");
				const result = await saveUser(formData);
				console.log("✅ User created", result);
			}

			if (!isEditing) {
				setUser({
					firstName: "",
					lastName: "",
					age: 0,
					gender: "male",
					email: "",
					phone: "",
					username: "",
					password: "",
				});
				setImageFile(null);
				setImagePreview("");
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
				<label className="block text-sm font-medium text-gray-300 mb-2">
					Profile Image
				</label>
				<div className="flex items-center gap-4">
					{imagePreview && (
						<div className="relative">
							<img
								src={imagePreview}
								alt="Preview"
								className="w-20 h-20 rounded-full object-cover border-2 border-gray-700"
							/>
							<button
								type="button"
								onClick={removeImage}
								aria-label="Remove image"
								className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 hover:bg-red-600">
								<X size={14} />
							</button>
						</div>
					)}
					<label className="cursor-pointer">
						<div className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-md hover:bg-gray-700 transition-colors">
							<Upload size={16} className="text-gray-400" />
							<span className="text-sm text-gray-300">
								{imagePreview ? "Change Image" : "Upload Image"}
							</span>
						</div>
						<input
							type="file"
							accept="image/*"
							onChange={handleImageChange}
							className="hidden"
						/>
					</label>
				</div>
				{errors.image && (
					<p className="text-red-400 text-sm mt-1">{errors.image}</p>
				)}
			</div>

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
						handleFieldChange("age", Number(e.target.value))
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
