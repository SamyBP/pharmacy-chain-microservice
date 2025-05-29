import { isHttpException } from "@/services/http-client";
import type { UserRole } from "@/types/utils";
import { settings } from "./settings";

export function getAcronym(value: string): string {
	return value.split(/\s/).reduce((response, word) => response += word.slice(0, 1), '')
}

const rolePaths = {
	ADMIN: '/admin',
	MANAGER: '/manager',
	EMPLOYEE: '/employee'
}

export function getPathBasedOnRole(role: UserRole): string {
	return rolePaths[role]
}

export function getMedicationImageFullUrl(shortUrl: string): string {
	return `${settings.media}/${shortUrl}`
}

export function getExportFilename(): string {
	const timestamp = Math.floor(Date.now() / 1000)
	return `file_${timestamp}`
}


export interface ErrorHandler {
	getErrorMessage: (error: unknown) => string
}

export const errorHandler: ErrorHandler = {
	getErrorMessage: (error: unknown) => {
		if (isHttpException(error)) {
			console.log(error)
			return String((error as { error: unknown }).error);
		} else if (typeof error === "object" && error !== null && "message" in error) {
			return String((error as { message: unknown }).message);
		} else {
			return "Unknown error";
		}
	}
}
