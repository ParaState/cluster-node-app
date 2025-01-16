import Stack from '@mui/material/Stack';

import { navConfig } from '@/config';

import NavList from './nav-list';

export default function NavDesktop() {
  return (
    <Stack component="nav" direction="row" spacing={5} sx={{ mr: 2.5, height: 1 }}>
      {navConfig.map((list) => (
        <NavList key={list.title} data={list} />
      ))}
    </Stack>
  );
}
