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


export interface ManufacturerDto {
    id: number
    name: string
    contact_info: string
}

export interface MedicationImageDto {
    id: number
    image_url: string
    alt_text: string
}

export interface MedicationDto {
    id: number
    name: string
    description: string
    manufacturer: ManufacturerDto
    images: MedicationImageDto[]
}

export interface MostSoldMedicationDto {
    medication_id: number
    name: string
    quantity: number
    manufacturer: ManufacturerDto
}

export interface SaleTrendDto {
    sale_date: string
    total_sales_amount: number
    number_of_sales: number
}

export interface RegisterInventoryRequest {
    medication_id: number;
    quantity?: number;
    expiration_date?: string;
}

export interface CreateMedicationRequest {
    name: string;
    description: string;
    purchase_price: number;
    manufacturer_id: number;
}