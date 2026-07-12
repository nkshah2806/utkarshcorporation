import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getPaymentById } from "@/services/paymentApi";
import { Config } from "@/lib/Config";
import { CheckCircle, Loader2, RefreshCcw } from "lucide-react";

export default function PaymentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [payment, setPayment] = useState(null);

  useEffect(() => {
    getPaymentById(id).then((data) => setPayment(data[0]));
  }, [id]);

  const getStatusColor = (status) => {
    switch (status) {
      case "succeeded":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
      case "processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100";
      case "requires_action":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100";
      case "requires_payment_method":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100";
      case "requires_confirmation":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100";
      case "requires_capture":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100";
      case "canceled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100";
      default:
        return "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "succeeded":
        return <CheckCircle className="w-5 h-5 mr-2 inline text-green-600" />;
      case "processing":
      case "requires_action":
      case "requires_payment_method":
      case "requires_confirmation":
      case "refunded":
        return <RefreshCcw className="w-5 h-5 mr-2 inline text-green-600" />;
      case "requires_capture":
        return (
          <Loader2 className="w-5 h-5 mr-2 inline text-blue-600 animate-spin" />
        );
      case "cancelled":
        return <XCircle className="w-5 h-5 mr-2 inline text-red-600" />;
      default:
        return <Loader2 className="w-5 h-5 mr-2 inline text-gray-400 animate-spin" />;
    }
  };

  if (!payment) return <div className="text-center p-6">Loading...</div>;

return (
  <div>
    <Card>
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle className="text-3xl">Payment Details</CardTitle>
        </div>
        <Button variant="outline" onClick={() => navigate("/payment")}>
          Back
        </Button>
      </CardHeader>

      <CardContent className="space-y-10">
        {/* User Information */}
        <section>
          <h3 className="text-xl font-semibold mb-4">User Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <div className="font-semibold">User Name</div>
              <div>{payment.userName}</div>
            </div>
            <div>
              <div className="font-semibold">Email</div>
              <div>{payment.email}</div>
            </div>
            <div>
              <div className="font-semibold">Phone Number</div>
              <div>{payment.phoneNumber}</div>
            </div>
          </div>
        </section>

        {/* Payment Information */}
        <section>
          <h3 className="text-xl font-semibold mb-4">Payment Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <div className="font-semibold">Payment ID</div>
              <div>{payment.transactionId}</div>
            </div>
            <div>
              <div className="font-semibold">Booking Id</div>
              <div>{payment.orderNo}</div>
            </div>
            <div>
              <div className="font-semibold">Currency</div>
              <div>{payment.currency}</div>
            </div>
            <div>
              <div className="font-semibold">Payment Method</div>
              <div>{payment.paymentMethod}</div>
            </div>
            <div>
              <div className="font-semibold">Created At</div>
              <div>{new Date(payment.createdAt).toLocaleString()}</div>
            </div>
            <div className="flex items-center">
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium ${getStatusColor(
                  payment.status
                )}`}
              >
                {getStatusIcon(payment.status)}
                <span className="capitalize">{payment.status}</span>
              </div>
            </div>
          </div>

          {/* Styled Amount Section */}
          <div className="mt-6">
            <h4 className="text-lg font-semibold mb-3">Summary</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Sub Total */}
              <div className="rounded-lg border p-4 shadow-sm bg-blue-50 dark:bg-blue-900 text-blue-900 dark:text-blue-100">
                <div className="text-sm font-semibold mb-1">Sub Total</div>
                <div className="text-2xl font-bold">${payment.subTotal}</div>
              </div>

              {/* Tax */}
              <div className="rounded-lg border p-4 shadow-sm bg-yellow-50 dark:bg-yellow-900 text-yellow-900 dark:text-yellow-100">
                <div className="text-sm font-semibold mb-1">Tax</div>
                <div className="text-2xl font-bold">${payment.tax}</div>
              </div>

              {/* Total Amount */}
              <div className="rounded-lg border p-4 shadow-sm bg-green-50 dark:bg-green-900 text-green-900 dark:text-green-100">
                <div className="text-sm font-semibold mb-1">Total Amount</div>
                <div className="text-2xl font-bold">${payment.amount}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section>
          <h3 className="text-xl font-semibold mb-4">Services</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {payment.services?.map((service, idx) => (
              <div
                key={idx}
                className="border rounded-lg p-4 shadow-sm text-center"
              >
                <img
                  src={
                    service.image
                      ? `${Config.API_URL}${service.image[0]}`
                      : "/placeholder-service.png"
                  }
                  alt={service.title}
                  className="w-32 h-32 object-cover rounded mb-4 mx-auto border"
                />
                <div className="font-medium">{service.title}</div>
                <div className="text-sm">Qty: {service.qty}</div>
                <div className="text-sm">Price: ${service.price}</div>
                <div className="text-sm font-semibold">
                  Total: ${service.price * service.qty}
                </div>
              </div>
            ))}
          </div>
        </section>
      </CardContent>
    </Card>
  </div>
);
}
