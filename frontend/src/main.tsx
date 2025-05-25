import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import { AuthProvider } from './contexts/AuthContext.tsx'

const theme = createTheme({
  palette: {
    primary: {
      main: "#272C30",
      light: "white",
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
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
