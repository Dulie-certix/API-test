import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { productSchema, type ProductFormData } from "@/lib/validations";
import { Product } from "./productTable";
import { productService } from "@/services/productService";
import toast from "react-hot-toast";

interface ProductFormProps {
	onSuccess: () => void;
	editProduct?: Product;
	isEditing?: boolean;
}

export function ProductForm({
	onSuccess,
	editProduct,
	isEditing = false,
}: ProductFormProps) {
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [submitError, setSubmitError] = useState<string>("");
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [preview, setPreview] = useState<string>("");
	const [formData, setFormData] = useState<
		ProductFormData & { thumbnail?: string }
	>({
		name: editProduct?.name || editProduct?.title || "",
		description: editProduct?.description || "",
		category: editProduct?.category || "",
		brand: editProduct?.brand || "",
		price: editProduct?.price || 0,
		stock: editProduct?.stock || 0,
		discountPercentage: (editProduct as any)?.discountPercentage || 0,
		rating: (editProduct as any)?.rating || 0,
		thumbnail: (editProduct as any)?.thumbnail || "",
	});

	React.useEffect(() => {
		if (editProduct?.thumbnail) {
			setPreview(editProduct.thumbnail);
		}
	}, [editProduct]);

	const validateForm = () => {
		try {
			productSchema.parse(formData);
			setErrors({});
			return true;
		} catch (error: any) {
			const fieldErrors: Record<string, string> = {};
			error.errors?.forEach((err: any) => {
				if (err.path) fieldErrors[err.path[0]] = err.message;
			});
			setErrors(fieldErrors);
			return false;
		}
	};

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		if (!file.type.startsWith("image/")) {
			toast.error("Please select an image file");
			return;
		}

		if (file.size > 5 * 1024 * 1024) {
			toast.error("Image too large (max 5MB)");
			return;
		}

		setSelectedFile(file);
		setPreview(URL.createObjectURL(file));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitError("");

		console.log("=== Form Submit ===");
		console.log("Selected file:", selectedFile);
		console.log("Form data:", formData);

		// Basic validation
		if (!formData.name?.trim()) {
			setSubmitError("Product name is required");
			return;
		}
		if (!formData.description?.trim()) {
			setSubmitError("Description is required");
			return;
		}
		if (formData.price <= 0) {
			setSubmitError("Price must be greater than 0");
			return;
		}

		setLoading(true);
		try {
			const data = new FormData();
			data.append("name", formData.name.trim());
			data.append("price", String(formData.price));
			data.append("description", formData.description.trim());
			data.append("category", formData.category.trim());
			data.append("brand", formData.brand.trim());
			data.append("stock", String(formData.stock));
			data.append("discountPercentage", String(formData.discountPercentage || 0));
			data.append("rating", String(formData.rating || 0));
			
			if (selectedFile) {
				console.log("Adding file to FormData:", selectedFile.name, selectedFile.size);
				data.append("thumbnail", selectedFile);
			} else {
				console.log("No file selected");
			}

			console.log("Sending request...");

			if (isEditing && editProduct) {
				await productService.updateProduct(
					editProduct._id || (editProduct as any).id?.toString() || "",
					data
				);
			} else {
				await productService.createProduct(data);
			}

			console.log("Request successful!");
			toast.success(isEditing ? "Product updated!" : "Product added!");
			onSuccess();
			
			if (!isEditing) {
				setFormData({
					name: "",
					description: "",
					category: "",
					brand: "",
					price: 0,
					stock: 0,
					discountPercentage: 0,
					rating: 0,
					thumbnail: "",
				});
				setSelectedFile(null);
				setPreview("");
			}
		} catch (error: any) {
			const errorMsg =
				error?.response?.data?.error ||
				error?.response?.data?.message ||
				error?.message ||
				"Failed to save product";
			setSubmitError(errorMsg);
			console.error("Submit error:", error);
			console.error("Error response:", error?.response?.data);
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

			<div>
				<input
					placeholder="Product Name"
					value={formData.name}
					onChange={(e) =>
						setFormData((prev) => ({ ...prev, name: e.target.value }))
					}
					className="w-full p-2 border border-gray-700 bg-gray-800 text-white rounded placeholder:text-gray-500"
				/>
				{errors.name && (
					<p className="text-red-400 text-sm mt-1">{errors.name}</p>
				)}
			</div>

			<textarea
				placeholder="Description"
				value={formData.description}
				onChange={(e) =>
					setFormData((prev) => ({ ...prev, description: e.target.value }))
				}
				className="w-full p-2 border border-gray-700 bg-gray-800 text-white rounded placeholder:text-gray-500"
				rows={3}
				required
			/>

			<div className="grid grid-cols-2 gap-4">
				<input
					placeholder="Category"
					value={formData.category}
					onChange={(e) =>
						setFormData((prev) => ({ ...prev, category: e.target.value }))
					}
					className="p-2 border border-gray-700 bg-gray-800 text-white rounded placeholder:text-gray-500"
					required
				/>
				<input
					placeholder="Brand"
					value={formData.brand}
					onChange={(e) =>
						setFormData((prev) => ({ ...prev, brand: e.target.value }))
					}
					className="p-2 border border-gray-700 bg-gray-800 text-white rounded placeholder:text-gray-500"
					required
				/>
			</div>

			<div className="grid grid-cols-2 gap-4">
				<input
					type="number"
					placeholder="Price"
					value={formData.price}
					onChange={(e) =>
						setFormData((prev) => ({ ...prev, price: Number(e.target.value) }))
					}
					className="p-2 border border-gray-700 bg-gray-800 text-white rounded placeholder:text-gray-500"
					required
				/>
				<input
					type="number"
					placeholder="Stock"
					value={formData.stock}
					onChange={(e) =>
						setFormData((prev) => ({ ...prev, stock: Number(e.target.value) }))
					}
					className="p-2 border border-gray-700 bg-gray-800 text-white rounded placeholder:text-gray-500"
					required
				/>
			</div>

			<div className="grid grid-cols-2 gap-4">
				<input
					type="number"
					placeholder="Discount %"
					value={(formData as any).discountPercentage ?? 0}
					onChange={(e) =>
						setFormData((prev) => ({
							...prev,
							discountPercentage: Number(e.target.value),
						}))
					}
					className="p-2 border border-gray-700 bg-gray-800 text-white rounded placeholder:text-gray-500"
				/>
				<input
					type="number"
					step="0.1"
					placeholder="Rating"
					value={(formData as any).rating ?? 0}
					onChange={(e) =>
						setFormData((prev) => ({ ...prev, rating: Number(e.target.value) }))
					}
					className="p-2 border border-gray-700 bg-gray-800 text-white rounded placeholder:text-gray-500"
				/>
			</div>

			<div>
				<label
					htmlFor="product-image"
					className="block text-sm font-medium mb-2 text-gray-300">
					Product Image
				</label>
				<input
					id="product-image"
					type="file"
					accept="image/*"
					onChange={handleImageUpload}
					className="w-full p-2 border border-gray-700 bg-gray-800 text-white rounded file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600"
				/>
				<p className="text-gray-500 text-xs mt-1">
					Max 5MB. Image will be uploaded to Cloudinary.
				</p>
				{preview && (
					<img
						src={preview}
						alt="Preview"
						className="mt-2 w-32 h-32 object-cover rounded border border-gray-700"
					/>
				)}
			</div>

			<Button
				type="submit"
				disabled={loading}
				className="w-full bg-orange-500 hover:bg-orange-600">
				{loading ?
					isEditing ?
						"Updating..."
					:	"Adding..."
				: isEditing ?
					"Update Product"
				:	"Add Product"}
			</Button>
		</form>
	);
}
