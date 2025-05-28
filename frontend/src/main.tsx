import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import {
  NotificationsProvider,
} from '@toolpad/core/useNotifications';
import { PharmacyProvider } from './contexts/PharmacyContext.tsx';
import { MedicationProvider } from './contexts/MedicationContext.tsx';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';



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
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
          <NotificationsProvider>
            <PharmacyProvider>
              <MedicationProvider>
                <App />
              </MedicationProvider>
            </PharmacyProvider>
          </NotificationsProvider>
      </ThemeProvider>
    </LocalizationProvider>
  </StrictMode>,
)
