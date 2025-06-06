import { Box, Paper, Typography, Grid } from '@mui/material';
import FilterPanel from '../components/FilterPanel';
import LineChart from '../components/LineChart';
import ComparisonChart from '../components/ComparisonChart';
import StackedBarChart from '../components/StackedBarChart';
import MetricsSummary from '../components/MetricsSummary';

const AnalyticsView = () => {
  return (
    <Box sx={{ width: '100%', m: 0, p: 0 }}>
      <MetricsSummary />
      <FilterPanel />

      <Grid container spacing={4}>
        <Grid >
          <Paper 
            elevation={3} 
            sx={{ 
              borderRadius: 2,
              overflow: 'hidden',
              minHeight: 480,
              display: 'flex',
              flexDirection: 'column',
              width:650
            }}
          >
            <Box sx={{ p: 2, bgcolor: 'primary.light', color: '#0f63b2' }}>
              <Typography variant="h6">Spend Trends by Group</Typography>
            </Box>
            <Box sx={{ px: 2, py: 1, flexGrow: 1 }}>
              <LineChart />
            </Box>
          </Paper>
        </Grid>

        <Grid >
          <Paper 
            elevation={3} 
            sx={{ 
              borderRadius: 2,
              overflow: 'hidden',
              minHeight: 480,
              display: 'flex',
              flexDirection: 'column',
              width:650

            }}
          >
            <Box sx={{ p: 2, bgcolor: 'primary.light', color: '#0f63b2' }}>
              <Typography variant="h6">Percentage Change Comparison</Typography>
            </Box>
            <Box sx={{ px: 2, py: 1, flexGrow: 1 }}>
              <ComparisonChart />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Paper elevation={3} sx={{ mt: 3, borderRadius: 2, overflow: 'hidden', minHeight: 480 }}>
        <Box sx={{ p: 2, bgcolor: 'primary.light', color: '#0f63b2' }}>
          <Typography variant="h6">Stacked Spend by Group</Typography>
        </Box>
        <Box sx={{ px: 2, py: 1 }}>
          <StackedBarChart />
        </Box>
      </Paper>
    </Box>
  );
};

export default AnalyticsView;
