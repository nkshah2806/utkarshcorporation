import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { getBookingById, isShowApp } from "@/services/bookingApi";
import { updateBookingStatus } from "@/services/bookingApi"; // Make sure this is correctly imported
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Config } from "@/lib/Config";
import { CheckCircle, Loader2, Clock, X, Check, RefreshCcw } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { updateRefundStatus } from "@/services/paymentApi";

export default function BookingDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [newStatus, setNewStatus] = useState("");
    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getBookingById(id).then((data) => setBooking(data[0]));
    }, [id]);

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case "booked":
                return "bg-yellow-100 text-yellow-800 border border-yellow-300";
            case "confirmed":
                return "bg-blue-100 text-blue-800 border border-blue-300";
            case "completed":
                return "bg-green-100 text-green-800 border border-green-300";
            case "cancelled":
                return "bg-red-100 text-red-800 border border-red-300";
            case "request for refund":
                return "bg-orange-100 text-orange-800 border border-orange-300";
            case "refunded":
                return "bg-purple-100 text-purple-800 border border-purple-300";
            default:
                return "bg-gray-100 text-gray-800 border border-gray-300";
        }
    };

    const getStatusIcon = (status) => {
        switch (status.toLowerCase()) {
            case "booked":
                return <Clock className="w-4 h-4 mr-2 text-yellow-600" />;
            case "confirmed":
                return <Check className="w-4 h-4 mr-2 text-blue-600" />;
            case "completed":
                return <CheckCircle className="w-4 h-4 mr-2 text-green-600" />;
            case "cancelled":
                return <X className="w-4 h-4 mr-2 text-red-600" />;
            case "request for refund":
                return <RefreshCcw className="w-4 h-4 mr-2 text-orange-600 animate-spin" />;
            case "refunded":
                return <RefreshCcw className="w-4 h-4 mr-2 text-purple-600" />;
            default:
                return <Loader2 className="w-4 h-4 mr-2 text-gray-500 animate-spin" />;
        }
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
            await updateBookingStatus(id, newStatus, reason);
            toast.success(`Booking status updated to "${newStatus}"`);
            setOpenModal(false);
            setReason("");
            setNewStatus("");
            // Refresh booking
            getBookingById(id).then((data) => setBooking(data[0]));
        } catch (err) {
            toast.error(err.message || "Failed to update booking status");
        } finally {
            setLoading(false);
        }
    };

    const isShowAppSide = async (bookingReviewId) => {
        try {
            setLoading(true);
            await isShowApp(id, bookingReviewId);
            toast.success("Review visibility updated.");
            getBookingById(id).then((data) => setBooking(data[0]));
        } catch (err) {
            toast.error(err.message || "Failed to update Is Show On App");
        } finally {
            setLoading(false);
        }
    }

    const handleRefundPayment = async () => {
        try {
            setLoading(true);
            const refund = await updateRefundStatus(id, "requested_by_customer");
            toast.success(`Refund processed: $${refund.amount}`);
            getBookingById(id).then((data) => setBooking(data[0])); // Refresh data
        } catch (err) {
            toast.error(err.message || "Failed to process refund");
        } finally {
            setLoading(false);
        }
    };

    if (!booking) return <div className="text-center p-4">Loading...</div>;

    return (
        <div>
            <Card>
                <CardHeader className="flex justify-between">
                    <CardTitle className="text-3xl font-bold">Booking Details</CardTitle>
                    <div className="flex gap-5">
                        <Button variant="outline" onClick={() => navigate("/booking")}>
                            Back
                        </Button>
                        {(booking.status === "booked" || booking.status === "confirmed") && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span>
                                            <Button
                                                onClick={() => setOpenModal(true)}
                                                disabled={booking.paymentStatus !== "succeeded"}
                                            >
                                                Update Status
                                            </Button>
                                        </span>
                                    </TooltipTrigger>
                                    {booking.paymentStatus !== "succeeded" && (
                                        <TooltipContent>
                                            <p>Only allowed when payment is Succeeded</p>
                                        </TooltipContent>
                                    )}
                                </Tooltip>
                            </TooltipProvider>
                        )}
                    </div>
                </CardHeader>

                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        <div>
                            <div className="font-semibold">Booking Id:</div>
                            <div>{booking.orderNo}</div>
                        </div>
                        <div>
                            <div className="font-semibold">User Name:</div>
                            <div>
                                {booking.userDetails?.firstname} {booking.userDetails?.lastname}
                            </div>
                        </div>
                        <div className="flex items-center">
                            <div
                                className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-full shadow-sm ${getStatusColor(
                                    booking.status
                                )}`}
                            >
                                {getStatusIcon(booking.status)}
                                <span className="capitalize">{booking.status}</span>
                            </div>
                        </div>
                    </div>

                    {/* Addresses */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        <div>
                            <div className="font-semibold">Pickup Address:</div>
                            <div>
                                {booking.pickupLocation.apartment}, {booking.pickupLocation.pincode},{" "}
                                {booking.pickupLocation.stateName}
                            </div>
                        </div>
                        <div>
                            <div className="font-semibold">Dropoff Address:</div>
                            <div>
                                {booking.dropoffLocation.apartment}, {booking.dropoffLocation.pincode},{" "}
                                {booking.dropoffLocation.stateName}
                            </div>
                        </div>
                        <div>
                            <div className="font-semibold">Created At:</div>
                            <div>{new Date(booking.createdAt).toLocaleString()}</div>
                        </div>
                    </div>

                    {/* Date/Time */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        <div>
                            <div className="font-semibold">Pickup DateTime:</div>
                            <div>{new Date(booking.pickupDateTime).toLocaleString()}</div>
                        </div>
                        <div>
                            <div className="font-semibold">Dropoff DateTime:</div>
                            <div>{new Date(booking.dropoffDateTime).toLocaleString()}</div>
                        </div>
                        {booking.status === "completed" && (
                            <div>
                                <div className="font-semibold">Completed Date:</div>
                                <div>{new Date(booking.completedDate).toLocaleString()}</div>
                            </div>)}
                    </div>

                    <div>
                        {booking.status === "cancelled" && (
                            <div className="border-t mt-6 pt-6">
                                <div className="font-semibold text-xl text-red-600 flex items-center gap-2">
                                    <X className="w-6 h-6 text-red-600" />
                                    <span>Reason for Cancellation</span>
                                </div>
                                <div className="mt-4 p-4 bg-gradient-to-r from-red-100 via-red-200 to-red-300 border-2 border-red-500 rounded-lg shadow-md text-sm text-red-800">
                                    {booking.reason ? booking.reason : "No reason provided."}
                                </div>
                            </div>
                        )}
                    </div>

                    <div>
                        {(booking.status === "request for refund" || booking.status === "refunded") && (
                            <div className="mt-8 border-t pt-6 space-y-4">
                                <div className="flex items-center gap-2 text-destructive font-semibold text-xl">
                                    <X className="w-5 h-5 text-destructive" />
                                    <span>Reason and Comment for Refund</span>
                                </div>

                                <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 shadow-sm">
                                    <p className="text-sm font-medium text-destructive">Reason</p>
                                    <p className="text-sm text-destructive mt-1">{booking.refundReason || "N/A"}</p>

                                    {booking.refundComment && (
                                        <>
                                            <p className="text-sm font-medium text-destructive mt-4">Comment</p>
                                            <p className="text-sm text-destructive mt-1">{booking.refundComment}</p>
                                        </>
                                    )}
                                </div>

                                {/* ✅ Add Refund Payment button here */}
                                {booking.status === "request for refund" && (
                                    <div>
                                        <Button
                                            variant="destructive"
                                            disabled={loading}
                                            onClick={handleRefundPayment}
                                        >
                                            {loading ? "Processing..." : "Refund Payment"}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}
                        {/* Styled Amount Section */}

                        {(booking.paymentAmount && booking.paymentSubTotal && booking.paymentTax) && (<div className="mt-6">
                            <h4 className="text-lg font-semibold mb-3">Summary</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {/* Sub Total */}
                                <div className="rounded-lg border p-4 shadow-sm bg-blue-50 dark:bg-blue-900 text-blue-900 dark:text-blue-100">
                                    <div className="text-sm font-semibold mb-1">Sub Total</div>
                                    <div className="text-2xl font-bold">${booking.paymentSubTotal}</div>
                                </div>

                                {/* Tax */}
                                <div className="rounded-lg border p-4 shadow-sm bg-yellow-50 dark:bg-yellow-900 text-yellow-900 dark:text-yellow-100">
                                    <div className="text-sm font-semibold mb-1">Tax</div>
                                    <div className="text-2xl font-bold">${booking.paymentTax}</div>
                                </div>

                                {/* Total Amount */}
                                <div className="rounded-lg border p-4 shadow-sm bg-green-50 dark:bg-green-900 text-green-900 dark:text-green-100">
                                    <div className="text-sm font-semibold mb-1">Total Amount</div>
                                    <div className="text-2xl font-bold">${booking.paymentAmount}</div>
                                </div>
                            </div>
                        </div>)}

                    </div>

                    {/* Services */}
                    <div className="border-t mt-6 pt-6">
                        <h3 className="text-xl font-semibold mb-4">Services</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {booking.services?.map((service, idx) => (
                                <div key={idx} className="border rounded-lg p-4 shadow-sm">
                                    <img
                                        src={service.image ? `${Config.API_URL}${service.image[0]}` : "/placeholder-service.png"}
                                        alt={service.title}
                                        className="w-32 h-32 object-cover rounded mb-4 mx-auto border"
                                    />
                                    <div className="font-medium">{service.title}</div>
                                    <div className="text-sm">Qty: {service.qty}</div>
                                    <div className="text-sm">Price: ${service.price}</div>
                                    <div className="text-sm">Total: ${service.price * service.qty}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {booking.reviews && booking.reviews.length > 0 ? (
                        <div className="border-t mt-10 pt-6">
                            <h3 className="text-xl font-semibold mb-4">User Reviews</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {booking.reviews.map((review, index) => (
                                    <div
                                        key={index}
                                        className="border rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="text-sm font-semibold">
                                                User Name:{" "}
                                                <span className="font-medium">{review.userName}</span>
                                            </div>
                                            <div className="cursor-pointer" onClick={() => isShowAppSide(review._id)}>
                                                {review.isShowInApp ? (
                                                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">
                                                        Visible on App Side
                                                    </span>
                                                ) : (
                                                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-600 font-medium">
                                                        Hidden on App Side
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-sm mb-3 italic">
                                            {new Date(review.createdAt).toLocaleString()}
                                        </div>
                                        <div className="text-base font-medium mb-2">
                                            “{review.review}”
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i}>
                                                    {i < review.stars ? (
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="#facc15"
                                                            viewBox="0 0 24 24"
                                                            strokeWidth={1.5}
                                                            stroke="currentColor"
                                                            className="w-5 h-5"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M11.48 3.499a.75.75 0 011.04 0l2.81 2.847a.75.75 0 00.564.213l3.973.577a.75.75 0 01.416 1.28l-2.874 2.801a.75.75 0 00-.217.664l.678 3.954a.75.75 0 01-1.088.791l-3.551-1.867a.75.75 0 00-.698 0l-3.55 1.867a.75.75 0 01-1.088-.79l.678-3.955a.75.75 0 00-.217-.664l-2.874-2.8a.75.75 0 01.416-1.28l3.973-.578a.75.75 0 00.564-.213l2.81-2.847z"
                                                            />
                                                        </svg>
                                                    ) : (
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            strokeWidth={1.5}
                                                            stroke="#d1d5db"
                                                            className="w-5 h-5"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M11.48 3.499a.75.75 0 011.04 0l2.81 2.847a.75.75 0 00.564.213l3.973.577a.75.75 0 01.416 1.28l-2.874 2.801a.75.75 0 00-.217.664l.678 3.954a.75.75 0 01-1.088.791l-3.551-1.867a.75.75 0 00-.698 0l-3.55 1.867a.75.75 0 01-1.088-.79l.678-3.955a.75.75 0 00-.217-.664l-2.874-2.8a.75.75 0 01.416-1.28l3.973-.578a.75.75 0 00.564-.213l2.81-2.847z"
                                                            />
                                                        </svg>
                                                    )}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (null)}

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
                                    {booking.status === "booked" && (
                                        <>
                                            <SelectItem value="confirmed">Confirmed</SelectItem>
                                            <SelectItem value="cancelled">Cancelled</SelectItem>
                                        </>
                                    )}
                                    {booking.status === "confirmed" && (
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
        </div>
    );
}
