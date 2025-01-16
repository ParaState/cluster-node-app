import React, { useRef, useState, useEffect, useCallback } from 'react';

import { Menu, Stack, Button, MenuItem, Checkbox, Typography } from '@mui/material';

import Iconify from '@/components/iconify';

type Props = {
  setFilterBy: (filterBy: any) => void;
};

export const OperatorTypeFilter = ({ setFilterBy }: Props) => {
  const wrapperRef = useRef<any>(null);
  const [shouldOpen, openPopUp] = useState(false);
  const [verifySelected, selectVerify] = useState(false);
  const [daoSelected, selectDao] = useState(false);

  const [isOpen, setOpen] = useState<null | HTMLElement>(null);

  useEffect(() => {
    const filterMap: any = {};
    if (verifySelected) {
      filterMap.verified = 1;
    }
    if (daoSelected) {
      filterMap.fromDao = 1;
    }
    setFilterBy(filterMap);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verifySelected, daoSelected]);

  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (shouldOpen && wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        openPopUp(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef, shouldOpen]);

  const handleOpen = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpen(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(null);
  }, []);

  return (
    <>
      <Button
        variant="outlined"
        color="primary"
        onClick={handleOpen}
        fullWidth
        startIcon={<Iconify icon="carbon:filter" />}
      >
        Filters
      </Button>

      <Menu id="simple-menu" anchorEl={isOpen} onClose={handleClose} open={Boolean(isOpen)}>
        <MenuItem onClick={handleClose}>
          <Stack direction="row">
            <Checkbox checked={daoSelected} onChange={() => selectDao(!daoSelected)} />
            <Typography>DAO</Typography>
          </Stack>
        </MenuItem>

        <MenuItem onClick={handleClose}>
          <Stack direction="row">
            <Checkbox checked={verifySelected} onChange={() => selectVerify(!verifySelected)} />
            <Typography>Verified</Typography>
          </Stack>
        </MenuItem>
      </Menu>
    </>
  );
};
