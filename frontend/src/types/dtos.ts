import type { NotificationPreference, Optional, UserRole } from "@/types/utils"

export interface DefaultApiResponse {
    message: string
}

export interface TokenDto {
    token: string
    expires_at: number
}

export interface ObtainTokenDto {
    principal: string
    password: string
}


export interface UserDto {
    id: number
    email: string
    phone_number: string
    role: UserRole
    name: string
    notification_preference: NotificationPreference
}


export interface UserProfile {
    info: UserDto
    pharmacies: number[]
}

export interface UpdateUserDto {
    phone_number: Optional<string>
    name: Optional<string>
}

export interface InviteUserDto {
    email: string
    role: UserRole
    pharmacy_id: number
}

export interface CompleteRegistrationDto {
    invite_token: string
    password: string
    phone_number: string
    name: string
    notification_preference: NotificationPreference
}

