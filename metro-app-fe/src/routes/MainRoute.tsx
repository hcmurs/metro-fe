import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "../components/Header";
import Admin from "../pages/admin/Admin";
import Dashboard from "../pages/admin/components/Dashboard/Dashboard";
import Station from "../pages/admin/components/Station/Station";
import UserManagement from "../pages/admin/components/User/UserManagement";

export default function MainRoute() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Admin />}>
          <Route path="" element={<Dashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="route" element={<Station />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
