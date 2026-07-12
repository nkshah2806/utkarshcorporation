import axiosInstance from "@/lib/axios";

const ENDPOINT = "payment";

export const getAllPayment = async ({
  page = 1,
  limit = 10,
  search = "",
  isActive,
  startDate,
  endDate,
  status,
  sort = { key: "name", direction: "asc" },
}) => {
  try {
    const params = {
      search,
      ...(isActive !== undefined && { isActive }),
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
      ...(status && { status }),
      page,
      limit,
      // ...(isActive !== undefined && { isActive }),
      "sort[key]": sort.key,
      "sort[direction]": sort.direction,
    };

    const response = await axiosInstance.get(`${ENDPOINT}/getAllPayment`, {
      params,
    });
    return {
      data: response.data.data.payments.map((data, index) => {
        const serialNumber = (page - 1) * limit + index + 1;
        return {
          ...data,
          sNo: serialNumber,
          id: data._id,
          createdAt: data.createdAt
            ? `${new Date(data.createdAt).toLocaleString()}`
            : "N/A",
        };
      }),
      total: response.data.data.total,
    };
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw error;
  }
};

export const getPaymentById = async (paymentId) => {
  try {
    const response = await axiosInstance.get(
      `${ENDPOINT}/getPaymentById/${paymentId}`
    );
    return response.data.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error fetching booking by ID"
    );
  }
};

export const updateRefundStatus = async (
  bookingId,
  reason = "requested_by_customer"
) => {
  try {
    const response = await axiosInstance.post(`${ENDPOINT}/refund`, {
      bookingId,
      reason,
    });
    return response.data.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error updating booking status"
    );
  }
};
