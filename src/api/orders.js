import axiosInstance from "./auth-api/axiosConnect";

export const createOrder = async (data) => {
  try {
    const response = await axiosInstance.post("/orders", data);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Create Order API Error:", error);

    return {
      success: false,
      message: "Unable to save order",
    };
  }
};

export const getMyOrders = async (userId) => {
  try {
    const response = await axiosInstance.get(`/orders?userId=${userId}`);
    return{
      success: true,
      data: response.data,
    };
  }
  catch (error){
    console.error("Get My orders API Error:", error);
    
    return {
      success: false,
      data: "Unabale to load errors"
    }
  }
}

export const getOrderById = async (id) => {
  try {
    const response = await axiosInstance.get(`/orders/${id}`);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Get Order API Error:", error);

    return {
      success: false,
      message: "Order not found",
    };
  }
};
