import { useSelector } from "react-redux";
import jwtDecode from "jwt-decode";
import { selectCurrentToken } from "../scenes/auth/authSlice";

const useAuth = () => {
  const token = useSelector(selectCurrentToken);
  let isEmployee = false;
  let isAdmin = false;
  let status = "customer";

  if (token) {
    const decoded = jwtDecode(token);
    const { username, role } = decoded.UserInfo;

    isEmployee = role.includes("employee");
    isAdmin = role.includes("admin");

    if (isEmployee) status = "employee";
    if (isAdmin) status = "admin";

    return { username, role, status, isEmployee, isAdmin };
  }

  return { username: "", roles: [], status, isEmployee, isAdmin };
};

export default useAuth;
