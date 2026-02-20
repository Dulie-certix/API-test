import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";

interface UploadResponse {
  imageUrl: string;
  message: string;
}

export default function ImageUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setError("");
      setUploadedUrl("");
    }
  };

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("Please select an image first");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const { data } = await axios.post<UploadResponse>(
        "http://localhost:5000/api/upload/image",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setUploadedUrl(data.imageUrl);
      setError("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Upload Image</h2>

      <form onSubmit={handleUpload} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Select Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="w-full border rounded p-2"
          />
        </div>

        {preview && (
          <div>
            <p className="text-sm font-medium mb-2">Preview:</p>
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-cover rounded"
            />
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !selectedFile}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 mr-2"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Uploading...
            </>
          ) : (
            "Upload Image"
          )}
        </button>
      </form>

      {uploadedUrl && (
        <div className="mt-6">
          <p className="text-sm font-medium mb-2 text-green-600">
            Upload Successful!
          </p>
          <img
            src={uploadedUrl}
            alt="Uploaded"
            className="w-full h-48 object-cover rounded"
          />
          <p className="text-xs text-gray-600 mt-2 break-all">{uploadedUrl}</p>
        </div>
      )}
    </div>
  );
}
