import { Navigate, Route, Routes } from "react-router-dom";
import { FE_PATH } from "../constants/path";
import { useAuth } from "../contexts/AuthContext";
import DefaultLayout from "../layouts/DefaultLayout/DefaultLayout";
import HeaderLayout from "../layouts/HeaderLayout/HeaderLayout";
import Admin from "../pages/admin/Admin";
import NewsPage from "../pages/Blogs/Blogs";
import NewsDetail from "../pages/BlogsDetail";
import Home from "../pages/Home";
import LoginPage from "../pages/Login/LoginPage";
import RegisterPage from "../pages/Register/RegisterPage";
import BuyTicket from "../pages/BuyTicket/BuyTicket";
import MetroMap from "../pages/MetroMap";
import MyTickets from "../pages/MyTickets";
import Order from "../pages/Order";
import PaymentSuccess from "../pages/PaymentSuccess";
import PaymentFailure from "../pages/PaymentFailure";
import ProfilePage from "../pages/Profile/ProfilePage";
import Dashboard from "../pages/admin/components/Dashboard/Dashboard";
import Station from "../pages/admin/components/Station/Station";
import UserManagement from "../pages/admin/components/User/UserManagement";
import ManageFeedbackPage from "../pages/ManageFeedback/ManageFeedbackPage";
import ManageTicketPage from "../pages/ManageTicket/ManageTicketPage";
import VerifyRequestPage from "../pages/VerifyRequestPage/VerifyRequestPage";
import RoleRoute from "./RoleRoute";
import { Spin } from "antd";

export default function MainRoute() {
  const { isLoading } = useAuth();

  if (isLoading) return <Spin size="large" fullscreen />

  return (
    <Routes>
      <Route
        element={
          <RoleRoute allowedRoles={["user", "guest"]}>
            <DefaultLayout />
          </RoleRoute>
        }
      >
        <Route path="/" element={<Navigate to={FE_PATH.HOME} replace />} />
        <Route path={FE_PATH.HOME} element={<Home />} />
        <Route path={FE_PATH.NEWS} element={<NewsPage />} />
        <Route path={FE_PATH.NEWS_DETAIL} element={<NewsDetail />} />
        <Route path={FE_PATH.BUY_TICKET} element={<BuyTicket />} />
        <Route path={FE_PATH.ORDER} element={<Order />} />
        <Route path={FE_PATH.MY_TICKETS} element={<MyTickets />} />
        <Route path={FE_PATH.METRO_MAP} element={<MetroMap />} />
        <Route path={FE_PATH.PAYMENT_SUCCESS} element={<PaymentSuccess />} />
        <Route path={FE_PATH.PAYMENT_FAILURE} element={<PaymentFailure />} />

      </Route>

      <Route
        path={FE_PATH.LOGIN}
        element={
          <RoleRoute allowedRoles={["guest"]}>
            <LoginPage />
          </RoleRoute>
        }
      />
      
      <Route
        path={FE_PATH.REGISTER}
        element={
          <RoleRoute allowedRoles={["guest"]}>
            <RegisterPage />
          </RoleRoute>
        }
      />

      <Route element={<HeaderLayout />}>
        <Route
          path={FE_PATH.PROFILE}
          element={
            <RoleRoute allowedRoles={["user"]}>
              <ProfilePage />
            </RoleRoute>
          }
        />

        <Route
          path={FE_PATH.ADMIN}
          element={
            <RoleRoute allowedRoles={["admin"]}>
              <Admin />
            </RoleRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="route" element={<Station />} />
          <Route path="requests" element={<VerifyRequestPage />} />
          <Route path="feedbacks" element={<ManageFeedbackPage />} />
          <Route path="tickets" element={<ManageTicketPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
