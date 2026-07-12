import ReusableTable from "@/components/ReusableTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAllBooking, updateBookingStatus } from "@/services/bookingApi";
import { Eye } from "lucide-react";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function Booking() {
  const tableRef = useRef();
  const navigate = useNavigate();

  // Modal state
  const [openModal, setOpenModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOpenModal = (row) => {
    setSelectedBooking(row);
    setNewStatus("");
    setReason("");
    setOpenModal(true);
  };

  const handleUpdateStatus = async () => {
    if (!newStatus) {
      toast.error("Please select a status.");
      return;
    }
    if (newStatus === "cancelled" && !reason.trim()) {
      toast.error("Please provide a reason for cancellation.");
      return;
    }
    try {
      setLoading(true);
      await updateBookingStatus(selectedBooking._id, newStatus, reason);
      toast.success(`Booking status updated to "${newStatus}"`);
      setOpenModal(false);
      setReason("");
      setNewStatus("");
      setSelectedBooking(null);
      if (tableRef.current) tableRef.current.refetchTable?.();
    } catch (err) {
      toast.error(err.message || "Failed to update booking status");
    } finally {
      setLoading(false);
    }
  };

  const headers = [
    {
      key: "sNo",
      label: "S. No.",
      filterable: false,
    },
    {
      key: "orderNo",
      label: "Booking Id",
      filterable: true,
    },
    {
      key: "userName",
      label: "User Name",
      filterable: true,
    },
    { key: "service", label: "Service", filterable: true },
    { key: "amount", label: "Amount", filterable: true },
    { key: "pickupDateTime", label: "Pickup Date", filterable: true },
    { key: "dropoffDateTime", label: "Dropoff Date", filterable: true },
    {
      key: "createdAt",
      label: "Created At",
      filterable: true,
    },
    {
      key: "status",
      label: "Status",
      filterable: true,
      render: (row) => (
        <Badge
          className="capitalize"
          variant={
            row.status === "confirmed"
              ? "default"
              : row.status === "booked"
                ? "confirmed"
                : row.status === "cancelled"
                  ? "destructive"
                  : row.status === "completed"
                    ? "completed"
                    : row.status === "request for refund"
                      ? "request for refund"
                      : row.status === "refunded"
                        ? "refunded"
                        : "default"
          }
        >
          {row.status}
        </Badge>
      ),
    },
    {
      key: "action",
      label: "Actions",
      filterable: false,
      render: (row) => {
        const showUpdate =
          row.status === "booked" ||
          row.status === "confirmed"

        const isPaymentSucceeded = row.paymentStatus === "succeeded";

        return (
          <TooltipProvider>
            <div className="flex gap-3 items-center">
              {/* View Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/booking/${row._id}`)}
              >
                <Eye className="w-4 h-4" />
              </Button>

              {/* Conditionally render Update Status */}
              {showUpdate && (
                isPaymentSucceeded ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleOpenModal(row)}
                  >
                    Update Status
                  </Button>
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <Button
                          variant="secondary"
                          size="sm"
                          disabled
                          className="opacity-70 cursor-not-allowed"
                        >
                          Update Status
                        </Button>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      Only allowed when payment is Succeeded
                    </TooltipContent>
                  </Tooltip>
                )
              )}
            </div>
          </TooltipProvider>
        );
      },
    }
  ];

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="font-ca">List of Bookings</CardTitle>
          <CardDescription>All booking information below.</CardDescription>
        </CardHeader>
        <CardContent>
          <ReusableTable
            routeType={`table-Booking`}
            ref={tableRef}
            headers={headers}
            apiPagination
            fetchData={getAllBooking}
            DateRange={true}
            selectable={false}
            BookingStatus={true}
            Search={true}
            rowClassName={(row) =>
              row.hasMover ? "bg-yellow-100 dark:bg-yellow-900" : ""
            }
            statusFilter={false}
          />
        </CardContent>
      </Card>

      {/* Update Status Modal */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Booking Status</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {selectedBooking?.status === "booked" && (
                    <>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </>
                  )}
                  {selectedBooking?.status === "confirmed" && (
                    <SelectItem value="completed">Completed</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            {newStatus === "cancelled" && (
              <div className="grid gap-2">
                <Label htmlFor="reason">Reason for Cancellation</Label>
                <Textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter reason..."
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenModal(false)}>
              Close
            </Button>
            <Button onClick={handleUpdateStatus} disabled={loading}>
              {loading ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
