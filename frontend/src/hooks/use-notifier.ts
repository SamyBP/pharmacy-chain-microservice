import { useNotifications } from "@toolpad/core";

export type NotificationSeverity = 'error' | 'info' | 'success' | 'warning'

export interface NotificationOptions {
    duration?: number 
}

export interface ToastNotifier {
    info: (message: string, options?: NotificationOptions) => void
    success: (message: string, options?: NotificationOptions) => void
    error: (message: string, options?: NotificationOptions) => void
    warning: (message: string, options?: NotificationOptions) => void
}

export interface ToastNotificationContext {
    notifier: ToastNotifier
}

export function useNotifier(): ToastNotificationContext {
    const notifications = useNotifications()

    const show = (message: string, severity: NotificationSeverity, duration: number = 6000) => {
        notifications.show(message, {
            severity: severity,
            autoHideDuration: duration
        })
    }

    const notifier: ToastNotifier = {
        info: (message, options?) => {
            show(message, 'info', options?.duration)
        },
        success: (message, options?) => {
            show(message, 'success', options?.duration)
        },
        error: (message, options?) => {
            show(message, 'error', options?.duration)
        },
        warning: (message, options?) => {
            show(message, 'warning', options?.duration)
        }
    }

    return { notifier }
}