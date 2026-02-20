import { useState, useEffect } from "react";
import { DataTable } from "@/components/customUi/data-table";
import { createProductColumns, type Product } from "./productTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ProductForm } from "./productForm";
import { ProductViewCard } from "./productViewCard";
import { productService } from "@/services/productService";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user?.role === "admin";

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setViewDialogOpen(true);
  };

  const handleEdit = (product: Product) => {
    if (!isAdmin) {
      alert("Access Denied: Only admins can edit products");
      return;
    }
    setEditProduct(product);
    setEditDialogOpen(true);
  };

  const handleDelete = async (product: Product) => {
    if (!isAdmin) {
      alert("Access Denied: Only admins can delete products");
      return;
    }
    try {
      await productService.deleteProduct(product._id || product.id?.toString() || "");
      await fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product. You may not have permission.");
    }
  };

  const handleSuccess = () => {
    setDialogOpen(false);
    setEditDialogOpen(false);
    fetchProducts();
  };

  const columns = createProductColumns(handleViewDetails, handleEdit, handleDelete, isAdmin);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Products</h1>
          <p className="text-gray-400">
            {isAdmin ? "Manage your product inventory" : "View product inventory (Read-only)"}
          </p>
        </div>
        {isAdmin && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-orange-500 hover:bg-orange-600">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-800 max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-white">Add New Product</DialogTitle>
              </DialogHeader>
              <ProductForm onSuccess={handleSuccess} />
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      <div className="bg-gray-900 border border-gray-800 rounded-lg">
        <DataTable columns={columns} data={products} />
      </div>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">Product Details</DialogTitle>
          </DialogHeader>
          {selectedProduct && <ProductViewCard product={selectedProduct} />}
        </DialogContent>
      </Dialog>

      {isAdmin && (
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="bg-gray-900 border-gray-800 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">Edit Product</DialogTitle>
            </DialogHeader>
            {editProduct && (
              <ProductForm 
                onSuccess={handleSuccess} 
                editProduct={editProduct} 
                isEditing={true} 
              />
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}