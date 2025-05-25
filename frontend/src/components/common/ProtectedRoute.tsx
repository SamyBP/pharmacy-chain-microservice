import { useAuth } from "@/hooks/use-auth"
import type { UserRole } from "@/types/utils"
import type React from "react"
import { Navigate, Outlet } from "react-router-dom"

export interface ProtectedRouteProps {
    allowedUserRoles: UserRole[]
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedUserRoles }) => {
    const { auth, user } = useAuth()
    
    console.log('ProtectedRoute - Auth:', auth)
    console.log('ProtectedRoute - User:', user)
    console.log('ProtectedRoute - Allowed roles:', allowedUserRoles)
    
    if (!auth || !user) {
        console.log('No auth or user, redirecting to /')
        return <Navigate to='/' replace />
    }

    const currentUnixTimestampInSeconds = Math.floor(Date.now() / 1000)
    
    if (auth.expires_at <= currentUnixTimestampInSeconds) {
        console.log('Token expired, redirecting to /')
        return <Navigate to='/' replace />
    }

    const hasPermission = allowedUserRoles.includes(user.info.role)
    console.log('User role:', user.info.role, 'Has permission:', hasPermission)
    
    return hasPermission ? <Outlet /> : <Navigate to="/" replace />
}