import { Navigate, Route, Routes } from "react-router-dom";
import { FE_PATH } from "../constants/path";
import GlobalRedirectGuard from "../guards/GlobalRedirectGuard";
import DefaultLayout from "../layouts/DefaultLayout/DefaultLayout";
import HeaderLayout from "../layouts/HeaderLayout/HeaderLayout";
import Admin from "../pages/admin/Admin";
import Dashboard from "../pages/admin/components/Dashboard/Dashboard";
import Station from "../pages/admin/components/Station/Station";
import UserManagement from "../pages/admin/components/User/UserManagement";
import NewsPage from "../pages/Blogs/Blogs";
import NewsDetail from "../pages/BlogsDetail";
import BuyTicket from "../pages/BuyTicket/BuyTicket";
import Home from "../pages/Home";
import ManageFeedbackPage from "../pages/ManageFeedback/ManageFeedbackPage";
import MetroMap from "../pages/MetroMap";
import MyTickets from "../pages/MyTickets";
import Order from "../pages/Order";
import PaymentFailure from "../pages/PaymentFailure";
import PaymentSuccess from "../pages/PaymentSuccess";
import ProfilePage from "../pages/Profile/ProfilePage";
import RegisterPage from "../pages/Register/RegisterPage";
import VerifyRequestPage from "../pages/VerifyRequestPage/VerifyRequestPage";
import AdminRoute from "./AdminRoute";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import LoginPage from "../pages/login/LoginPage";
import SocialLoginPopup from "../pages/login/components/socialLoginPopup/SocialLoginPopup";
import BlogManagement from "../pages/admin/components/BlogManagement/BlogManagement";

export default function MainRoute() {
  return (
    <>
      <GlobalRedirectGuard />
      <Routes>
        {/* Routes with header and footer */}
        <Route element={<DefaultLayout />}>
          <Route path={FE_PATH.HOME} element={<Home />} />
          <Route path={FE_PATH.NEWS} element={<NewsPage />} />
          <Route path={FE_PATH.NEWS_DETAIL} element={<NewsDetail />} />
          <Route path={FE_PATH.BUY_TICKET} element={<BuyTicket />} />
          <Route path={FE_PATH.ORDER} element={<Order />} />
          <Route path={FE_PATH.MY_TICKETS} element={<MyTickets />} />
          <Route path={FE_PATH.METRO_MAP} element={<MetroMap />} />
          <Route path={FE_PATH.PAYMENT_SUCCESS} element={<PaymentSuccess />} />
          <Route path={FE_PATH.PAYMENT_FAILURE} element={<PaymentFailure />} />
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
            path={FE_PATH.ADMIN}
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="route" element={<Station />} />
            <Route path="blogs" element={<BlogManagement />} />
            <Route path="requests" element={<VerifyRequestPage />} />
            <Route path="feedbacks" element={<ManageFeedbackPage />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}
