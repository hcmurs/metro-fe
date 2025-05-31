import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";
import Admin from "../pages/admin/Admin";
import Dashboard from "../pages/admin/components/Dashboard/Dashboard";
import Station from "../pages/admin/components/Station/Station";
import UserManagement from "../pages/admin/components/User/UserManagement";
import Home from "../pages/Home";
import NewsPage from "../pages/News/News";
import NewsDetail from "../pages/NewsDetail";

export default function MainRoute() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/news/:id" element={<NewsDetail />} />
        <Route path="/admin" element={<Admin />}>
          <Route path="" element={<Dashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="route" element={<Station />} />
        </Route>
        <Route path="/" element={<Navigate to="/home" replace />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
