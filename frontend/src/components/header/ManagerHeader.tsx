import { AppHeader, type MenuItem } from "@/components/header/AppHeader";
import { BarChart as ChartIcon } from '@mui/icons-material';
import InventoryIcon from '@mui/icons-material/Inventory';
import MedicationIcon from '@mui/icons-material/Medication';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import React from 'react';

export const ManagerHeader: React.FC = () => {
	const menuItems: MenuItem[] = [
		{
			id: 'dashboard',
			label: 'Dashboard',
			icon: <ChartIcon />,
			onClick: () => {
				window.location.href = "/manager#dashboard"
			},
		},
		{
			id: 'managerInventory',
			label: 'Inventory',
			icon: <InventoryIcon />,
			onClick: () => {
				window.location.href = "/manager#inventory"
			},
		},
		{
			id: 'managerMedicationRegistration',
			label: 'Create medication',
			icon: <MedicationIcon />,
			onClick: () => {
				window.location.href = "/manager#create-medication"
			},
		},
		{
			id: 'managerExportSection',
			label: 'Download trends',
			icon: <CloudDownloadIcon />,
			onClick: () => {
				window.location.href = "/manager#export-section"
			},
		}
	];

	return <AppHeader menuItems={menuItems} />;
};