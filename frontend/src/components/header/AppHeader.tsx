import { useAuth } from '@/hooks/use-auth';
import { getAcronym } from '@/utils';
import { Logout as LogoutIcon } from '@mui/icons-material';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar,
  Avatar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export interface MenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  divider?: boolean;
}

interface AppHeaderProps {
  menuItems?: MenuItem[];
  menuWidth?: number;
  isBlured?: boolean
}

export const AppHeader: React.FC<AppHeaderProps> = ({ 
  menuItems = [],
  menuWidth = 280,
  isBlured = false
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { logout, user} = useAuth();
  const navigate = useNavigate()

  if (!user) {
      navigate("/")
      return
  }

  const backdropFilterStyle = isBlured ? 'blur(20px)' : 'none'

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
    setMenuOpen(false);
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={scrolled ? 4 : 0}
        sx={{
          overflow: "hidden",
          zIndex: 1300,
          backgroundColor: scrolled
            ? 'rgba(255, 255, 255, 0.75)'
            : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : backdropFilterStyle,
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
            
            {/* Logo with Link */}
            <Box
              component={Link}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                textDecoration: 'none',
                color: 'inherit',
                '&:hover': {
                  opacity: 0.9
                }
              }}
            >
              <LocalPharmacyIcon fontSize="large" />
              <Typography variant="h6" fontWeight={700} letterSpacing={1}>
                [LOGO]
              </Typography>
            </Box>
          </Box>

          <Box>
            <Box display='flex' alignItems='center' gap={4}>
              <Tooltip title="Logout">
                  <IconButton
                    onClick={logout}
                    size="small"
                    sx={{
                      color: 'inherit',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                      },
                      gap:1
                    }}
                  >
                    Logout
                    <LogoutIcon />
                  </IconButton>
              </Tooltip>
            </Box>
          </Box>
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
          <Box sx={{ px: 2, pb: 2}}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                sx={{
                width: 36,
                height: 36,
                bgcolor: 'primary.main',
                fontSize: 16
              }}
              >
                {getAcronym(user.info.name)}
              </Avatar>  

            
            <Stack spacing={0.5} sx={{ color: 'grey.400', fontSize: 16 }}>
                <Typography variant="body2">
                  {user.info.email}
                </Typography>
                <Typography variant="body2">
                  {user.info.phone_number}
                </Typography>
              </Stack>
            </Stack>
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