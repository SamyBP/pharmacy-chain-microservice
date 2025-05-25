import { useAuth } from "@/hooks/use-auth"
import type { UserRole } from "@/types/utils"
import type React from "react"
import { Navigate, Outlet } from "react-router-dom"

export interface ProtectedRouteProps {
    allowedUserRoles: UserRole[]
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedUserRoles }) => {
    const { auth, user } = useAuth()
    
    if (!auth || !user) {
        return <Navigate to='/'/>
    }

    const currentUnixTimestampInSeconds = Math.floor(Date.now() / 1000)

    if (auth.expires_at <= currentUnixTimestampInSeconds) {
        return <Navigate to='/'/>
    }

    return allowedUserRoles.includes(user.info.role) ? <Outlet /> : <Navigate to="/" />
}