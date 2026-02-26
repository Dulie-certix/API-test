import { createBrowserRouter, RouterProvider, Navigate } from "react-router";
import Login from "../src/pages/Login/login"
import Register from "../src/pages/Login/Register.tsx"
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Navigate to="/login" replace />,
	},
	{
		path: "/login",
		element: <Login />,
	},
	{
		path: "/register",
		element: <Register />,
	},
	{
		path: "/dashboard",
		element: (
			<ProtectedRoute>
				<DashboardPage />
			</ProtectedRoute>
		),
	},
	{
		path: "*",
		element: <Navigate to="/login" replace />,
	},
]);

function App() {
	return <RouterProvider router={router} />;
}

export default App;
