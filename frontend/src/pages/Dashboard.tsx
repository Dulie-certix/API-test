
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, TrendingUp, Package, User, Star, LogOut } from 'lucide-react';
import './dashboard.css';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface Product {
  id?: number;
  _id?: string;
  title?: string;
  category?: string;
  thumbnail?: string;
  price?: number;
  stock?: number;
  rating?: number;
}

interface UserData {
  _id: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  email: string;
}

function CategoryPieChart() {
  const [categories, setCategories] = useState<
    { name: string; count: number; color: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/products', {
          credentials: 'include',
        });
        if (!res.ok) {
          console.error('Products API error:', res.status, await res.text());
          return;
        }
        const data: Product[] = await res.json();
        const map: Record<string, number> = {};
        data.forEach((p) => {
          const c = p.category || 'Unknown';
          map[c] = (map[c] || 0) + 1;
        });
        const colors = [
          '#3B82F6',
          '#EF4444',
          '#10B981',
          '#F59E0B',
          '#8B5CF6',
          '#EC4899',
        ];
        const arr = Object.entries(map).map(([name, count], i) => ({
          name,
          count,
          color: colors[i % colors.length],
        }));
        setCategories(arr);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const total = categories.reduce((s, c) => s + c.count, 0);

  return (
    <Card className="border-gray-800 bg-gray-900">
      <CardHeader>
        <CardTitle className="text-white">Product Categories</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-gray-400">Loading...</div>
        ) : (
          <div className="flex items-center gap-6">
            <div className="space-y-2">
              {categories.map((c) => (
                <div key={c.name} className="flex items-center gap-2">
                  <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
                    <circle cx="6" cy="6" r="6" fill={c.color} />
                  </svg>
                  <div className="text-sm text-white">
                    {c.name} <span className="text-gray-400">({c.count})</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="h-48 flex-1">
              <svg viewBox="0 0 100 100" className="h-full w-full">
                {/* simple ring representation */}
                {(() => {
                  let offset = 0;
                  const circumference = 2 * Math.PI * 30;
                  return categories.map((cat) => {
                    const perc = total ? cat.count / total : 0;
                    const dash = `${perc * circumference} ${circumference}`;
                    const el = (
                      <circle
                        key={cat.name}
                        cx="50"
                        cy="50"
                        r="30"
                        fill="transparent"
                        stroke={cat.color}
                        strokeWidth="10"
                        strokeDasharray={dash}
                        strokeDashoffset={-offset}
                      />
                    );
                    offset += perc * circumference;
                    return el;
                  });
                })()}
              </svg>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function SalesChart() {
  const [data, setData] = useState<{ range: string; count: number }[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/users', {
          credentials: 'include',
        });
        if (!res.ok) {
          console.error('Users API error:', res.status, await res.text());
          return;
        }
        const users: UserData[] = await res.json();

        // bucket ages into ranges: 0-9,10-19,... up to 90+
        const buckets: Record<string, number> = {};
        const ranges: string[] = [];
        for (let start = 0; start <= 90; start += 10) {
          const label = start === 90 ? '90+' : `${start}-${start + 9}`;
          ranges.push(label);
          buckets[label] = 0;
        }

        users.forEach((u) => {
          const age = Math.max(0, Math.floor(u.age || 0));
          const idx = age >= 90 ? 9 : Math.floor(age / 10);
          const label = ranges[idx];
          buckets[label] = (buckets[label] || 0) + 1;
        });

        const chartData = ranges.map((r) => ({
          range: r,
          count: buckets[r] || 0,
        }));
        setData(chartData);
      } catch (e) {
        console.error(e);
      }
    };
    fetchUsers();
  }, []);

  return (
    <Card className="border-gray-800 bg-gray-900">
      <CardHeader>
        <CardTitle className="text-white">Age Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="chart-container">
          <ResponsiveContainer>
            <LineChart
              data={data}
              margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
              <XAxis dataKey="range" tick={{ fill: '#cbd5e1' }} />
              <YAxis tick={{ fill: '#cbd5e1' }} allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#34d399"
                strokeWidth={3}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function ProductDetailsCard({ searchQuery }: { searchQuery: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products', {
          credentials: 'include',
        });
        if (!response.ok) {
          console.error('Products API error:', response.status, await response.text());
          return;
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products
    .filter(product => 
      !searchQuery || 
      product.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice(0, 5);

  return (
    <Card className="border-gray-800 bg-gray-900">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Package className="h-5 w-5" />
          Recent Product Details
          {searchQuery && <span className="text-sm text-gray-400">({filteredProducts.length} found)</span>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-gray-400">Loading products...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-gray-400">
            {searchQuery ? `No products found for "${searchQuery}"` : 'No products available'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="p-2 text-left text-gray-400">Image</th>
                  <th className="p-2 text-left text-gray-400">Product</th>
                  <th className="p-2 text-left text-gray-400">Category</th>
                  <th className="p-2 text-left text-gray-400">Price</th>
                  <th className="p-2 text-left text-gray-400">Stock</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product._id || product.id || Math.random()} className="border-b border-gray-800">
                    <td className="p-2">
                      <img
                        src={product.thumbnail || "https://via.placeholder.com/40?text=No+Image"}
                        alt={product.title}
                        className="h-10 w-10 rounded object-cover"
                      />
                    </td>
                    <td className="p-2 text-white">{product.title}</td>
                    <td className="p-2 text-gray-400">{product.category}</td>
                    <td className="p-2 font-bold text-green-400">
                      ${product.price}
                    </td>
                    <td className="p-2 text-gray-400">{product.stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function UserDetailsCard({ searchQuery }: { searchQuery: string }) {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users', {
          credentials: 'include',
        });
        if (!response.ok) {
          console.error('Users API error:', response.status);
          setUsers([]);
          return;
        }
        const data = await response.json();
        setUsers(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching users:', error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users
    .filter(user => 
      !searchQuery || 
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.gender.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice(0, 5);

  return (
    <Card className="border-gray-800 bg-gray-900">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <User className="h-5 w-5" />
          Recent User Details
          {searchQuery && <span className="text-sm text-gray-400">({filteredUsers.length} found)</span>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-gray-400">Loading users...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-gray-400">
            {searchQuery ? `No users found for "${searchQuery}"` : 'No users available'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="p-2 text-left text-gray-400">Avatar</th>
                  <th className="p-2 text-left text-gray-400">Name</th>
                  <th className="p-2 text-left text-gray-400">Email</th>
                  <th className="p-2 text-left text-gray-400">Age</th>
                  <th className="p-2 text-left text-gray-400">Gender</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="border-b border-gray-800">
                    <td className="p-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500">
                        <span className="text-xs font-bold text-white">
                          {user.firstName[0]}
                          {user.lastName[0]}
                        </span>
                      </div>
                    </td>
                    <td className="p-2 text-white">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="p-2 text-gray-400">{user.email}</td>
                    <td className="p-2 text-blue-400">{user.age}</td>
                    <td className="p-2 text-gray-400">{user.gender}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ProductsKPICard() {
  const [productCount, setProductCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductCount = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products', {
          credentials: 'include',
        });
        if (!response.ok) {
          console.error('Products API error:', response.status);
          setProductCount(0);
          return;
        }
        const data = await response.json();
        setProductCount(data?.length || 0);
      } catch (error) {
        console.error('Error fetching product count:', error);
        setProductCount(0);
      } finally {
        setLoading(false);
      }
    };
    fetchProductCount();
  }, []);

  return (
    <Card className="border-gray-800 bg-gray-900">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-400">
          Products
        </CardTitle>
        <Package className="h-4 w-4 text-blue-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white">
          {loading ? '...' : (productCount || 0).toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
}

function TotalRatingsKPICard() {
  const [totalRatings, setTotalRatings] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTotalRatings = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products', {
          credentials: 'include',
        });
        if (!response.ok) {
          console.error('Products API error:', response.status);
          setTotalRatings(0);
          return;
        }
        const data = await response.json();
        const ratingsCount = data.reduce((total: number, product: any) => {
          return total + (product.rating ? 1 : 0);
        }, 0);
        setTotalRatings(ratingsCount || 0);
      } catch (error) {
        console.error('Error fetching total ratings:', error);
        setTotalRatings(0);
      } finally {
        setLoading(false);
      }
    };
    fetchTotalRatings();
  }, []);

  return (
    <Card className="border-gray-800 bg-gray-900">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-400">
          Total Ratings
        </CardTitle>
        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white">
          {loading ? '...' : (totalRatings || 0).toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
}

function CustomersKPICard() {
  const [customerCount, setCustomerCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomerCount = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users', {
          credentials: 'include',
        });
        if (!response.ok) {
          console.error('Users API error:', response.status);
          setCustomerCount(0);
          return;
        }
        const data = await response.json();
        setCustomerCount(data?.length || 0);
      } catch (error) {
        console.error('Error fetching customer count:', error);
        setCustomerCount(0);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomerCount();
  }, []);

  return (
    <Card className="border-gray-800 bg-gray-900">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-400">
          Customers
        </CardTitle>
        <Users className="h-4 w-4 text-blue-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white">
          {loading ? '...' : (customerCount || 0).toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
}

function CategoriesKPICard() {
  const [categoryCount, setCategoryCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryCount = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products', {
          credentials: 'include',
        });
        if (!response.ok) {
          console.error('Products API error:', response.status);
          setCategoryCount(0);
          return;
        }
        const data = await response.json();
        const uniqueCategories = [
          ...new Set(data.map((product: any) => product.category)),
        ];
        setCategoryCount(uniqueCategories.length || 0);
      } catch (error) {
        console.error('Error fetching category count:', error);
        setCategoryCount(0);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryCount();
  }, []);

  return (
    <Card className="border-gray-800 bg-gray-900">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-400">
          Categories
        </CardTitle>
        <TrendingUp className="h-4 w-4 text-green-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white">
          {loading ? '...' : (categoryCount || 0).toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard({ searchQuery = '' }: { searchQuery?: string }) {
  return (
    <div className="min-h-screen bg-black p-6 text-white">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Badge variant="outline" className="border-blue-400 text-blue-400">
            Live Data
          </Badge>
        </div>

        {searchQuery && (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <p className="text-gray-300">
              Showing results for: <span className="text-white font-semibold">"{searchQuery}"</span>
            </p>
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <CustomersKPICard />
          <ProductsKPICard />
          <CategoriesKPICard />
          <TotalRatingsKPICard />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <SalesChart />
          <CategoryPieChart />
        </div>

        {/* Details Cards Row */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ProductDetailsCard searchQuery={searchQuery} />
          <UserDetailsCard searchQuery={searchQuery} />
        </div>
      </div>
    </div>
  );
}