import MedicationIcon from '@mui/icons-material/Medication';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import React from 'react';

import { AppHeader, type MenuItem } from "@/components/header/AppHeader";

export const EmployeeHeader: React.FC = () => {
  const menuItems: MenuItem[] = [
    {
      id: 'employeePharmacyMedications',
      label: 'Medications',
      icon: <MedicationIcon />,
      onClick: () => {
        window.location.href = "/employee#medications"
      },
    },
    {
      id: 'employeePlaceSale',
      label: 'Sales',
      icon: <ShowChartIcon />,
      onClick: () => {
        window.location.href = "/employee#sales"
      },
    },
    {
      id: 'employeeUpdateInventory',
      label: 'Inventory',
      icon: <SyncAltIcon />,
      onClick: () => {
        window.location.href = "/employee#inventory"
      },
    }
  ];

  return <AppHeader menuItems={menuItems} />;
};