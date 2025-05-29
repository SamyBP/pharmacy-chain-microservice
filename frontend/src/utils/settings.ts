const isDevelopment = import.meta.env.DEV

const devApiFormat = 'http://localhost:${port}/api'
const prodApiUrl = import.meta.env.VITE_API_BASE_URL

const devMediaBaseUrlFormat = "http://localhost:${port}"
const prodMediaUrl = import.meta.env.VITE_MEDIA_BASE_URL

const portMappings = {
  pharmacy: 8000,
  user: 8001,
  medication: 8002
}

type ServiceType = 'pharmacy' | 'user' | 'medication' 

function formatDevUrl(port: number, format: string): string {
   return format.replace('${port}', String(port))
}

function getApiBaseUrl(service: ServiceType, isDev: boolean = true ): string {
  return isDev ? formatDevUrl(portMappings[service], devApiFormat) : prodApiUrl
}

function getMediaBaseUrl(isDev: boolean = true): string {
  return isDev ? formatDevUrl(portMappings['medication'], devMediaBaseUrlFormat) : prodMediaUrl
}

export const settings = {
  api: {
    pharmacy: getApiBaseUrl('pharmacy', isDevelopment),
    user: getApiBaseUrl('user', isDevelopment),
    medication: getApiBaseUrl('medication', isDevelopment)
  },
  media: getMediaBaseUrl(isDevelopment)
}