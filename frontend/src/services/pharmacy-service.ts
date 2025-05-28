import type { DefaultApiResponse, MedicationDto, MedicationSaleRequest, MostSoldMedicationDto, RegisterInventoryRequest, SaleTrendDto } from "@/types/dtos"
import { http } from "./http-client"

const PHARMACY_SERVICE_BASE_API_URL = "http://localhost:8000/api"

export interface PharmacyService {
  getMostSoldMedcations: () => Promise<MostSoldMedicationDto[]>
  getSaleTrends: () => Promise<SaleTrendDto[]>
  registerMedicationInPharmacyInventory: (pharmacyId: number, payload: RegisterInventoryRequest) => Promise<DefaultApiResponse>
  getMedicationsFromEmployeesPharmacy: (pharmacy_id: number) => Promise<MedicationDto[]>
  performMedicationSale: (pharmacy_id: number, payload: MedicationSaleRequest) => Promise<DefaultApiResponse>
  updatePharmacyInventory: (pharmacy_id: number, payload: RegisterInventoryRequest) => Promise<DefaultApiResponse>
}

export const pharmacyService: PharmacyService = {
  getMostSoldMedcations: _getMostSoldMedications,
  getSaleTrends: _getSaleTrends,
  registerMedicationInPharmacyInventory: _registerMedicationInPharmacyInventory,
  getMedicationsFromEmployeesPharmacy: _getMedicationsFromEmployeesPharmacy,
  performMedicationSale: _performMediactionSale,
  updatePharmacyInventory: _updatePharmacyInventory
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

function _getMedicationsFromEmployeesPharmacy(pharmacy_id: number){
  const endpoint = `${PHARMACY_SERVICE_BASE_API_URL}/pharmacies/e/${pharmacy_id}/medications`
  return http.get<MedicationDto[]>(endpoint, {
    withAuth: true
  })
}

function _performMediactionSale(pharmacy_id: number, payload: MedicationSaleRequest) {
  const endpoint = `${PHARMACY_SERVICE_BASE_API_URL}/pharmacies/e/${pharmacy_id}/sales`
  return http.post<MedicationSaleRequest, DefaultApiResponse>(endpoint, payload, {
    withAuth: true
  })
}

function _updatePharmacyInventory(pharmacy_id: number, payload: RegisterInventoryRequest) {
  const endpoint = `${PHARMACY_SERVICE_BASE_API_URL}/pharmacies/e/${pharmacy_id}/inventory`
  return http.patch<RegisterInventoryRequest, DefaultApiResponse>(endpoint, payload, {
    withAuth: true
  })
}
