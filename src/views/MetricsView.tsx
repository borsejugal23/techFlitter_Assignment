import { Box, Paper, Typography } from '@mui/material';
import FilterPanel from '../components/FilterPanel';
import DataTable from '../components/DataTable';
import BarChart from '../components/BarChart';
import MetricsSummary from '../components/MetricsSummary';

const MetricsView = () => {
  return (
    <Box sx={{ width: '100%', m: 0, p: 0 }}>
      <MetricsSummary />
      <FilterPanel />
      
      <Paper 
        elevation={3} 
        sx={{ 
          mb: 3,
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        <Box 
          sx={{ 
            p: 2, 
            bgcolor: 'primary.light',
            color: '#0f63b2'
          }}
        >
          <Typography variant="h6">
            Spend by Group
          </Typography>
        </Box>
        <Box sx={{ p: 2 }}>
          <BarChart />
        </Box>
      </Paper>
      
      <Paper 
        elevation={3} 
        sx={{ 
          mb: 3,
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        <Box 
          sx={{ 
            p: 2, 
            bgcolor: 'primary.light',
            color: '#0f63b2'
          }}
        >
          <Typography variant="h6">
            Detailed Data
          </Typography>
        </Box>
        <Box sx={{ p: 2 }}>
          <DataTable />
        </Box>
      </Paper>
    </Box>
  );
};

export default MetricsView;