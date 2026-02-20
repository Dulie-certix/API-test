// page.tsx - (client component) is where we'll fetch data and render our table.

"use client";

import { useState, useEffect } from "react";
import { createProductColumns } from "../pages/Products/productTable";
import { type Product } from "../services/productService";
import { DataTable } from "../components/customUi/data-table";
import { ProductDetailsDialog } from "../pages/Products/productViewCard";
import { ProductForm } from "../pages/Products/productForm";
import { ProductUpdateForm } from "../pages/Products/productUpdateForm";
import { productService } from "../services/productService";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Plus } from "lucide-react";

export default function DemoPage() {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [productToUpdate, setProductToUpdate] = useState<Product | null>(null);

  const getData = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const result = await productService.getAllProducts();
      setData(result);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setDialogOpen(true);
  };

  const handleEdit = (product: Product) => {
    setProductToUpdate(product);
    setUpdateDialogOpen(true);
  };

  const handleDelete = async (product: Product) => {
    try {
      await productService.deleteProduct(product._id!);
      await getData();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const productColumns = createProductColumns(
    handleViewDetails,
    handleEdit,
    handleDelete,
  );

  useEffect(() => {
    getData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center text-lg">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center text-red-500">
          <h2 className="mb-2 text-xl font-bold">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products Table ({data.length})</h1>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <ProductForm
              onSuccess={() => {
                setAddDialogOpen(false);
                getData();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
      <DataTable columns={productColumns} data={data} />

      <ProductDetailsDialog
        product={selectedProduct}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />

      <Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update Product</DialogTitle>
          </DialogHeader>
          {productToUpdate && (
            <ProductUpdateForm
              product={productToUpdate}
              onSuccess={() => {
                setUpdateDialogOpen(false);
                getData();
              }}
              onCancel={() => setUpdateDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
