import { useState, useEffect } from 'react';

import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import {
  Fab,
  Box,
  Stack,
  Dialog,
  Button,
  Typography,
  CardContent,
  DialogContent,
  DialogActions,
} from '@mui/material';

import { useFirstVisit } from '@/stores';

import Carousel, { useCarousel, CarouselArrowIndex } from '@/components/carousel';

const data = [
  {
    id: 1,
    title: 'Generate Validators',
    coverUrl: '/assets/guide/generate.png',
    description: 'This is the first step of the guide.',
  },
  {
    id: 2,
    title: 'Run Validators',
    coverUrl: '/assets/guide/run.png',
    description: 'This is the third step of the guide.',
  },
  {
    id: 3,
    title: 'Deposit Validators',
    coverUrl: '/assets/guide/deposit.png',
    description: 'This is the second step of the guide.',
  },
  {
    id: 4,
    title: 'Update Fee Recipient Address',
    coverUrl: '/assets/guide/update-fee-recipient-address.png',
    description: 'This is the fourth step of the guide.',
  },
  {
    id: 5,
    title: 'Exit Validators',
    coverUrl: '/assets/guide/exit.png',
    description: 'This is the fourth step of the guide.',
  },
];

const FabWithGuide = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isFirstVisit, markAsVisited } = useFirstVisit();

  useEffect(() => {
    if (isFirstVisit) {
      setIsOpen(true);
      markAsVisited();
    }
  }, []);

  const carousel = useCarousel({
    autoplay: false,
  });

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Box>
      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="help"
        onClick={toggleModal}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
        }}
      >
        <HelpOutlineIcon />
      </Fab>

      {/* Modal */}
      <Dialog
        open={isOpen}
        onClose={() => {
          toggleModal();
          markAsVisited();
        }}
        maxWidth="md"
        sx={{ p: 0 }}
      >
        <DialogContent sx={{ position: 'relative' }}>
          <Typography variant="h4" textAlign="center" my={2}>
            How to Use Cluster Validators
          </Typography>

          <Carousel ref={carousel.carouselRef} {...carousel.carouselSettings}>
            {data.map((item) => (
              <Stack key={item.id}>
                <Box
                  component="img"
                  alt={item.title}
                  src={item.coverUrl}
                  height={680}
                  width={1}
                  sx={{
                    objectFit: 'contain',
                  }}
                />

                <CardContent sx={{ textAlign: 'left' }}>
                  <Typography variant="h6" noWrap gutterBottom>
                    {item.title}
                  </Typography>

                  <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                    {item.description}
                  </Typography>
                </CardContent>
              </Stack>
            ))}
          </Carousel>

          <CarouselArrowIndex
            index={carousel.currentIndex}
            total={data.length}
            onNext={carousel.onNext}
            onPrev={carousel.onPrev}
            sx={{ bottom: 0 }}
          />
        </DialogContent>

        <DialogActions>
          <Button variant="soft" onClick={toggleModal}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FabWithGuide;
