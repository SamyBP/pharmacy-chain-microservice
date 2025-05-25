import React from 'react';
import { Container, Typography, Box } from '@mui/material';

interface SectionProps {
  title: string;
  children: React.ReactNode;
  backgroundColor?: string;
  color?: 'main' | 'light' | 'dark' | 'contrastText';
}

export const Section: React.FC<SectionProps> = ({ title, children, backgroundColor, color = 'main' }) => (
  <Box sx={{ py: 10, backgroundColor }}>
    <Container maxWidth="lg">
      <Typography
        variant="h4"
        sx={(theme) => ({
          textAlign: 'center',
          fontWeight: 700,
          mb: 6,
          background: theme.palette.primary[color],
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        })}
      >
        {title}
      </Typography>
      {children}
    </Container>
  </Box>
);
