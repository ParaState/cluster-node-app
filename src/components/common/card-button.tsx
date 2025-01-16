import { LoadingButton, LoadingButtonProps } from '@mui/lab';

type Props = {
  text: string;
  isLoading?: boolean;
  width?: number;
  target?: string;
  onClick?: () => void;
};

export const CardButton = ({
  isLoading = false,
  text,
  width = 180,
  target = '_blank',
  onClick,
}: LoadingButtonProps & Props) => {
  return (
    <LoadingButton
      color="inherit"
      variant="outlined"
      sx={{
        color: 'white',
        borderRadius: '26px',
        borderColor: 'white !important',
        borderWidth: '2px !important',
        width,
        '& .MuiCircularProgress-root': {
          color: 'white',

          '& .MuiCircularProgress-circle': {
            strokeWidth: 4,
          },
        },
      }}
      size="large"
      loading={isLoading}
      onClick={onClick}
    >
      {text}
    </LoadingButton>
  );
};
