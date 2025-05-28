import { MedicationContext, type MedicationContextType } from "@/contexts/MedicationContext";
import { useContext } from "react";

export function useMedication(): MedicationContextType {
  const context = useContext(MedicationContext)

  if (!context) {
    throw new Error("useMedication must be used within MedicationProvider")
  }

  return context
}