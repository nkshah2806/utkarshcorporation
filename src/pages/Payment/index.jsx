import ReusableTable from "@/components/ReusableTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { getAllPayment } from "@/services/paymentApi";
import { Badge } from "@mui/material";
import { Eye } from "lucide-react";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Payment() {
  const tableRef = useRef();
  const navigate = useNavigate();

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
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100";
    }
  };

  const headers = [
    { key: "sNo", label: "S. No.", filterable: false },
    { key: "orderNo", label: "Booking Id", filterable: true},
    { key: "transactionId", label: "Payment Id", filterable: true},
    { key: "userName", label: "User Name", filterable: true },
    { key: "servicesTitle", label: "Service", filterable: true },
    { key: "amount", label: "Amount", filterable: true },
    { key: "createdAt", label: "Date", filterable: true },
    {
      key: "status",
      label: "Status",
      filterable: true,
      render: (row) => (
        <span
          className={`capitalize px-2 py-1 rounded text-xs font-semibold ${getStatusColor(
            row.status
          )}`}
        >
          {row.status}
        </span>
      ),
    },
    {
      key: "action",
      label: "Actions",
      filterable: false,
      render: (row) => (
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/payment/${row._id}`)}
          >
            <Eye />
          </Button>
          
        </div>
      ),
    }
  ];

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="font-ca">List of Payments</CardTitle>
          <CardDescription>All payment information below.</CardDescription>
        </CardHeader>
        <CardContent>
          <ReusableTable
            routeType={`table-payment`}
            ref={tableRef}
            headers={headers}
            apiPagination
            fetchData={getAllPayment}
            DateRange={true}
            selectable={false}
            Search={true}
            statusFilter={false}
          />
        </CardContent>
      </Card>
    </>
  );
}
