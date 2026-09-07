import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

import { AuthProvider } from "@/context/AuthContext";
import { ContentProvider } from "@/context/ContentContext";

import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import ProductDetail from "@/pages/ProductDetail";
import About from "@/pages/About";
import HealthCamps from "@/pages/HealthCamps";
import HealthCampDetails from "@/pages/HealthCampDetails";
import Distributor from "@/pages/Distributor";
import Contact from "@/pages/Contact";
import Register from "@/pages/Register";
import RegisterSuccess from "@/pages/RegisterSuccess";
import Policies from "@/pages/Policies";
import Layout from "./components/Layout";
import ScrollToTop from "@/components/ScrollToTop";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <ContentProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Toaster position="top-right" richColors />
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:slug" element={<ProductDetail />} />
                <Route path="/about" element={<About />} />
                <Route path="/health-camps" element={<HealthCamps />} />
                <Route path="/health-camps/:campId" element={<HealthCampDetails />} />
                <Route path="/distributor" element={<Distributor />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/register" element={<Register />} />
                <Route path="/register-success" element={<RegisterSuccess />} />
                <Route path="/policies/:slug" element={<Policies />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ContentProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
