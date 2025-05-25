import { Box, Card, CardContent, MenuItem, Select, Typography } from '@mui/material';
import React, { useState } from 'react';
import pharmacyImage00 from "@/assets/images/pharmacy_00.jpg";
import pharmacyImage01 from "@/assets/images/pharmacy_01.jpg";
import { HeroSection } from '@/components/hero/HeroSection';
import { Section } from '@/components/hero/Section';
import { CarousellSwitcher } from '@/components/animations/CarouselSwitcher';
import { Header } from '@/components/header/Header';

const managedPharmacies = [
  {
    title: 'CVS Pharmacy',
    location: 'Multiple locations across the U.S.',
    contact: '(800) 746-7287',
    image: pharmacyImage00
  },
  {
    title: 'Walgreens',
    location: 'Available nationwide',
    contact: '(800) 925-4733',
    image: pharmacyImage01
  },
  {
    title: 'Rite Aid',
    location: 'Over 2,500 locations in the U.S.',
    contact: '(800) 748-3243',
    image: pharmacyImage00
  },
  {
    title: 'Costco Pharmacy',
    location: 'Available at most Costco warehouses',
    contact: '(800) 607-6861',
    image: pharmacyImage01
  },
  {
    title: 'Independent Pharmacies',
    location: 'Various local communities',
    contact: 'Contact local store',
    image: pharmacyImage00
  },
];

const translations = {
  en: {
    managedPharmacies: 'Managed Pharmacies',
    additionalInfo: 'Additional Information',
    hero: {
      discover: "Discover",
      account: "Access your account"
    },
    info: [
      'We work with most major insurance providers to ensure affordable access to your medications.',
      'Our dedicated support team is available around the clock to assist with your pharmacy needs.',
      'Modern e-prescription system for seamless medication management and refills.',
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
      'Colaborăm cu majoritatea asiguratorilor pentru a asigura accesul la medicamente.',
      'Echipa noastră de suport este disponibilă 24/7 pentru nevoile dumneavoastră.',
      'Sistem modern de e-rețete pentru gestionarea ușoară a medicației.',
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
      'Nous travaillons avec la plupart des assureurs pour un accès abordable aux médicaments.',
      "Notre équipe de support est disponible 24h/24 pour répondre à vos besoins.",
      "Système d'e-prescription moderne pour la gestion et le renouvellement des médicaments.",
    ],
  },
};



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
          {managedPharmacies.map(p => createCard(p.title, p.location, p.contact, p.image))}
        </CarousellSwitcher>
      </Section>

      <Section title={t.additionalInfo} backgroundColor="primary.main" color='light'>
        <CarousellSwitcher
          autoShuffle
          interval={5000}
        >
          {t.info.map((info, index) => (
            <Typography
              key={index}
              variant="h6"
              textAlign="center"
              sx={{
                maxWidth: 600,
                mx: 'auto',
                color: 'primary.light',
                fontWeight: 400,
              }}
            >
              {info}
            </Typography>
          ))}
        </CarousellSwitcher>
      </Section>
    </>
  );
}
