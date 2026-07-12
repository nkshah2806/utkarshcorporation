// src/services/userService.js
import axiosInstance from "@/lib/axios";
import { Config } from "@/lib/Config";

const ENDPOINT = "service";

// GET ALL USERS (with filters, search, pagination, sorting)
export const getAllService = async ({
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
      data: response.data.data.data.map((data, index) => {
        const serialNumber = (page - 1) * limit + index + 1;
        return {
          ...data,
          sNo: serialNumber,
          id: data._id,
          profileUrl: data.image[0]
            ? Config.API_URL + data.image[0]
            : "default-profile.png", // Fallback to a default image if none exists
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
export const toggleServiceStatus = (id, body) =>
  axiosInstance.put(`${ENDPOINT}/deleteService`, body);

export const createService = async (data) => {
  const response = await axiosInstance.post(`${ENDPOINT}/create`, data);
  return response.data.data;
};

export const updateService = async (id, data) => {
  const response = await axiosInstance.put(`${ENDPOINT}/update`, {
    ...data,
    serviceId: id,
  });
  return response.data.data;
};

export const getServiceById = async (id) => {
  const response = await axiosInstance.get(`${ENDPOINT}/getServicesById/${id}`);
  return response.data.data;
};

export const deleteServiceImage = async (id, imageUrl) => {
  const response = await axiosInstance.post(`${ENDPOINT}/image/delete`, {
    serviceId: id,
    imageUrl,
  });
  return response.data.data;
};

export const bulkUploadAvailability = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await axiosInstance.post(
    `${ENDPOINT}/availability/bulk-upload`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response.data.data; // { validRows, failedRows }
};

export const deleteAvailability = async (serviceId, availabilityId) => {
  try {
    const response = await axiosInstance.put(
      `${ENDPOINT}/deleteAvailability/${serviceId}`,
      { availabilityId }
    );
    return response.data.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
