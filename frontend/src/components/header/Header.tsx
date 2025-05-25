import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Box, Typography } from '@mui/material';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';

interface HeaderProps {
  endComponent?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ endComponent }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AppBar
      position="fixed"
      elevation={scrolled ? 4 : 0}
      sx={{
        overflow: "hidden",
        zIndex: 1300, // always on top (above modal etc)
        backgroundColor: scrolled
          ? 'rgba(255, 255, 255, 0.75)'
          : 'transparent', // semi-transparent hero gradient base color
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        color: scrolled ? 'primary.main' : 'primary.light',
        transition: 'background-color 0.3s ease, color 0.3s ease, backdrop-filter 0.3s ease',
      }}
    >
      <Toolbar
        sx={{
          maxWidth: 1200,
          width: '100%',
          margin: '0 auto',
          px: 2,
          minHeight: 64,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <LocalPharmacyIcon fontSize="large" />
          <Typography variant="h6" fontWeight={700} letterSpacing={1}>
            [LOGO]
          </Typography>
        </Box>

        <Box>{endComponent}</Box>
      </Toolbar>
    </AppBar>
  );
};
