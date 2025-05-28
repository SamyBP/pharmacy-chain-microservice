import type { Pharmacy } from "@/types/models";
import { createContext } from "react";

import pharmacyImage00 from "@/assets/images/pharmacy_00.jpg";
import pharmacyImage01 from "@/assets/images/pharmacy_01.jpg";
import pharmacyImage02 from "@/assets/images/pharmacy_02.jpg";


export interface AppPharmacies {
	pharmacies: Pharmacy[]
}

export const PharmacyContext = createContext<AppPharmacies>({ pharmacies: [] })

export const PharmacyProvider = ({ children }: { children: React.ReactNode }) => {
	const data: Pharmacy[] = [
        {
            id: 1,
            name: "Central Pharmacy",
            address: "123 Main St, Downtown",
            contact: "+1 (555) 123-4567",
            image: pharmacyImage00
        },
        {
            id: 2,
            name: "Westside Pharmacy",
            address: "456 West Ave, Westpark",
            contact: "+1 (555) 234-5678",
            image: pharmacyImage01
        },
        {
            id: 3,
            name: "Eastside Pharmacy",
            address: "789 East Blvd, Eastview",
            contact: "+1 (555) 345-6789",
            image: pharmacyImage02
        }
    ]

	return (
		<PharmacyContext.Provider value={{ pharmacies: data }}>
			{children}
		</PharmacyContext.Provider>
	)
}
