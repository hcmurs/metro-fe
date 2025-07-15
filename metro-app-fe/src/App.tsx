import { BrowserRouter } from "react-router-dom";
import "./App.css";
import ScrollToTop from "./components/ScrollToTop";
import { AuthProvider } from "./contexts/AuthContext";
import MainRoute from "./routes/MainRoute";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <MainRoute />
      </AuthProvider>
    </BrowserRouter>
  );
}
