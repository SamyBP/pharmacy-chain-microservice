import {
    PersonAdd as InviteIcon,
    People as UserIcon
} from '@mui/icons-material';
import {
    Box,
    Button,
    Typography
} from '@mui/material';
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
        // Add your navigation logic here
        // Example: navigate('/admin/users');
      },
    },
    {
      id: 'invite',
      label: 'Invite',
      icon: <InviteIcon />,
      onClick: () => {
        console.log('Navigate to Invite');
        // Add your navigation logic here
        // Example: navigate('/admin/invite');
      },
    },
  ];

  const endComponent = (
    <Box display="flex" alignItems="center" gap={2}>
      <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
        Admin Panel
      </Typography>
      <Button
        variant="outlined"
        size="small"
        onClick={() => console.log('Admin action')}
        sx={{
          borderColor: 'currentColor',
          color: 'inherit',
          '&:hover': {
            borderColor: 'primary.main',
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        }}
      >
        Settings
      </Button>
    </Box>
  );

  return <AppHeader menuItems={menuItems} endComponent={endComponent} />;
};