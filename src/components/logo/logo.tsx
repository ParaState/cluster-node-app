import { forwardRef } from 'react';

import Link from '@mui/material/Link';
import Box, { BoxProps } from '@mui/material/Box';
import { Badge, badgeClasses } from '@mui/material';

import { RouterLink } from '@/routes/components';

import { config } from '@/config';
import { wagmiNetworks } from '@/wagmi/config';

import Label from '@/components/label';

export interface LogoProps extends BoxProps {
  disabledLink?: boolean;
}

const Logo = forwardRef<HTMLDivElement, LogoProps>(
  ({ disabledLink = false, sx, ...other }, ref) => {
    const logo = (
      <Box
        ref={ref}
        component="div"
        sx={{
          height: {
            md: 40,
            xs: 32,
          },
          minWidth: {
            md: 76,
            xs: 60,
          },
          display: 'inline-flex',
          ...sx,
        }}
        {...other}
      >
        <svg viewBox="0 0 524 280" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M275.127 74.305L213.958 135.593C211.116 138.441 209.627 142.237 209.627 146.169V200C209.627 205.559 205.161 210.034 199.613 210.034H79.845C74.2965 210.034 69.8306 205.559 69.8306 200V80C69.8306 74.4407 74.2965 69.9661 79.845 69.9661H203.402C207.326 69.9661 211.116 68.3389 213.958 65.627L265.789 13.6949C270.796 8.67793 267.278 0 260.105 0H76.0558C72.1312 0 68.342 1.62705 65.5 4.33892L4.33059 65.627C1.48865 68.4744 0 72.2711 0 76.2033V203.797C0 207.729 1.62398 211.525 4.33059 214.373L65.5 275.661C68.342 278.508 72.1312 280 76.0558 280H203.402C207.326 280 211.116 278.373 213.958 275.661L275.127 214.373C277.969 211.525 279.458 207.729 279.458 203.797V149.966C279.458 144.407 283.924 139.932 289.472 139.932H407.21C411.676 139.932 413.841 145.356 410.728 148.475L362.957 196.339C357.949 201.356 361.468 210.034 368.64 210.034H447.944C451.869 210.034 455.658 208.407 458.5 205.695L519.669 144.407C522.511 141.559 524 137.763 524 133.83V80C524 74.4407 519.534 69.9661 513.986 69.9661H285.547C281.758 69.9661 277.969 71.4575 275.127 74.305Z"
            fill="url(#paint0_linear_59_502)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_59_502"
              x1="133.301"
              y1="280.136"
              x2="449.23"
              y2="-33.828"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4DC6ED" />
              <stop offset="0.45" stopColor="#4992EC" />
              <stop offset="1" stopColor="#3F37C6" />
            </linearGradient>
          </defs>
        </svg>
      </Box>
    );

    if (disabledLink) {
      return logo;
    }

    return (
      <Link
        component={RouterLink}
        href={config.routes.clusterValidator.home}
        sx={{ display: 'contents' }}
      >
        {logo}
      </Link>
    );
  }
);

export default Logo;

export const BadgeLogo = () => {
  return (
    <Badge
      sx={{
        [`& .${badgeClasses.badge}`]: {
          right: -16,
        },
      }}
      badgeContent={
        <Link href="/" rel="noopener" underline="none" sx={{ ml: 1 }}>
          <Label color="info" sx={{ textTransform: 'unset', height: 22, px: 0.5 }}>
            {wagmiNetworks[0] && wagmiNetworks[0].name}
          </Label>
        </Link>
      }
    >
      <Logo />
    </Badge>
  );
};
