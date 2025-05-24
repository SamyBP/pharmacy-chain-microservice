import React, { useEffect, useState } from 'react';
import { Fade, Box, IconButton } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

interface ShufflingCardsProps {
  children: React.ReactNode[];
  autoShuffle?: boolean;
  interval?: number;
}

export const ShufflingCards: React.FC<ShufflingCardsProps> = ({
  children,
  autoShuffle = false,
  interval = 10000,
}) => {
  const [index, setIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);

  useEffect(() => {
    if (!autoShuffle) return;

    const timer = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setIndex((prevIndex) => (prevIndex + 1) % children.length);
        setFadeIn(true);
      }, 200);
    }, interval);

    return () => clearInterval(timer);
  }, [autoShuffle, children.length, interval]);

  const handlePrev = () => {
    setFadeIn(false);
    setTimeout(() => {
      setIndex((prevIndex) => (prevIndex - 1 + children.length) % children.length);
      setFadeIn(true);
    }, 200);
  };

  const handleNext = () => {
    setFadeIn(false);
    setTimeout(() => {
      setIndex((prevIndex) => (prevIndex + 1) % children.length);
      setFadeIn(true);
    }, 200);
  };

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {!autoShuffle && (
        <IconButton onClick={handlePrev} sx={{ mr: 1 }}>
          <ArrowBackIosNewIcon />
        </IconButton>
      )}

      <Fade in={fadeIn} timeout={500}>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          {children[index]}
        </Box>
      </Fade>

      {!autoShuffle && (
        <IconButton onClick={handleNext} sx={{ ml: 1 }}>
          <ArrowForwardIosIcon />
        </IconButton>
      )}
    </Box>
  );
};
