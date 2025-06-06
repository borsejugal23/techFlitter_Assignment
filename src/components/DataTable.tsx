/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Box,
} from '@mui/material';
import { useDashboard } from '../context/DashboardContext';
import type { MetricType } from '../types';

type Order = 'asc' | 'desc';

interface HeadCell {
  id: string;
  label: string;
  numeric: boolean;
}

const DataTable = () => {
  const { groupedData, filters } = useDashboard();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<string>('group');

  const rows = Object.entries(groupedData).map(([group, metrics]) => {
    const row: Record<string, any> = { group };
    
    const metricsToShow = filters.metrics.length > 0 
      ? filters.metrics 
      : ['mySpend', 'sameStoreSpend', 'newStoreSpend', 'lostStoreSpend'];
    
    metricsToShow.forEach((metric) => {
      if (metrics[metric]) {
        row[`${metric}_current`] = metrics[metric].current;
        row[`${metric}_reference`] = metrics[metric].reference;
        row[`${metric}_absoluteChange`] = metrics[metric].absoluteChange;
        row[`${metric}_percentChange`] = metrics[metric].percentChange;
      }
    });
    
    return row;
  });

  const generateHeaders = (): HeadCell[] => {
    const headers: HeadCell[] = [
      { id: 'group', label: 'Group', numeric: false },
    ];
    
    const metricsToShow = filters.metrics.length > 0 
      ? filters.metrics 
      : ['mySpend', 'sameStoreSpend', 'newStoreSpend', 'lostStoreSpend'];
    
    const metricLabels: Record<MetricType, string> = {
      mySpend: 'My Spend',
      sameStoreSpend: 'Same Store Spend',
      newStoreSpend: 'New Store Spend',
      lostStoreSpend: 'Lost Store Spend'
    };
    
    metricsToShow.forEach((metric) => {
      headers.push(
        { id: `${metric}_current`, label: `${metricLabels[metric as MetricType]} (Current)`, numeric: true },
        { id: `${metric}_reference`, label: `${metricLabels[metric as MetricType]} (Reference)`, numeric: true },
        { id: `${metric}_absoluteChange`, label: `${metricLabels[metric as MetricType]} (Absolute Change)`, numeric: true },
        { id: `${metric}_percentChange`, label: `${metricLabels[metric as MetricType]} (% Change)`, numeric: true }
      );
    });
    
    return headers;
  };

  const headCells = generateHeaders();

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  //  function sort the table data 
  function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  function getComparator(
    order: Order,
    orderBy: string
  ): (a: Record<string, any>, b: Record<string, any>) => number {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  function descendingComparator(a: Record<string, any>, b: Record<string, any>, orderBy: string) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(num);
  };

  const formatPercent = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      signDisplay: 'exceptZero'
    }).format(num / 100);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = stableSort(rows, getComparator(order, orderBy))
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ width: '100%' }}>
      
      <TableContainer>
        <Table stickyHeader aria-label="data table">
          <TableHead>
            <TableRow>
              {headCells.map((headCell) => (
                <TableCell
                  key={headCell.id}
                  align={headCell.numeric ? 'right' : 'left'}
                  sortDirection={orderBy === headCell.id ? order : false}
                  sx={{
                    fontWeight: 'bold',
                    color: '#000'
                  }}
                >
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : 'asc'}
                    onClick={() => handleRequestSort(headCell.id)}
                  >
                    {headCell.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleRows.map((row, index) => (
              <TableRow
                hover
                key={index}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                {headCells.map((headCell) => (
                  <TableCell 
                    key={headCell.id} 
                    align={headCell.numeric ? 'right' : 'left'}
                  >
                    {headCell.id === 'group' ? row[headCell.id] :
                     headCell.id.includes('percentChange') ? 
                      (row[headCell.id] !== undefined ? formatPercent(row[headCell.id]) : '-') :
                      (row[headCell.id] !== undefined ? formatNumber(row[headCell.id]) : '-')}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={headCells.length} />
              </TableRow>
            )}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={headCells.length} align="center">
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default DataTable;