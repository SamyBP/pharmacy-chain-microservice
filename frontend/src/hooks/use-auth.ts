import { AuthContext, type AuthState } from "@/contexts/AuthContext";
import { useContext } from "react";

export const useAuth = (): AuthState => {
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error("useAuth must be used withing AuthProvider")
    }

    return context
}