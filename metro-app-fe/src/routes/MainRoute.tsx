import { Navigate, Route, Routes } from "react-router-dom";
import { FE_PATH } from "../constants/path";
import DefaultLayout from "../layouts/DefaultLayout/DefaultLayout";
import Admin from "../pages/admin/Admin";
import Dashboard from "../pages/admin/components/Dashboard/Dashboard";
import Station from "../pages/admin/components/Station/Station";
import UserManagement from "../pages/admin/components/User/UserManagement";
import NewsPage from "../pages/Blogs/Blogs";
import NewsDetail from "../pages/BlogsDetail";
import BuyTicket from "../pages/BuyTicket/BuyTicket";
import Order from "../pages/Order";
import Home from "../pages/Home";
import PaymentSuccess from "../pages/PaymentSuccess";
import PaymentFailure from "../pages/PaymentFailure";
import MyTickets from "../pages/MyTickets";
import SocialLoginPopup from "../pages/Login/components/socialLoginPopup/SocialLoginPopup";
import LoginPage from "../pages/Login/LoginPage";
import PublicRoute from "./PublicRoute";
import RegisterPage from "../pages/Register/RegisterPage";
import ProfilePage from "../pages/Profile/ProfilePage";
import PrivateRoute from "./PrivateRoute";
import HeaderLayout from "../layouts/HeaderLayout/HeaderLayout";
import VerifyRequestPage from "../pages/VerifyRequestPage/VerifyRequestPage";
import AdminRoute from "./AdminRoute";
import ManageFeedbackPage from "../pages/ManageFeedback/ManageFeedbackPage";

export default function MainRoute() {
  return (
      <Routes>
        {/* Routes with header and footer */}
        <Route element={<DefaultLayout />}>
          <Route path={FE_PATH.HOME} element={<Home />} />
          <Route path={FE_PATH.NEWS} element={<NewsPage />} />
          <Route path={FE_PATH.NEWS_DETAIL} element={<NewsDetail />} />
          <Route path={FE_PATH.BUY_TICKET} element={<BuyTicket />} />
          <Route path={FE_PATH.ORDER} element={<Order />} />
          <Route path={FE_PATH.MY_TICKETS} element={<MyTickets />} />
          <Route path={FE_PATH.PAYMENT_SUCCESS} element={<PaymentSuccess />} />
          <Route path={FE_PATH.PAYMENT_FAILURE} element={<PaymentFailure />} />

        <Route path={FE_PATH.ADMIN} element={<Admin />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="route" element={<Station />} />
        </Route>

        <Route path="/" element={<Navigate to={FE_PATH.HOME} replace />} />
      </Route>

      {/* Route without header and footer */}
      <Route
        path={FE_PATH.LOGIN}
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path={FE_PATH.SOCIAL_LOGIN_REDIRECT}
        element={
          <PublicRoute>
            <SocialLoginPopup />
          </PublicRoute>
        }
      />
      <Route
        path={FE_PATH.REGISTER}
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />

      {/* Layout with only header */}
      <Route element={<HeaderLayout />}>
        <Route
          path={FE_PATH.PROFILE}
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />

        <Route
          path={FE_PATH.VERIFY_REQUEST}
          element={
            <AdminRoute>
              <VerifyRequestPage />
            </AdminRoute>
          }
        />

        <Route
          path={FE_PATH.MANAGE_FEEDBACK}
          element={
            <AdminRoute>
              <ManageFeedbackPage />
            </AdminRoute>
          }
        />
      </Route>
    </Routes>
  );
}
