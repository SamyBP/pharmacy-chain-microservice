import type { CompleteRegistrationDto, DefaultApiResponse, InviteUserDto, ObtainTokenDto, TokenDto, UpdateUserDto, UserDto, UserProfile } from "@/types/dtos";
import { http } from "./http-client";

const USER_SERVICE_API_BASE_URL = "http://localhost:8001/api"

export interface UserService {
	getAuthToken: (payload: ObtainTokenDto) => Promise<TokenDto>
	getUserProfile: (token: string) => Promise<UserProfile>
	getUsers: () => Promise<UserDto[]>
	deleteUser: (userId: number) => Promise<unknown>
	updateUser: (userId: number, payload: UpdateUserDto) => Promise<UserDto>
	inviteUser: (invitation: InviteUserDto) => Promise<DefaultApiResponse>
	register: (payload: CompleteRegistrationDto) => Promise<DefaultApiResponse>
}

export const userService: UserService = {
	getAuthToken: _getAuthToken,
	getUserProfile: _getUserProfile,
	getUsers: _getUsers,
	deleteUser: _deleteUser,
	updateUser: _updateUser,
	inviteUser: _inviteUser,
	register: _completeRegistration
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

function _deleteUser(userId: number): Promise<unknown> {
	return http.delete(`${USER_SERVICE_API_BASE_URL}/users/${userId}`, {
		withAuth: true
	})
}

function _updateUser(userId: number, payload: UpdateUserDto) {
	return http.patch<UpdateUserDto, UserDto>(`${USER_SERVICE_API_BASE_URL}/users/${userId}`, payload, {
		withAuth: true
	})
}

function _inviteUser(invitation: InviteUserDto) {
	return http.post<InviteUserDto, DefaultApiResponse>(`${USER_SERVICE_API_BASE_URL}/users/invite`, invitation, {
		withAuth: true
	})
}

function _completeRegistration(payload: CompleteRegistrationDto) {
	return http.post<CompleteRegistrationDto, DefaultApiResponse>(`${USER_SERVICE_API_BASE_URL}/users/invite/complete`, payload)
}