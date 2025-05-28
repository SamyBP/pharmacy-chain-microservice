import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import {
  NotificationsProvider,
} from '@toolpad/core/useNotifications';
import { PharmacyProvider } from './contexts/PharmacyContext.tsx';

const theme = createTheme({
  palette: {
    primary: {
      main: "#272C30",
      light: "#ffffff",
    },
    secondary: {
      main: "#5E5961"
    }
  }
})


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
        <NotificationsProvider>
          <PharmacyProvider>
            <App />
          </PharmacyProvider>
        </NotificationsProvider>
    </ThemeProvider>
  </StrictMode>,
)
