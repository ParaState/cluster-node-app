import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import TableCell from '@mui/material/TableCell';
import TableRow, { TableRowProps } from '@mui/material/TableRow';

type Props = {
  skeletonCounter?: number;
  skeletonWidth?: number | string;
};

export default function SimpleTableSkeleton({
  skeletonCounter = 10,
  skeletonWidth = 120,
  ...other
}: TableRowProps & Props) {
  return (
    <TableRow {...other}>
      <TableCell colSpan={12}>
        <Stack spacing={2}>
          {Array.from({ length: skeletonCounter }, (_, index) => (
            <Stack spacing={3} direction="row" alignItems="center" key={index}>
              <Skeleton height={16} width={skeletonWidth} />
              <Skeleton height={16} width={skeletonWidth} />
              <Skeleton height={16} width={skeletonWidth} />
            </Stack>
          ))}
        </Stack>
      </TableCell>
    </TableRow>
  );
}
