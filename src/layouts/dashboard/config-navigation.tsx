import { useMemo } from 'react';

import Iconify from '@/components/iconify';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  // <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  <Iconify icon={name} />
  // OR
  // <Iconify icon="fluent:mail-24-filled" />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

const ICONS = {
  dashboard: icon('ic:baseline-dashboard'),
  newPage: icon('ic:baseline-insert-drive-file'),
};

// ----------------------------------------------------------------------

export function useNavData() {
  const data = useMemo(
    () => [
      {
        subheader: 'Overview',
        items: [
          {
            title: 'Dashboard',
            path: '/',
            icon: ICONS.dashboard,
          },
          {
            title: 'New Page',
            path: '/newpage',
            icon: ICONS.newPage,
          },
        ],
      },
    ],
    []
  );

  return data;
}
