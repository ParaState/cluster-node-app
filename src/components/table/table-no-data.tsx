import { Typography } from '@mui/material';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { Theme, SxProps } from '@mui/material/styles';

type Props = {
  notFound: boolean;
  sx?: SxProps<Theme>;
};

export default function TableNoData({ notFound, sx }: Props) {
  return (
    <TableRow>
      {notFound ? (
        <TableCell colSpan={12} align="center">
          <Typography variant="body2">No data</Typography>
        </TableCell>
      ) : (
        <TableCell colSpan={12} sx={{ p: 0 }} />
      )}
    </TableRow>
  );
}
