import axiosInstance from "@/lib/axios";

const ENDPOINT = "privacyPolicy";

// GET ALL PRIVACY POLICY (with filters, search, pagination, sorting)
export const getAllPrivacyPolicy = async ({
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
      // ...(isActive !== undefined && { isActive }),
      "sort[key]": sort.key,
      "sort[direction]": sort.direction,
    };

    const response = await axiosInstance.get(
      `${ENDPOINT}/getAllPrivacyPolicy`,
      {
        params,
      }
    );
    return {
      data: response.data.data.data.map((data, index) => {
        const serialNumber = (page - 1) * limit + index + 1;

        return {
          ...data,
          id: data._id,
          sNo: serialNumber,
          description:
            data.description?.substring(0, 70) +
            (data.description?.length > 70 ? "..." : ""),
          createdAt: data.createdAt
            ? `${new Date(data.createdAt).toLocaleString()}`
            : "N/A",
          updatedAt: data.updatedAt
            ? `${new Date(data.updatedAt).toLocaleString()}`
            : "N/A",
        };
      }),
      total: response.data.data.total,
    };
  } catch (error) {
    console.error("Error fetching privacy policies:", error);
    throw error;
  }
};

export const updatePrivacyPolicy = async (data) => {
  const response = await axiosInstance.post(`${ENDPOINT}/create`, data);
  return response.data.data;
};

// ✅ Get privacy policy by ID
export const getPrivacyPolicyById = async (id) => {
  try {
    const response = await axiosInstance.get(
      `${ENDPOINT}/getByPrivacyPolicyId/${id}`
    );
    return response?.data?.data; // return just the policy object
  } catch (error) {
    console.error("Fetch Error:", error);
    throw error; // let the component handle the error
  }
};
