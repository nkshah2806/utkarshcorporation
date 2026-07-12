import "./App.scss";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login/login";
import ForgetPassword from "./pages/ForgetPassword/forget-password";
import Dashboard from "./pages/Dashboard/dashboard";
import { Toaster } from "sonner";
import ResetPassword from "./pages/ResetPassword/reset-password";
import PrivateRoute from "./routes/private-route";
import User from "./pages/User";
import UserEdit from "./pages/User/create";
import Services from "./pages/Services";
import CreateService from "./pages/Services/create";
import PinCode from "./pages/PinCode";
import CreatePinCode from "./pages/PinCode/create";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CreatePrivacyPolicy from "./pages/PrivacyPolicy/create";
import Booking from "./pages/Booking";
// import FCMToken from "./FCMToken";
import Support from "./pages/Support";
import BulkUploadServiceAvailability from "./pages/Services/BulkUploadServiceAvailability";
import BookingDetails from "./pages/Booking/BookingDetails";
import Payment from "./pages/Payment";
import PaymentDetails from "./pages/Payment/PaymentDetails";
import UserDetails from "./pages/User/UserDetails";

function App() {
  return (
    <>
      {/* <FCMToken /> */}
      <Toaster position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/forgot-password" element={<ForgetPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/user">
              <Route index element={<User />} />
              <Route path="edit/:id" element={<UserEdit />} />
            </Route>
            <Route path="/services">
              <Route index element={<Services />} />
              <Route path="create" element={<CreateService />} />
              <Route path="edit/:id" element={<CreateService />} />
            </Route>
            <Route path="/pincode">
              <Route index element={<PinCode />} />
              <Route path="create" element={<CreatePinCode />} />
              <Route path="edit/:id" element={<CreatePinCode />} />
            </Route>
            <Route path="/privacy-policy">
              <Route index element={<PrivacyPolicy />} />
              <Route path="edit/:id" element={<CreatePrivacyPolicy />} />
            </Route>
            <Route path="/booking">
              <Route index element={<Booking />} />
            </Route>
            <Route path="/support">
              <Route index element={<Support />} />
            </Route>
            <Route
              path="/services/bulk-upload/:id"
              element={<BulkUploadServiceAvailability />}
            />
            <Route path="/booking/:id" element={<BookingDetails />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/payment/:id" element={<PaymentDetails />} />
            <Route path="/user/:id" element={<UserDetails />} />
          </Route>
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
