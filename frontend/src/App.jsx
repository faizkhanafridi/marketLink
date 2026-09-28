import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { FlyToCartProvider } from "./context/FlyToCartContext";
import ProtectedRoute from "./components/common/ProtectedRoute";
import FlyToCartLayer from "./components/common/FlyToCartLayer";

// Public Pages
import HomePage from "./pages/public/HomePage";
import AboutPage from "./pages/public/AboutPage";
import ContactPage from "./pages/public/ContactPage";
import MarketsPage from "./pages/public/MarketsPage";
import MarketDetailPage from "./pages/public/MarketDetailPage";
import FarmersPage from "./pages/public/FarmersPage";
import FarmerDetailPage from "./pages/public/FarmerDetailPage";
import ProductsPage from "./pages/public/ProductsPage";
import ProductDetailPage from "./pages/public/ProductDetailPage";

// Auth Pages
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import FarmerRegisterPage from "./pages/auth/FarmerRegisterPage";

// Customer Pages
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import CartPage from "./pages/customer/CartPage";
import CheckoutPage from "./pages/customer/CheckoutPage";
import MyOrdersPage from "./pages/customer/MyOrdersPage";
import OrderDetailPage from "./pages/customer/OrderDetailPage";
import FavoritesPage from "./pages/customer/FavoritesPage";
import ProfilePage from "./pages/customer/ProfilePage";

// Farmer Pages
import FarmerDashboard from "./pages/farmer/FarmerDashboard";
import FarmerProducts from "./pages/farmer/FarmerProducts";
import FarmerOrders from "./pages/farmer/FarmerOrders";
import FarmerReviews from "./pages/farmer/FarmerReviews";
import FarmerProfile from "./pages/farmer/FarmerProfile";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminMarkets from "./pages/admin/AdminMarkets";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminReports from "./pages/admin/AdminReports";

import "./App.css";
import NotFoundPage from "./pages/public/NotFoundPage";
import AdminProducts from "./pages/admin/AdminProducts";
import FarmerSales from "./pages/farmer/FarmerSales";

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <FlyToCartProvider>
            <div className="app-container">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/markets" element={<MarketsPage />} />
                <Route path="/markets/:id" element={<MarketDetailPage />} />
                <Route path="/farmers" element={<FarmersPage />} />
                <Route path="/farmers/:id" element={<FarmerDetailPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/:id" element={<ProductDetailPage />} />

                {/* Auth Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route
                  path="/register/farmer"
                  element={<FarmerRegisterPage />}
                />

                {/* Customer Routes */}
                <Route
                  path="/customer"
                  element={
                    <ProtectedRoute allowedRoles={["customer"]}>
                      <CustomerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/customer/cart"
                  element={
                    <ProtectedRoute allowedRoles={["customer"]}>
                      <CartPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/customer/checkout"
                  element={
                    <ProtectedRoute allowedRoles={["customer"]}>
                      <CheckoutPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/customer/orders"
                  element={
                    <ProtectedRoute allowedRoles={["customer"]}>
                      <MyOrdersPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/customer/orders/:id"
                  element={
                    <ProtectedRoute allowedRoles={["customer"]}>
                      <OrderDetailPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/customer/favorites"
                  element={
                    <ProtectedRoute allowedRoles={["customer"]}>
                      <FavoritesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/customer/profile"
                  element={
                    <ProtectedRoute allowedRoles={["customer"]}>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />

                {/* Farmer Routes */}
                <Route
                  path="/farmer"
                  element={
                    <ProtectedRoute allowedRoles={["farmer"]}>
                      <FarmerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/farmer/sales"
                  element={
                    <ProtectedRoute allowedRoles={["farmer"]}>
                      <FarmerSales />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/farmer/products"
                  element={
                    <ProtectedRoute allowedRoles={["farmer"]}>
                      <FarmerProducts />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/farmer/orders"
                  element={
                    <ProtectedRoute allowedRoles={["farmer"]}>
                      <FarmerOrders />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/farmer/reviews"
                  element={
                    <ProtectedRoute allowedRoles={["farmer"]}>
                      <FarmerReviews />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/farmer/profile"
                  element={
                    <ProtectedRoute allowedRoles={["farmer"]}>
                      <FarmerProfile />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AdminUsers />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/markets"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AdminMarkets />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/categories"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AdminCategories />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/products"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AdminProducts />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/reviews"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AdminReviews />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/reports"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AdminReports />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>

              <FlyToCartLayer />

              <ToastContainer position="top-right" autoClose={3000} />
            </div>
          </FlyToCartProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
