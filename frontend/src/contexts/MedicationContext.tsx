import { useHandler } from "@/hooks/use-handler";
import { medicationService } from "@/services/medication-service";
import type { ManufacturerDto, MedicationDto } from "@/types/dtos";
import { createContext, useEffect, useState } from "react";

export interface MedicationContextType {
	medications: MedicationDto[]
	manufacturers: ManufacturerDto[]
	addMedication: (medication: MedicationDto) => void
}

export const MedicationContext = createContext<MedicationContextType | undefined>(undefined)

export const MedicationProvider = ({ children }: { children: React.ReactNode }) => {
	const [medications, setMedications] = useState<MedicationDto[]>([])
	const [manufacturers, setManufacturers] = useState<ManufacturerDto[]>([])
	const { withErrorHandling } = useHandler()

	useEffect(() => {
		withErrorHandling(async () => {
			const [meds, manufacturers] = await Promise.all([
				medicationService.getAllMedications(),
				medicationService.getAllManufacturers()
			]);

			setMedications(meds);
			setManufacturers(manufacturers);
		});
	}, []);

	const addMedication = (medication: MedicationDto) => {
		setMedications(prev => [...prev, medication])
	}

	return (
		<MedicationContext.Provider
			value={{
				medications: medications,
				manufacturers: manufacturers,
				addMedication
			}}
		>
			{children}
		</MedicationContext.Provider>
	);
}
