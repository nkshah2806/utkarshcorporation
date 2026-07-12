import axiosInstance from "@/lib/axios";

const ENDPOINT = "contactUs";

// GET ALL USERS (with filters, search, pagination, sorting)
export const getAllSupport = async ({
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

    const response = await axiosInstance.get(`${ENDPOINT}/getAll`, {
      params,
    });
    return {
      data: response.data.data.contactUs.map((data, index) => {
        const serialNumber = (page - 1) * limit + index + 1;
        return {
          ...data,
          sNo: serialNumber,
          id: data._id,
          message:
            data.message?.substring(0, 70) +
            (data.message?.length > 70 ? "..." : ""),
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

export const updateStatus = async (ticketId, status, remark) => {
  try {
    const response = await axiosInstance.put(
      `${ENDPOINT}/updateStatus/${ticketId}`,
      { status, remark }
    );
    return response.data.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error updating contact status"
    );
  }
};
