import React, { useEffect, useRef, useState } from "react";
import { Chart } from "@/components/chart";
import countUser from "../../assets/countUser.png";
import book from "../../assets/book.png";
import truck from "../../assets/truck.png";
import calander from "../../assets/calander.png";
import time from "../../assets/time.png";
// import { PieChartComponent } from "@/components/pie-chart";
import ReusableTable from "@/components/ReusableTable";
import { getAllBooking } from "@/services/bookingApi";
import { Badge } from "@/components/ui/badge";
import {
  getDashboardLists,
  getMonthlyBookings,
  getServiceOverview,
  getTotalCount,
  getTotalUsers,
} from "@/services/dashboardApi";
import { useApiMutation } from "@/hooks/useApiMutation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PieChart from "@/components/high-pie-chart";
import { useTheme } from "@/components/theme-context";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { theme } = useTheme();
  const [allCount, setAllCount] = useState();
  const [monthlyBookings, setMonthlyBookings] = useState();
  const [serviceOverview, setServiceOverview] = useState();
  const { setError } = useApiMutation();

  const tableRef = useRef();

  // State for modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");

  // Helper to truncate pickupAddress
  const getTruncated = (text, wordLimit = 5) => {
    const words = text?.split(" ") || [];
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(" ") + "...";
  };

  // Modal component
  const PickupAddressModal = ({ open, content, onClose }) =>
    open ? (
      <div
        className="fixed inset-0 flex items-center justify-center z-50 bg-[#000000ab] bg-opacity-30"
        onClick={onClose}
      >
        <div
          className="bg-white dark:bg-black p-4 rounded shadow-lg max-w-md w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-2 dark:text-white font-bold">Full Location</div>
          <div className="mb-4 dark:text-white">{content}</div>
          <div className="flex justify-end">
            <Button variant="default" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    ) : null;

  const headers = [
    {
      key: "sNo",
      label: "S. No.",
      filterable: false,
    },
    { key: "orderNo", label: "Booking ID", filterable: true },
    {
      key: "userName",
      label: "Customer",
      filterable: true,
    },
    {
      key: "pickupAddress",
      label: "Pickup Location",
      filterable: true,
      render: (row) => (
        <div className="flex items-center gap-1">
          {getTruncated(row.pickupAddress, 5)}
          {row.pickupAddress && row.pickupAddress.split(" ").length > 5 && (
            <button
              className="text-[#e15920] ml-2"
              onClick={() => {
                setModalContent(row.pickupAddress);
                setModalOpen(true);
              }}
            >
              Read more
            </button>
          )}
        </div>
      ),
    },
    {
      key: "dropoffAddress",
      label: "Drop-off Location",
      filterable: true,
      render: (row) => (
        <div className="flex items-center gap-1">
          {getTruncated(row.dropoffAddress, 5)}
          {row.dropoffAddress && row.dropoffAddress.split(" ").length > 5 && (
            <button
              className="text-[#e15920] ml-2"
              onClick={() => {
                setModalContent(row.dropoffAddress);
                setModalOpen(true);
              }}
            >
              Read more
            </button>
          )}
        </div>
      ),
    },
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
                    : "default"
          }
        >
          {row.status}
        </Badge>
      ),
    },
  ];
  const city = [
    {
      key: "sNo",
      label: "S. No.",
      filterable: false,
    },
    { key: "city", label: "City", filterable: false },
    { key: "totalAvailableQuantity", label: "Total Quantity", filterable: false },
  ];
  const topUsers = [
    {
      key: "sNo",
      label: "S. No.",
      filterable: false,
    },
    { key: "bookingCount", label: "Total Booking Count", filterable: false },
    { key: "fullName", label: "Full Name", filterable: false },
    { key: "email", label: "email", filterable: false },
  ];
  const countUp = [
    {
      icon: countUser,
      title: "Total Users",
      value: allCount?.totalUsers || "0",
    },
    {
      icon: book,
      title: "Total Bookings",
      value: allCount?.totalBookings || "0",
    },
    {
      icon: truck,
      title: "Total Services",
      value: allCount?.totalServices || "0",
    },
    {
      icon: calander,
      title: "Total Revenue",
      value: allCount?.totalRevenue || "0",
    },
    {
      icon: time,
      title: "Confirmed Bookings",
      value: allCount?.totalConfirmed || "0",
    },
  ];

  useEffect(() => {
    getTotalCountMutation.mutate();
    getMonthlyBookingsMutation.mutate();
    getServiceOverviewMutation.mutate();
  }, []);

  const getTotalCountMutation = useApiMutation(getTotalCount, {
    onSuccess: (data) => {
      setAllCount(data.data);
    },
    onError: (err) => {
      setError("apiError", {
        type: "manual",
        message: err?.response?.data?.message || "Something went wrong",
      });
    },
  });
  const getMonthlyBookingsMutation = useApiMutation(getMonthlyBookings, {
    onSuccess: (data) => {
      setMonthlyBookings(data.data);
    },
    onError: (err) => {
      setError("apiError", {
        type: "manual",
        message: err?.response?.data?.message || "Something went wrong",
      });
    },
  });
  const getServiceOverviewMutation = useApiMutation(getServiceOverview, {
    onSuccess: (data) => {
      setServiceOverview(data.data);
    },
    onError: (err) => {
      setError("apiError", {
        type: "manual",
        message: err?.response?.data?.message || "Something went wrong",
      });
    },
  });
  // const pieColors = ["#88C75B", "#8454C8", "#652259", "#F79759", "#371C30"];

  return (
    <>
      <PickupAddressModal
        open={modalOpen}
        content={modalContent}
        onClose={() => setModalOpen(false)}
      />
      <div className="flex items-center justify-between mb-[23px]">
        <CardTitle className="font-semibold text-[30px]">
          Moving Service Admin Dashboard
        </CardTitle>
      </div>
      <div className="w-full flex gap-[11px] mb-[28px]">
        {countUp.map((item, i) => (
          <Card
            className="border border-[#9460DF] rounded-md w-full p-[17px] flex items-center justify-between flex-row"
            key={i}
          >
            <div className="max-w-[127px]">
              <CardTitle className="text-[20px] font-semibold">
                {item?.title}
              </CardTitle>
              <span className="text-[#9460DF] text-[26px] font-semibold">
                {item?.value}
              </span>
            </div>
            <img
              src={item?.icon}
              alt={item?.title}
              className="img-fluid flex-none"
            />
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-12 gap-[11px] mb-[28px]">
        <div className="col-span-6">
          <CardTitle className="font-semibold text-[30px] mb-[10px]">
            Booking Overview
          </CardTitle>
          <Card>
            <CardContent>
              <p className="text-[#A8A8A8] font-semibold text-[16px] mb-5">
                Bookings Trend
              </p>
              <Chart monthlyBookings={monthlyBookings} />
            </CardContent>
          </Card>
        </div>
        <div className="col-span-6 flex flex-col">
          <CardTitle className="font-semibold text-[30px] mb-[10px]">
            Service overview
          </CardTitle>
          <Card>
            <CardContent>
              {/* <PieChartComponent
                data={serviceOverview}
                PIE_COLORS={pieColors}
              />
              <div className="flex items-center gap-x-[36px] justify-center flex-wrap mx-auto">
                {serviceOverview?.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex text-[14px] text-[#2B2B2B] dark:text-white items-center"
                  >
                    <span
                      className="block w-[19px] h-[19px] rounded-full mr-2"
                      style={{
                        backgroundColor: pieColors[idx % pieColors.length],
                      }}
                    ></span>
                    {item.name}
                  </div>
                ))}
              </div> */}
              <PieChart data={serviceOverview} theme={theme} />
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6 mt-4">
          <CardHeader className={"pl-0"}>
            <CardTitle className="font-semibold text-[30px]">Top 5 Users with multiple Bookings</CardTitle>
          </CardHeader>
          <Card className=" min-h-[396px]">
            <CardContent>
              <ReusableTable
                ref={tableRef}
                headers={topUsers}
                apiPagination
                fetchData={getTotalUsers}
                selectable={false}
                DateRange={false}
                BookingStatus={false}
                Search={false}
                statusFilter={false}
                viewAll={false}
                routeType={`table-topUsers`}
                pagination={false}
              />
            </CardContent>
          </Card>
        </div>
        <div className="col-span-6">
          <CardHeader className={"pl-0"}>
            <CardTitle className="font-semibold mt-4 text-[30px]">Service City With Quantity List</CardTitle>
          </CardHeader>
          <Card>
            <CardContent>
              <ReusableTable
                routeType={`table-city-service`}
                ref={tableRef}
                headers={city}
                defaultLimit={5}
                apiPagination
                fetchData={getDashboardLists}
                selectable={false}
                DateRange={false}
                BookingStatus={false}
                Search={true}
                statusFilter={false}
                viewAll={false}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <CardHeader className={"pl-0"}>
        <CardTitle className="font-semibold mt-4 text-[30px]">Booking List</CardTitle>
      </CardHeader>
      <Card>
        <CardContent>
          <ReusableTable

            ref={tableRef}
            headers={headers}
            apiPagination
            fetchData={getAllBooking}
            selectable={false}
            DateRange={true}
            BookingStatus={true}
            Search={true}
            statusFilter={false}
            viewAll={true}
            routeType={`table-dash-Booking`}
          />
        </CardContent>
      </Card>
    </>
  );
}
