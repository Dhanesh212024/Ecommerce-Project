import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login, Register } from "../usercontext";
import Dashboard from "../products/dashboardProducts";
import AuthGuard from "./guard/authGuard";
import CheckOut from "../products/checkoutProducts";
import Header from "../component/header";
import UserProfile from "../usercontext/userProfile";
import MyOrders from "../products/myOrders";
import Cart from "../products/cartProducts";

const Router = () => {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/profile"
            element={
              <AuthGuard>
                <UserProfile />
              </AuthGuard>
            }
          />
          <Route
            path="/checkout/:id"
            element={
              <AuthGuard>
                <CheckOut />
              </AuthGuard>
            }
          />
          <Route
            path="/myorders"
            element={
              <AuthGuard>
                <MyOrders />
              </AuthGuard>
            }
          />
          <Route
            path="/cart"
            element={
              <AuthGuard>
                <Cart />
              </AuthGuard>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
};
export default Router;
