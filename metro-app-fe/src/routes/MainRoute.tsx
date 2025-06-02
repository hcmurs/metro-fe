import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Admin from "../pages/admin/Admin";
import Dashboard from "../pages/admin/components/Dashboard/Dashboard";
import Station from "../pages/admin/components/Station/Station";
import UserManagement from "../pages/admin/components/User/UserManagement";
import Home from "../pages/Home";
import NewsPage from "../pages/News/News";
import NewsDetail from "../pages/NewsDetail";
import LoginPage from "../pages/login/LoginPage";
import DefaultLayout from "../layouts/DefaultLayout/DefaultLayout";
import SocialLoginPopup from "../pages/login/components/socialLoginPopup/SocialLoginPopup";

export default function MainRoute() {
  return (
    <div className="max-w-screen overflow-x-hidden">
      <BrowserRouter>
        <Routes>
          {/* Routes with header and footer */}
          <Route element={<DefaultLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/news/:id" element={<NewsDetail />} />

            <Route path="/admin" element={<Admin />}>
              <Route index element={<Dashboard />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="route" element={<Station />} />
            </Route>

            <Route path="/" element={<Navigate to="/home" replace />} />
          </Route>

          {/* Route without header and footer */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/oauth2/redirect" element={<SocialLoginPopup />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
