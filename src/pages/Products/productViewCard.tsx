import { Product } from "./productTable";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface ProductViewCardProps {
  product: Product;
}

export function ProductViewCard({ product }: ProductViewCardProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-start space-x-4">
        <img
          src={product.thumbnail}
          alt={product.title || product.name}
          className="w-24 h-24 object-cover rounded-lg border border-gray-700"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-white text-lg">
            {product.title || product.name}
          </h3>
          <p className="text-sm text-gray-400 mt-1">
            {product.description}
          </p>
          <div className="flex items-center space-x-2 mt-2">
            <Badge variant="outline" className="border-orange-500 text-orange-400">
              {product.category}
            </Badge>
            <Badge variant="outline" className="border-blue-500 text-blue-400">
              {product.brand}
            </Badge>
          </div>
        </div>
      </div>

      <Separator className="bg-gray-700" />

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="font-medium text-gray-300">Price</p>
          <p className="text-green-400 font-semibold text-lg">
            ${product.price?.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="font-medium text-gray-300">Stock</p>
          <p className={`font-semibold ${
            (product.stock || 0) < 10 ? 'text-red-400' : 'text-green-400'
          }`}>
            {product.stock} units
          </p>
        </div>
        <div>
          <p className="font-medium text-gray-300">Rating</p>
          <p className="text-yellow-400">
            {product.rating ? `${product.rating.toFixed(1)} ⭐` : 'No rating'}
          </p>
        </div>
        <div>
          <p className="font-medium text-gray-300">Discount</p>
          <p className="text-gray-400">
            {product.discountPercentage ? `${product.discountPercentage}%` : 'No discount'}
          </p>
        </div>
      </div>
    </div>
  );
}