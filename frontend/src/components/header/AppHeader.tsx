import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';

export interface MenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  divider?: boolean; // Add divider after this item
}

interface AppHeaderProps {
  endComponent?: React.ReactNode;
  menuItems?: MenuItem[];
  menuWidth?: number;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ 
  endComponent, 
  menuItems = [],
  menuWidth = 280 
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleMenuItemClick = (item: MenuItem) => {
    if (item.onClick) {
      item.onClick();
    }
    setMenuOpen(false); // Close menu after clicking an item
  };

  return (
    <>
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
          {/* Menu Button */}
          <Box display="flex" alignItems="center" gap={1}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleMenu}
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
            
            {/* Logo */}
            <LocalPharmacyIcon fontSize="large" />
            <Typography variant="h6" fontWeight={700} letterSpacing={1}>
              [LOGO]
            </Typography>
          </Box>

          <Box>{endComponent}</Box>
        </Toolbar>
      </AppBar>

      {/* Side Drawer Menu */}
      <Drawer
        anchor="left"
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: menuWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Box
          sx={{ 
            width: menuWidth,
            pt: 2,
          }}
          role="presentation"
        >
          {/* Menu Header */}
          <Box sx={{ px: 2, pb: 2 }}>
            <Box display="flex" alignItems="center" gap={1}>
              <LocalPharmacyIcon color="primary" fontSize="large" />
              <Typography variant="h6" fontWeight={700} color="primary">
                [LOGO]
              </Typography>
            </Box>
          </Box>
          
          <Divider />
          
          {/* Menu Items */}
          <List>
            {menuItems.map((item) => (
              <React.Fragment key={item.id}>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => handleMenuItemClick(item)}
                    sx={{
                      py: 1.5,
                      '&:hover': {
                        backgroundColor: 'primary.light',
                        '& .MuiListItemText-primary': {
                          color: 'primary.main',
                        },
                      },
                    }}
                  >
                    {item.icon && (
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        {item.icon}
                      </ListItemIcon>
                    )}
                    <ListItemText 
                      primary={item.label}
                      primaryTypographyProps={{
                        fontWeight: 500,
                      }}
                    />
                  </ListItemButton>
                </ListItem>
                {item.divider && <Divider sx={{ my: 1 }} />}
              </React.Fragment>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
};