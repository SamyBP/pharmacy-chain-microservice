import type { TokenDto, UserProfile } from "@/types/dtos"
import type { Optional } from "@/types/utils"
import { createContext, useEffect, useState } from "react"


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
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const storedAuth = sessionStorage.getItem('auth')
        const storedUser = sessionStorage.getItem('user')
        
        if (storedAuth && storedUser) {
            try {
                const parsedAuth = JSON.parse(storedAuth) as TokenDto
                const parsedUser = JSON.parse(storedUser) as UserProfile
                
                const currentUnixTimestampInSeconds = Math.floor(Date.now() / 1000)
                if (parsedAuth.expires_at > currentUnixTimestampInSeconds) {
                    setAuth(parsedAuth)
                    setUser(parsedUser)
                } else {
                    sessionStorage.removeItem('auth')
                    sessionStorage.removeItem('user')
                }
            } catch (error) {
                sessionStorage.removeItem('auth')
                sessionStorage.removeItem('user')
            }
        }
        setIsLoading(false)
    }, [])

    const login = (auth: TokenDto, user: UserProfile) => {
        sessionStorage.setItem('auth', JSON.stringify(auth))
        sessionStorage.setItem('user', JSON.stringify(user))
        setAuth(auth)
        setUser(user)
    }

    const logout = () => {
        sessionStorage.removeItem('auth')
        sessionStorage.removeItem('user')
        setAuth(null)
        setUser(null)
    }

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <AuthContext.Provider value={{ auth, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}
