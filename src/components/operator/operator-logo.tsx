import { Avatar } from '@mui/material';

type Props = {
  logo?: string;
};

export const OperatorLogo = ({ logo }: Props) => {
  return (
    <Avatar
      variant="square"
      src={logo || '/assets/operator/light.svg'}
      slotProps={{
        img: {
          style: {
            objectFit: 'contain',
          },
        },
      }}
    />
  );
};
