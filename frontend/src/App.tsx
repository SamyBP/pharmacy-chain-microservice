import { Box, Button, Container } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';

// ...existing imports...

// Add this at the top of your file, after imports
const fullScreenStyle = {
  margin: 0,
  padding: 0,
  minHeight: '100vh',
  minWidth: '100vw',
  overflow: 'hidden',
};

const backgroundImages = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
  'https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
];

const theme = createTheme({
  // ...existing theme config...
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          padding: 0,
        },
      },
    },
  },
});

const LandingPage: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 5000); // Changes every 5 seconds
    return () => clearInterval(interval);
  }, []);



  return (
    <ThemeProvider theme={theme}>
      <Box 
        sx={{ 
          ...fullScreenStyle,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        {/* Background image layers */}
        {backgroundImages.map((url, index) => (
          <Box
            key={index}
            sx={{
              backgroundImage: `url(${url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: index === currentIndex ? 1 : 0,
              transition: 'opacity 2s ease-in-out',
              zIndex: 0,
            }}
          />
        ))}

        {/* Content overlay - update Container styles */}
        <Container
          maxWidth={false}
          sx={{
            position: 'relative',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
            padding: 0,
            margin: 0,
          }}
        >
          <Button
              variant="contained"
              size="large"
              sx={{
                fontSize: '1.2rem',
                padding: '12px 32px',
                backgroundColor: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              }}
            >
              Login
            </Button>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default LandingPage