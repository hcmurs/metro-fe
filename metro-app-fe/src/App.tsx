import MainRoute from "./routes/MainRoute";
import './App.css'
import { AuthProvider } from "./contexts/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <MainRoute />
    </AuthProvider>
  )
}
