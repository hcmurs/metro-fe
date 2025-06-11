import { Navigate, Route, Routes } from "react-router-dom";
import { FE_PATH } from "../constants/path";
import DefaultLayout from "../layouts/DefaultLayout/DefaultLayout";
import Admin from "../pages/admin/Admin";
import Dashboard from "../pages/admin/components/Dashboard/Dashboard";
import Station from "../pages/admin/components/Station/Station";
import UserManagement from "../pages/admin/components/User/UserManagement";
import NewsPage from "../pages/Blogs/Blogs";
import NewsDetail from "../pages/BlogsDetail";
import Home from "../pages/Home";
import SocialLoginPopup from "../pages/login/components/socialLoginPopup/SocialLoginPopup";
import LoginPage from "../pages/login/LoginPage";
import PublicRoute from "./PublicRoute";

export default function MainRoute() {
  return (
    <div className="max-w-screen">
      <Routes>
        {/* Routes with header and footer */}
        <Route element={<DefaultLayout />}>
          <Route path={FE_PATH.HOME} element={<Home />} />
          <Route path={FE_PATH.NEWS} element={<NewsPage />} />
          <Route path={FE_PATH.NEWS_DETAIL} element={<NewsDetail />} />

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
      </Routes>
    </div>
  );
}
