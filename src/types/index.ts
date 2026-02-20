// User Types
export interface User {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserData {
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  phone?: string;
}

export interface UpdateUserData extends Partial<CreateUserData> {
  _id: string;
}

// Product Types
export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

// Dashboard Types
export interface KPIData {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
}

export interface DashboardStats {
  totalRevenue: KPIData;
  totalOrders: KPIData;
  newCustomers: KPIData;
  conversionRate: KPIData;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Form Types
export interface FormState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

// Table Types
export interface TableColumn<T> {
  id: keyof T;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
}

export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  error?: string | null;
  onRowClick?: (row: T) => void;
  filterColumn?: keyof T;
  filterPlaceholder?: string;
}
