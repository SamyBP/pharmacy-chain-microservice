import { CarousellSwitcher } from '@/components/animations/CarouselSwitcher';
import { Header } from '@/components/header/Header';
import { HeroSection } from '@/components/hero/HeroSection';
import { Section } from '@/components/hero/Section';
import { usePharmacies } from '@/hooks/use-pharmacies';
import {
  CategoryRounded as CategoryIcon,
  LocalPharmacyRounded as PharmacyIcon,
  TrendingUpRounded as SalesIcon
} from '@mui/icons-material';
import { Box, Card, CardContent, MenuItem, Select, Typography } from '@mui/material';
import React, { useState } from 'react';


const translations = {
  en: {
    managedPharmacies: 'Managed Pharmacies',
    additionalInfo: 'Additional Information',
    hero: {
      discover: "Discover",
      account: "Access your account"
    },
    info: [
      'Over 10+ medication categories',
      'Over 3+ medication providers',
      'Over 100+ sales',
    ],
  },
  ro: {
    managedPharmacies: 'Farmacii gestionate',
    additionalInfo: 'Informații suplimentare',
    hero: {
      discover: "Descoperă",
      account: "Accesează-ți contul"
    },
    info: [
      'Peste 10+ categorii de medicamente',
      'Peste 3+ furnizori de medicamente',
      'Peste 100+ vânzări',
    ],
  },
  fr: {
    managedPharmacies: 'Pharmacies gérées',
    additionalInfo: 'Informations supplémentaires',
    hero: {
      discover: "Découvrir",
      account: "Accéder à votre compte"
    },
    info: [
      'Plus de 10+ catégories de médicaments',
      'Plus de 3+ fournisseurs de médicaments',
      'Plus de 100+ ventes',
    ],
  },
};

const getInfoWithIcons = (translations: string[]) => [
  { text: translations[0], icon: <CategoryIcon sx={{ fontSize: 40, color: "primary.light" }} /> },
  { text: translations[1], icon: <PharmacyIcon sx={{ fontSize: 40, color: "primary.light"}} /> },
  { text: translations[2], icon: <SalesIcon sx={{ fontSize: 40, color: "primary.light" }} /> },
];

const createCard = (title: string, location: string, contact: string, imageUrl: string) => (
  <Card
    elevation={0}
    sx={{
      borderRadius: 3,
      height: 400,
      width: '100%',
      maxWidth: 800,
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      background: 'linear-gradient(135deg, #ffffff 0%, #f3f4f6 100%)',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
      '&:hover': {
        transform: 'scale(1.02)',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
      },
      display: 'flex',
      alignItems: 'stretch',
    }}
  >
    <Box
      component="img"
      src={imageUrl}
      alt={title}
      sx={{
        width: 400,
        height: '100%',
        objectFit: 'cover',
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 12,
      }}
    />
    <CardContent
      sx={{
        p: 2,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Title at the top */}
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          {title}
        </Typography>
      </Box>

      {/* Spacer and centered content */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {location}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {contact}
        </Typography>
      </Box>
    </CardContent>
  </Card>
);

type LanguageType = 'en' | 'ro' | 'fr'

interface LanguageSwitcherProps {
  lang: LanguageType
  setLang: (lang: LanguageType) => void
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ lang, setLang }) => {

  return (
    <Select
      value={lang}
      onChange={(e) => setLang(e.target.value)}
      size="small"
      sx={{ minWidth: 100 }}
    >
      <MenuItem value="en">English</MenuItem>
      <MenuItem value="ro">Română</MenuItem>
      <MenuItem value="fr">Français</MenuItem>
    </Select>
  );
};

export default function LandingPage() {
  const [lang, setLang] = useState<LanguageType>('en')
  const { pharmacies: managedPharmacies } = usePharmacies()
  const t = translations[lang]

  return (
    <>
      <Header endComponent={<LanguageSwitcher lang={lang} setLang={setLang} />} />
      <HeroSection
        discoverButtonText={t.hero.discover}
        accessAccountButtonText={t.hero.account}
      />
      <Section title={t.managedPharmacies}>
        <CarousellSwitcher>
          {managedPharmacies.map(p => createCard(p.name, p.address, p.contact, p.image))}
        </CarousellSwitcher>
      </Section>

      <Section title={t.additionalInfo} backgroundColor="primary.main" color='light'>
        <CarousellSwitcher
          autoShuffle
          interval={5000}
        >
          {getInfoWithIcons(t.info).map((item, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                maxWidth: 600,
                mx: 'auto',
              }}
            >
              {item.icon}
              <Typography
                variant="h6"
                textAlign="center"
                sx={{
                  color: 'primary.light',
                  fontWeight: 400,
                }}
              >
                {item.text}
              </Typography>
            </Box>
          ))}
        </CarousellSwitcher>
      </Section>
    </>
  );
}
