import {
  BarChart as ChartIcon,
  PersonAdd as InviteIcon,
  People as UserIcon
} from '@mui/icons-material';
import React from 'react';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

import { AppHeader, type MenuItem } from "@/components/header/AppHeader";

export const AdminHeader: React.FC = () => {
  const menuItems: MenuItem[] = [
    {
      id: 'adminDashboard',
      label: 'Dashboard',
      icon: <ChartIcon />,
      onClick: () => {
        window.location.href = "/admin#adminDashboard"
      },
    },
    {
      id: 'users',
      label: 'Users',
      icon: <UserIcon />,
      onClick: () => {
        window.location.href = "/admin#users"
      },
    },
    {
      id: 'invite',
      label: 'Invite',
      icon: <InviteIcon />,
      onClick: () => {
        window.location.href = "/admin#invite"
      },
    },
    {
      id: 'adminExportUsers',
      label: 'Download users',
      icon: <CloudDownloadIcon />,
      onClick: () => {
        window.location.href = "/admin#export-users"
      },
    }
  ];

  return <AppHeader menuItems={menuItems} />;
};