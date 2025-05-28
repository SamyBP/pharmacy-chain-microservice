import type { DefaultApiResponse, MostSoldMedicationDto, RegisterInventoryRequest, SaleTrendDto } from "@/types/dtos"
import { http } from "./http-client"

const PHARMACY_SERVICE_BASE_API_URL = "http://localhost:8000/api"

export interface PharmacyService {
  getMostSoldMedcations: () => Promise<MostSoldMedicationDto[]>
  getSaleTrends: () => Promise<SaleTrendDto[]>
  registerMedicationInPharmacyInventory: (pharmacyId: number, payload: RegisterInventoryRequest) => Promise<DefaultApiResponse>
}

export const pharmacyService: PharmacyService = {
  getMostSoldMedcations: _getMostSoldMedications,
  getSaleTrends: _getSaleTrends,
  registerMedicationInPharmacyInventory: _registerMedicationInPharmacyInventory
}

function _getMostSoldMedications() {
  return http.get<MostSoldMedicationDto[]>(`${PHARMACY_SERVICE_BASE_API_URL}/pharmacies/m/sales`, {
    withAuth: true
  })
}

function _getSaleTrends() {
  return http.get<SaleTrendDto[]>(`${PHARMACY_SERVICE_BASE_API_URL}/pharmacies/m/sales/trends`, {
    withAuth: true
  })
}

function _registerMedicationInPharmacyInventory(pharmacyId: number, payload: RegisterInventoryRequest) {
  const endpoint = `${PHARMACY_SERVICE_BASE_API_URL}/pharmacies/m/${pharmacyId}/inventory`
  return http.post<RegisterInventoryRequest, DefaultApiResponse>(endpoint, payload, {
    withAuth: true
  })
}


