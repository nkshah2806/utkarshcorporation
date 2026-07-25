import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { ContentProvider } from "@/context/ContentContext";

import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import ProductDetail from "@/pages/ProductDetail";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import OrderSuccess from "@/pages/OrderSuccess";
import About from "@/pages/About";
import HealthCamps from "@/pages/HealthCamps";
import Distributor from "@/pages/Distributor";
import Contact from "@/pages/Contact";
import Login from "./pages/Login";
import Register from "@/pages/Register";
import Account from "@/pages/Account";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import Policies from "@/pages/Policies";
import Layout from "./components/Layout";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <CartProvider>
          <ContentProvider>
            <BrowserRouter>
              <Toaster position="top-right" richColors />
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:slug" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-success/:orderId" element={<OrderSuccess />} />
                <Route path="/about" element={<About />} />
                <Route path="/health-camps" element={<HealthCamps />} />
                <Route path="/distributor" element={<Distributor />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/account" element={<Account />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/policies/:slug" element={<Policies />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ContentProvider>
      </CartProvider>
    </AuthProvider>
    </div>
  );
}

export default App;
