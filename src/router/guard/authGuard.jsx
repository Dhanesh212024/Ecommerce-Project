import { useContext } from "react";
import { AuthContext } from "../../usercontext/context/authContext";
import { useNavigate } from "react-router-dom";

export default function AuthGuard({ children }) {
  const { authenticated } = useContext(AuthContext);
      const navigate = useNavigate();


  if (!authenticated) {
      navigate("/login", {replace: true});
  }

  return children;
}