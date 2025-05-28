import {
  PersonAdd as InviteIcon,
  People as UserIcon
} from '@mui/icons-material';
import React from 'react';

import { AppHeader, type MenuItem } from "@/components/header/AppHeader";

export const AdminHeader: React.FC = () => {
  const menuItems: MenuItem[] = [
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
  ];

  return <AppHeader menuItems={menuItems}/>;
};