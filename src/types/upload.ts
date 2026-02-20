export interface UploadResponse {
  imageUrl: string;
  message: string;
}

export interface ProductUploadData {
  name: string;
  price: number;
  description: string;
  category: string;
  brand: string;
  stock: number;
  thumbnail?: string;
}

export interface UploadError {
  message: string;
  code?: string;
}
