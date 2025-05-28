import "@/App.css";
import LandingPage from "@/pages";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";
import AdminLayout from "@/components/layouts/AdminLayout";
import { AuthProvider } from "./contexts/AuthContext";
import CompleteAccount from "./pages/complete-account";
import DiscoverMedications from "./pages/discover-medications";
import ManagerLayout from "./components/layouts/ManagerLayout";
import EmployeeLayout from "./components/layouts/EmployeeLayout";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route element={<LandingPage />} path="/" />
          <Route element={<CompleteAccount />} path="/complete-account" />
          <Route element={<DiscoverMedications />} path="/discover-medications" />

          {/* Test protected route */}
          <Route element={<ProtectedRoute allowedUserRoles={["ADMIN"]} />}>
            <Route element={<div>Hello</div>} path="/protected-test" />
            <Route element={<AdminLayout />} path="/admin" />
          </Route>

          <Route element={<ProtectedRoute allowedUserRoles={['MANAGER']} />} >
            <Route element={<ManagerLayout />} path="/manager" />
          </Route>

          <Route element={<ProtectedRoute allowedUserRoles={['EMPLOYEE']} />} >
            <Route element={<EmployeeLayout />} path="/employee" />
          </Route>


        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}