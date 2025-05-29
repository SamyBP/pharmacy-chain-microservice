import type { CreateMedicationRequest, ManufacturerDto, MedicationDto } from "@/types/dtos";
import { http } from "./http-client";
import { settings } from "@/utils/settings";

const MEDICATION_SERVICE_BASE_URL = settings.api.medication

export interface MedicationService {
  getAllMedications: () => Promise<MedicationDto[]>
  getAllManufacturers: () => Promise<ManufacturerDto[]>
  createMedication: (payload: CreateMedicationRequest, images: File[]) => Promise<MedicationDto>;
}

export const medicationService: MedicationService = {
  getAllMedications: _getALlMedications,
  getAllManufacturers: _getAllManufacturers,
  createMedication: _createMedication
}


function _getALlMedications() {
  return http.get<MedicationDto[]>(`${MEDICATION_SERVICE_BASE_URL}/medications/`)
}

function _getAllManufacturers() {
  return http.get<ManufacturerDto[]>(`${MEDICATION_SERVICE_BASE_URL}/medications/manufacturers/`)
}

function _createMedication(payload: CreateMedicationRequest, images: File[]) {
  return http.multipart<CreateMedicationRequest, MedicationDto>(
      `${MEDICATION_SERVICE_BASE_URL}/medications`,
      payload,
      images,
      { withAuth: true }
  );
}

