import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import MyProducts from "./pages/MyProducts";
import MyOrders from "./pages/MyOrders";
import Profile from "./pages/Profile";
import Delivery from "./pages/Delivery";
import Cart from "./pages/Cart";
import Login from "./components/Login";
import Register from "./components/Register";
import PrivateRoute from "./utils/PrivateRoute";
import ItemPage from "./pages/Items";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/products" element={<Products />} />
            <Route path="/my-products" element={<MyProducts />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/delivery" element={<Delivery />} />
            <Route path="/item/:id" element={<ItemPage />} />
            <Route path="/cart" element={<Cart />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}
