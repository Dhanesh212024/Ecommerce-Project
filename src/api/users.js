import axiosInstance from "./auth-api/axiosConnect";

export const registerUser = async (data) => {
  try {
    const response = await axiosInstance.post("/users", data);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Register API Error:", error);

    return {
      success: false,
      message: "Registration failed",
    };
  }
};

export const loginUser = async (data) => {
  try {
    const response = await axiosInstance.get(`/users?email=${data.email}`);
    const users = response.data;
    if (!users.length) {
      return {
        success: false,
        message: "User not found",
      };
    }
    const user = users[0];
    if (user.password !== data.password) {
      return {
        success: false,
        message: "Invalid password",
      };
    }
    return {
      success: true,
      data: user,
    };
  } catch (error) {
    console.error("Login API Error:", error);
    return {
      success: false,
      message: "Something went wrong",
    };
  }
};

export const updateUser = async (id, data) => {
  try {
    const response = await axiosInstance.patch(`/users/${id}`, data);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Update User API Error:", error);

    return {
      success: false,
      message: "Profile update failed",
    };
  }
};

