import { AuthContext } from "./authContext";
import { registerUser } from "../../api/users";
import { loginUser } from "../../api/users";
import { useState } from "react";
import { useEffect } from "react";


export default function AuthProvider({ children }) {

  const [authenticated, setAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
  
  const addData = async (data) => {
    try {
      const payload = {
        ...data,
        kycStatus: "pending",
        createdAt: new Date().toISOString(),
      };
      
     const response =  await registerUser(payload);
     console.log("Register Success",response);
      return response;

    } catch (error) {
      console.error(error);
      return { success: false };
    }
  };
  
const login = async (data) => {
    try {
      const response = await loginUser(data);

      if (response?.success) {
        localStorage.setItem("user", JSON.stringify(response.data));
         setUser(response.data); 
        setAuthenticated(true);

        return { success: true };
      }

      return {
        success: false,
        message: "Invalid credentials",
      };

    } catch (error) {
      console.error("Login Error:", error.message);
      return {
        success: false,
        message: error.message,
      };
    }
  };
  
  useEffect(() => {
  const storedUser = localStorage.getItem("user");

  if (storedUser) {
    const parsedUser = JSON.parse(storedUser);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(parsedUser);       
    setAuthenticated(true);
  }
}, []);


  return (
    <AuthContext.Provider value={{ authenticated, setAuthenticated, addData, login, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
