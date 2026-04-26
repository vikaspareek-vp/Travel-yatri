import { Navigate, Outlet } from "react-router-dom";

type Props = {
  isLoggedIn: boolean;
  role: string;
};

const AdminRoute = ({ isLoggedIn, role }: Props) => {
    console.log("AdminRoute Check:", isLoggedIn, role);
  if (!isLoggedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  if (role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;