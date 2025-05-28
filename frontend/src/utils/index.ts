import { isHttpException } from "@/services/http-client";
import type { UserRole } from "@/types/utils";

export function getAcronym(value: string): string {
    return value.split(/\s/).reduce((response,word)=> response+=word.slice(0,1),'')
}

const rolePaths = {
    ADMIN: '/admin',
    MANAGER: '/manager',
    EMPLOYEE: '/employee'
}

export function getPathBasedOnRole(role: UserRole): string {
    return rolePaths[role]
}

export interface ErrorHandler {
    getErrorMessage: (error: unknown) => string
}

export const errorHandler: ErrorHandler = {
    getErrorMessage: (error: unknown) => {
        if (isHttpException(error)) {
            return String((error as { error: unknown }).error);
        } else if (typeof error === "object" && error !== null && "message" in error) {
            return String((error as { message: unknown }).message);
        } else {
            return "Unknown error";
        }
    }
}
