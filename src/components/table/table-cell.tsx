import { styled } from '@mui/material/styles';
import { TableCell, tableCellClasses } from '@mui/material';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: 'transparent',
    fontSize: 12,
    fontWeight: 500,
    color: theme.palette.grey[600],
  },
  [`&.${tableCellClasses.body}`]: {},
}));

export default StyledTableCell;
