import { errorHandler } from "@/utils";
import { useNotifier } from "./use-notifier";

export function useHandler() {
  const { notifier } = useNotifier();

  const withErrorHandling = async (fn: () => Promise<void>) => {
    try {
      await fn()
    } catch (error: unknown) {
      const errorMessage = errorHandler.getErrorMessage(error)
      notifier.error(errorMessage)
    }
  }

  return { withErrorHandling }
}