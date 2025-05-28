import { PharmacyContext, type AppPharmacies } from "@/contexts/PharmacyContext";
import { useContext } from "react";

export function usePharmacies(): AppPharmacies {
  const context = useContext(PharmacyContext)

  if (!context) {
    throw new Error("usePharmacies must be used within a PharmacyProvider")
  }

  return context
}