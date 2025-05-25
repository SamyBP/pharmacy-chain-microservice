import "@/App.css";
import LandingPage from "@/pages";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/common/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route element={<LandingPage />} path="/" />
        
        {/* Test protected route */}
        <Route element={<ProtectedRoute allowedUserRoles={["ADMIN"]} />}>
          <Route element={<LandingPage />} path="/auth" />
        </Route>
      
      </Routes>
    </BrowserRouter>
  )
}