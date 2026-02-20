import { useState } from "react";
import ImageUpload from "../components/ImageUpload";
import ProductUploadForm from "../components/ProductUploadForm";

export default function UploadDemo() {
  const [activeTab, setActiveTab] = useState<"simple" | "product">("simple");

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Image Upload System Demo
        </h1>

        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveTab("simple")}
            className={`px-6 py-2 rounded ${
              activeTab === "simple"
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-700"
            }`}
          >
            Simple Upload
          </button>
          <button
            onClick={() => setActiveTab("product")}
            className={`px-6 py-2 rounded ${
              activeTab === "product"
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-700"
            }`}
          >
            Product Form
          </button>
        </div>

        {activeTab === "simple" ? <ImageUpload /> : <ProductUploadForm />}
      </div>
    </div>
  );
}
