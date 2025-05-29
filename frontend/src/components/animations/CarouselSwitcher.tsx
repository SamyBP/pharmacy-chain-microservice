import React, { useEffect, useState } from 'react';
import { Fade, Box, IconButton } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

interface CarousellSwitcherProps {
  children: React.ReactNode[];
  autoShuffle?: boolean;
  interval?: number;
  paginate?: number;
  arrowIconColor?: 'white' | 'black' 
}

export const CarousellSwitcher: React.FC<CarousellSwitcherProps> = ({
  children,
  autoShuffle = false,
  interval = 10000,
  paginate = 1,
  arrowIconColor = 'white'
}) => {
  const [visibleIndices, setVisibleIndices] = useState<number[]>(
    autoShuffle 
      ? [0]
      : Array.from({ length: Math.min(paginate, children.length) }, (_, i) => i)
  );
  const [fadeIn, setFadeIn] = useState(true);

  const totalItems = children.length;

  useEffect(() => {
    if (!autoShuffle) return;

    const timer = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setVisibleIndices(prev => {
          const nextIndex = (prev[0] + 1) % totalItems;
          return [nextIndex];
        });
        setFadeIn(true);
      }, 200);
    }, interval);

    return () => clearInterval(timer);
  }, [autoShuffle, interval, totalItems]);

  const handlePrev = () => {
    if (autoShuffle) return;
    if (visibleIndices[0] <= 0) return;
    
    setFadeIn(false);
    setTimeout(() => {
      setVisibleIndices(prev => {
        const firstIndex = prev[0] - 1;
        return Array.from(
          { length: Math.min(paginate, totalItems) },
          (_, i) => firstIndex + i
        );
      });
      setFadeIn(true);
    }, 200);
  };

  const handleNext = () => {
    if (autoShuffle) return;
    if (visibleIndices[visibleIndices.length - 1] >= totalItems - 1) return;

    setFadeIn(false);
    setTimeout(() => {
      setVisibleIndices(prev => {
        const firstIndex = prev[0] + 1;
        return Array.from(
          { length: Math.min(paginate, totalItems) },
          (_, i) => firstIndex + i
        );
      });
      setFadeIn(true);
    }, 200);
  };

  const visibleChildren = visibleIndices.map(index => children[index]);
  const isAtStart = visibleIndices[0] <= 0;
  const isAtEnd = visibleIndices[visibleIndices.length - 1] >= totalItems - 1;

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 2
      }}
    >
      {!autoShuffle && !isAtStart && (
        <IconButton onClick={handlePrev} sx={{ color: arrowIconColor }}>
          <ArrowBackIosNewIcon />
        </IconButton>
      )}

      <Fade in={fadeIn} timeout={500}>
        <Box 
          sx={{ 
            display: 'flex',
            gap: 3,
            justifyContent: 'center',
            width: '100%',
            flexWrap: 'nowrap'
          }}
        >
          {visibleChildren}
        </Box>
      </Fade>

      {!autoShuffle && !isAtEnd && (
        <IconButton onClick={handleNext} sx={{ color: arrowIconColor }}>
          <ArrowForwardIosIcon />
        </IconButton>
      )}
    </Box>
  );
};
