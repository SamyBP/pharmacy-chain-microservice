import type { TokenDto, UserProfile } from "@/types/dtos"
import type { Optional } from "@/types/utils"
import { createContext, useState } from "react"


export interface AuthState {
    auth: Optional<TokenDto>
    user: Optional<UserProfile>
    login: (auth: TokenDto, user: UserProfile) => void
    logout: () => void
}

export const AuthContext = createContext<AuthState | undefined>(undefined)


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [auth, setAuth] = useState<Optional<TokenDto>>(null)
    const [user, setUser] = useState<Optional<UserProfile>>(null)

    const login = (auth: TokenDto, user: UserProfile) => {
        sessionStorage.setItem('auth', JSON.stringify(auth))
        setAuth(auth)
        setUser(user)
    }

    const logout = () => {
        sessionStorage.removeItem('auth')
        setAuth(null)
    }

    return (
        <AuthContext.Provider value={{ auth, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

