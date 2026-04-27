import axiosInstance from "./auth-api/axiosConnect";

export const getProducts = async () => {
  try {
    const response = await axiosInstance.get("/products");
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getProductById = async (id) => {
  try {
    const response = await axiosInstance.get(`/products/${id}`);

    return {
      success: true,
      data: response.data,
    };
  } catch {
    return {
      success: false,
      message: "Product not found",
    };
  }
};