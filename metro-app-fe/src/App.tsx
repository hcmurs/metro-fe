import MainRoute from "./routes/MainRoute";
import './App.css'
import { AuthProvider } from "./contexts/AuthContext";
import { BrowserRouter } from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MainRoute />
      </AuthProvider>
    </BrowserRouter>
  )
}
