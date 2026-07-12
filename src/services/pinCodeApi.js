// src/services/userService.js
import axiosInstance from "@/lib/axios";

const ENDPOINT = "pincode";

export const createPincode = async (data) => {
  const response = await axiosInstance.post(`${ENDPOINT}/create`, data);
  return response.data.data;
};
// export const getPincodeById = async (id) => {
//   const response = await axiosInstance.get(`${ENDPOINT}/getPincodeById/${id}`);
//   return response.data.data;
// };
export const getAllState = async () => {
  const response = await axiosInstance.get(`common/getAllState`);
  return response.data.data;
};

// GET ALL USERS (with filters, search, pagination, sorting)
export const getAllPincode = async ({
  page = 1,
  limit = 10,
  search = "",
  isActive,
  startDate,
  endDate,
  sort = { key: "name", direction: "asc" },
}) => {
  try {
    const params = {
      search,
      ...(isActive !== undefined && { isActive }),
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
      page,
      limit,
      "sort[key]": sort.key,
      "sort[direction]": sort.direction,
    };

    const response = await axiosInstance.get(`${ENDPOINT}/getAll`, {
      params,
    });

    return {
      data: response.data.data.data.map((data,index) => {
        const serialNumber = (page - 1) * limit + index + 1;
        return {
          ...data,
          sNo: serialNumber,
          id: data._id,
          state: data.stateName,
          createdAt: data.createdAt
            ? `${new Date(data.createdAt).toLocaleString()}`
            : "N/A",
        };
      }),
      total: response.data.data.total,
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// TOGGLE ACTIVE STATUS (soft delete)
export const togglePincodeStatus = (id, body) =>
  axiosInstance.put(`${ENDPOINT}/deletePincode`, body);
