import type { ObtainTokenDto, TokenDto, UserProfile } from "@/types/dtos";
import { http } from "./http-client";

const USER_SERVICE_API_BASE_URL = "http://localhost:8001/api"

export interface UserService {
    getAuthToken: (payload: ObtainTokenDto) => Promise<TokenDto>
    getUserProfile: () => Promise<UserProfile>
}

export const userService: UserService = {
    getAuthToken: _getAuthToken,
    getUserProfile: _getUserProfile
}

function _getAuthToken(payload: ObtainTokenDto): Promise<TokenDto> {
    return http.post<ObtainTokenDto, TokenDto>(`${USER_SERVICE_API_BASE_URL}/auth/token`, payload)
}

function _getUserProfile(): Promise<UserProfile> {
    return http.get<UserProfile>(`${USER_SERVICE_API_BASE_URL}/users/profile`, {
        withAuth: true
    })
}

