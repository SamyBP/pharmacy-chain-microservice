import type { ObtainTokenDto, TokenDto, UserDto, UserProfile } from "@/types/dtos";
import { http } from "./http-client";

const USER_SERVICE_API_BASE_URL = "http://localhost:8001/api"

export interface UserService {
    getAuthToken: (payload: ObtainTokenDto) => Promise<TokenDto>
    getUserProfile: (token: string) => Promise<UserProfile>
    getUsers: () => Promise<UserDto[]>
}

export const userService: UserService = {
    getAuthToken: _getAuthToken,
    getUserProfile: _getUserProfile,
    getUsers: _getUsers
}

function _getAuthToken(payload: ObtainTokenDto): Promise<TokenDto> {
    return http.post<ObtainTokenDto, TokenDto>(`${USER_SERVICE_API_BASE_URL}/auth/token`, payload)
}

function _getUserProfile(token: string): Promise<UserProfile> {
    return http.get<UserProfile>(`${USER_SERVICE_API_BASE_URL}/users/profile`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        withAuth: false
    })
}

function _getUsers(): Promise<UserDto[]> {
    return http.get<UserDto[]>(`${USER_SERVICE_API_BASE_URL}/users`, {
        withAuth: true
    })
}