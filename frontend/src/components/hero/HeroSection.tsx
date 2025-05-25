import { useAuth } from '@/hooks/use-auth';
import { isHttpException } from '@/services/http-client';
import { userService } from '@/services/user-service';
import { Close as CloseIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  IconButton,
  Modal,
  Paper,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import React, { useState } from 'react';

interface HeroSectionProps {
  discoverButtonText?: string,
  accessAccountButtonText?: string
}

export const HeroSection: React.FC<HeroSectionProps> = ({ 
  discoverButtonText = 'Discover', 
  accessAccountButtonText = "Access your account" 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth()

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEmail('');
    setPassword('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempted with:', { email, password });

    try {
      const formData = {principal: email, password: password}
      const token = await userService.getAuthToken(formData)
      const user = await userService.getUserProfile()
      login(token, user)
      console.log(token)
    } catch (error: unknown) {
      if (isHttpException(error)) {
        console.log(error.error)
      } else if (typeof error === "object" && error !== null && "message" in error) {
        console.log(error.message) 
      } else {
        console.log("what is going on here????")
      }
    }

    handleCloseModal();
  };

  return (
    <>
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
            onClick={handleOpenModal}
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

      {/* Login Modal */}
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        BackdropProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            transition: 'opacity 0.3s ease-in-out',
          }
        }}
      >
        <Paper
          sx={{
            width: '80vw',
            height: '90vh',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            outline: 'none',
            transform: isModalOpen ? 'scale(1)' : 'scale(0.8)',
            opacity: isModalOpen ? 1 : 0,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {/* Modal Header */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 3,
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant="h5" component="h2">
              Login to Your Account
            </Typography>
            <IconButton onClick={handleCloseModal}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Modal Content */}
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 3,
            }}
          >
            <form onSubmit={handleLogin} style={{ width: '100%', maxWidth: '400px' }}>
              <Stack spacing={3}>
                <TextField
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  fullWidth
                  variant="outlined"
                />
                <TextField
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  fullWidth
                  variant="outlined"
                />
                <Button
                  type="submit"
                  variant="contained"
                  size="small"
                  fullWidth
                  sx={{
                    mt: 2,
                    fontSize: '16px',
                    textTransform: 'none',
                    height: '48px',
                  }}
                >
                  Login
                </Button>
              </Stack>
            </form>
          </Box>
        </Paper>
      </Modal>
    </>
  );
};