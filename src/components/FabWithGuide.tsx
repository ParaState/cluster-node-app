import { useState, useEffect } from 'react';

import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import {
  Fab,
  Box,
  Link,
  Stack,
  Dialog,
  Button,
  Typography,
  CardContent,
  DialogContent,
  DialogActions,
} from '@mui/material';

import { config } from '@/config';
import { useFirstVisit } from '@/stores';

import Carousel, { useCarousel, CarouselArrowIndex } from '@/components/carousel';

const data = [
  {
    id: 1,
    title: 'Generate Validators',
    coverUrl: '/assets/guide/generate.png',
    description: (
      <Stack>
        <Typography variant="body2">
          After setting up your Cluster Node service, you can generate multiple validators securely
          using the Distributed Key Generation (DKG) service.
        </Typography>

        <Typography variant="body2">
          If using{' '}
          <Link
            href={config.links.lidoCsmHome}
            target="_blank"
            rel="noopener noreferrer"
            underline="always"
          >
            Lido CSM
          </Link>
          , you need to set up the withdrawal address properly.
        </Typography>
      </Stack>
    ),
  },
  {
    id: 2,
    title: 'Run Validators',
    coverUrl: '/assets/guide/run.png',
    description: (
      <Stack>
        <Typography variant="body2">
          Any validator can run on the SafeStake network. Select number of validators and follow the
          steps to join the SafeStake network.
        </Typography>
      </Stack>
    ),
  },
  {
    id: 3,
    title: 'Deposit Validators',
    coverUrl: '/assets/guide/deposit.png',
    description: (
      <Stack>
        <Typography variant="body2">
          To become a validator on the Beacon Chain, you need to deposit 32 ETH per validator
        </Typography>

        <Typography variant="body2">
          However, if you use Lido CSM, you only need a small amount of ETH to become a validator.
        </Typography>
      </Stack>
    ),
  },
  {
    id: 4,
    title: 'Update Fee Recipient Address',
    coverUrl: '/assets/guide/update-fee-recipient-address.png',
    description: (
      <Stack>
        <Typography variant="body2">
          Next to the fee recipient address, you can set an address where validator rewards will be
          sent when your validator receives them.
        </Typography>

        <Typography variant="body2">
          If using Lido CSM, you need to set the fee recipient address to the{' '}
          <Link
            href={config.links.lidoFeeRecipient}
            target="_blank"
            rel="noopener noreferrer"
            underline="always"
          >
            Lido CSM address
          </Link>
          .
        </Typography>
      </Stack>
    ),
  },
  {
    id: 5,
    title: 'Exit Validators',
    coverUrl: '/assets/guide/exit.png',
    description: (
      <Stack>
        <Typography variant="body2">
          To withdraw your staked ETH and stop validating on the Ethereum network, you can initiate
          a validator exit. Simply select the validators you wish to exit and follow the prompts.
        </Typography>

        <Typography variant="body2">Note that exiting validators may take some time.</Typography>
      </Stack>
    ),
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
            Welcome to SafeStake Cluster Validators Guide
          </Typography>

          <Carousel ref={carousel.carouselRef} {...carousel.carouselSettings}>
            {data.map((item) => (
              <Stack key={item.id}>
                <Box
                  component="img"
                  alt={item.title}
                  src={item.coverUrl}
                  height={480}
                  width={1}
                  sx={{
                    objectFit: 'contain',
                  }}
                />

                <CardContent sx={{ textAlign: 'left' }}>
                  <Typography variant="h6" noWrap gutterBottom>
                    {item.title}
                  </Typography>

                  <Typography variant="body2" sx={{ color: 'text.secondary' }} component="div">
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
            sx={{ bottom: 180, right: 20 }}
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
