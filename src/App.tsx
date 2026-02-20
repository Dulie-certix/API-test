import { createBrowserRouter, RouterProvider, Navigate } from "react-router";
import Login from "./pages/Login/Login";
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
