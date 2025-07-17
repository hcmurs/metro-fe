import { BrowserRouter } from "react-router-dom";
import "./App.css";
import ScrollToTop from "./components/ScrollToTop";
import { AuthProvider } from "./contexts/AuthContext";
import MainRoute from "./routes/MainRoute";
import { HelmetProvider } from "react-helmet-async";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ErrorBoundary from "./components/ErrorBoundary";
import { LanguageProvider } from "./contexts/LanguageContext";

export default function App() {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <LanguageProvider>
          <BrowserRouter>
            <AuthProvider>
              <ScrollToTop />
              <MainRoute />
            </AuthProvider>
          </BrowserRouter>
        </LanguageProvider>
      </ErrorBoundary>
      <ReactQueryDevtools initialIsOpen={true} />
    </HelmetProvider>
  );
}
