import { Box, Button, Stack } from '@mui/material';
import React from 'react';

interface HeroSectionProps {
  discoverButtonText?: string,
  accessAccountButtonText?: string
}


export const HeroSection: React.FC<HeroSectionProps> = ({ discoverButtonText = 'Discover', accessAccountButtonText = "Access your account" }) => (
  <Box
    sx={{
      minHeight: '90vh',
      width: '100vw',
      backgroundImage: "linear-gradient(54deg,rgba(39, 44, 48, 1) 63%, rgba(94, 89, 97, 1) 99%);",
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
        zIndex: 1,
      },
    }}
  >
    <Stack
      spacing={2}
      direction={{ xs: 'column', sm: 'row' }}
      sx={{ zIndex: 2, width: { xs: '90%', sm: 'auto' } }}
    >
      <Button
        variant="outlined"
        fullWidth
        sx={{
          color: 'primary.light',
          borderColor: 'primary.light',
          fontSize: '16px',
          textTransform: 'none',
          minWidth: '150px',
          height: '36px',
          padding: '6px 16px',
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderColor: 'primary.light',
          },
        }}
      >
        {discoverButtonText}
      </Button>
      <Button
        variant="contained"
        fullWidth
        size="small"
        sx={{
          backgroundColor: 'primary.light',
          color: 'primary.main',
          fontSize: '16px',
          textTransform: 'none',
          minWidth: '250px',
          height: '36px',
          padding: '6px 16px',
          '&:hover': {
            backgroundColor: '#e2e6eb',
          },
        }}
      >
        {accessAccountButtonText}
      </Button>
    </Stack>
  </Box>
);
