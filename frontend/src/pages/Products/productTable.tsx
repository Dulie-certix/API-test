// columns.tsx - (client component) will contain our column definitions.

"use client";

import { useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export type Product = {
	_id?: string;
	id?: number;
	name: string;
	title?: string;
	description: string;
	category: string;
	price: number;
	discountPercentage?: number;
	rating?: number;
	stock: number;
	brand: string;
	thumbnail?: string;
	createdAt?: string;
	updatedAt?: string;
};

export const createProductColumns = (
	onViewDetails: (product: Product) => void,
	onEdit?: (product: Product) => void,
	onDelete?: (product: Product) => void,
	isAdmin?: boolean
): ColumnDef<Product>[] => [
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && "indeterminate")
				}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
			/>
		),
	},
	{
		accessorKey: "thumbnail",
		header: "Image",
		cell: ({ row }) => {
			const thumbnail = row.getValue("thumbnail") as string;
			return (
				<img
					src={thumbnail || "https://via.placeholder.com/48?text=No+Image"}
					alt="Product"
					className="w-12 h-12 object-cover rounded"
				/>
			);
		},
	},
	{
		accessorKey: "title",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
					Title
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const title = row.getValue("title") as string;
			const name = (row.original as any).name;
			return <div>{title || name}</div>;
		},
	},
	{
		accessorKey: "category",
		header: "Category",
	},
	{
		accessorKey: "brand",
		header: "Brand",
	},
	{
		accessorKey: "price",
		header: () => <div className="text-right">Price</div>,
		cell: ({ row }) => {
			const price = parseFloat(row.getValue("price"));
			const formatted = new Intl.NumberFormat("en-US", {
				style: "currency",
				currency: "USD",
			}).format(price);

			return <div className="text-right font-medium">{formatted}</div>;
		},
	},
	{
		accessorKey: "rating",
		header: () => <div className="text-center">Rating</div>,
		cell: ({ row }) => {
			const rating = parseFloat(row.getValue("rating"));
			return <div className="text-center">{rating.toFixed(1)} ⭐</div>;
		},
	},
	{
		accessorKey: "stock",
		header: () => <div className="text-center">Stock</div>,
		cell: ({ row }) => {
			const stock = row.getValue("stock") as number;
			return (
				<div
					className={`text-center ${stock < 10 ? "text-red-500" : "text-green-500"}`}>
					{stock}
				</div>
			);
		},
	},
	{
		id: "actions",
		header: () => <div className="text-left">Actions</div>,
		cell: ({ row }) => {
			const product = row.original;
			const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
			const [isDeleting, setIsDeleting] = useState(false);

			const handleDelete = async () => {
				if (onDelete) {
					setIsDeleting(true);
					await onDelete(product);
					setIsDeleting(false);
					setDeleteDialogOpen(false);
				}
			};

			return (
				<>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="h-8 w-8 p-0">
								<span className="sr-only">Open menu</span>
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Actions</DropdownMenuLabel>
							<DropdownMenuItem onClick={() => onViewDetails(product)}>
								<Eye className="mr-2 h-4 w-4" />
								View details
							</DropdownMenuItem>
							{isAdmin && onEdit && (
								<DropdownMenuItem onClick={() => onEdit(product)}>
									<Edit className="mr-2 h-4 w-4" />
									Update
								</DropdownMenuItem>
							)}
							{isAdmin && onDelete && (
								<DropdownMenuItem
									onClick={() => setDeleteDialogOpen(true)}
									className="text-red-600">
									<Trash2 className="mr-2 h-4 w-4" />
									Delete
								</DropdownMenuItem>
							)}
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={() =>
									navigator.clipboard.writeText(
										(product._id || product.id)?.toString() || ""
									)
								}>
								Copy product ID
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

					{isAdmin && onDelete && (
						<AlertDialog
							open={deleteDialogOpen}
							onOpenChange={(open) => {
								if (!isDeleting) {
									setDeleteDialogOpen(open);
								}
							}}>
							<AlertDialogContent className="max-w-md mx-auto">
								<AlertDialogHeader className="text-center pb-4">
									<div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
										<Trash2 className="h-6 w-6 text-red-600" />
									</div>
									<AlertDialogTitle className="text-xl font-semibold text-gray-100">
										Delete Product
									</AlertDialogTitle>
									<AlertDialogDescription className="text-sm text-gray-200 mt-2">
										This action cannot be undone. The product will be
										permanently removed from your inventory.
									</AlertDialogDescription>
								</AlertDialogHeader>

								<div className="my-6">
									<div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-4 shadow-sm">
										<div className="flex items-center space-x-4">
											<div className="relative">
												<img
													src={product.thumbnail}
													alt={product.title || product.name || "Product"}
													className="w-16 h-16 object-cover rounded-lg shadow-md border-2 border-white"
												/>
												<div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
													<Trash2 className="h-3 w-3 text-white" />
												</div>
											</div>
											<div className="flex-1 min-w-0">
												<h4 className="font-semibold text-gray-900 truncate">
													{product.title || product.name}
												</h4>
												<div className="flex items-center space-x-2 mt-1">
													<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
														{product.category}
													</span>
													<span className="text-sm font-medium text-green-600">
														${product.price}
													</span>
												</div>
												<p className="text-xs text-gray-500 mt-1">
													Stock: {product.stock} • Brand: {product.brand}
												</p>
											</div>
										</div>
									</div>
								</div>

								<AlertDialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 space-y-2 space-y-reverse sm:space-y-0">
									<AlertDialogCancel className="w-full sm:w-auto border-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-gray-200">
										Cancel
									</AlertDialogCancel>
									<AlertDialogAction
										onClick={handleDelete}
										disabled={isDeleting}
										className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
										{isDeleting ?
											<div className="flex items-center justify-center space-x-2">
												<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
												<span>Deleting...</span>
											</div>
										:	<div className="flex items-center justify-center space-x-2">
												<Trash2 className="h-4 w-4" />
												<span>Delete Product</span>
											</div>
										}
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					)}
				</>
			);
		},
	},
];

export default createProductColumns;
