import axios from "axios";


const axiosInstance = axios.create( {

     baseURL: "https://ecommerce-json-c28s.onrender.com/",
     headers:  { 
        "Content-Type": "application/json",
     },
     timeout: 20000,

});
export default axiosInstance;

