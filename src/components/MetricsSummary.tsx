import { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Grid, 
  Typography, 
  Chip,
  Tooltip,
  CircularProgress,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useDashboard } from '../context/DashboardContext';
import type { MetricType } from '../types';

interface MetricCardProps {
  title: string;
  value: number;
  previousValue: number;
  percentChange: number;
  prefix?: string;
  isLoading?: boolean;
}

const MetricCard = ({ 
  title, 
  value, 
  previousValue, 
  percentChange, 
  prefix = '$',
  isLoading = false
}: MetricCardProps) => {
  const theme = useTheme();
  
  // Format numbers with commas and 2 decimal places if needed
  const formatNumber = (num: number) => {
    return prefix + num.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };
  
  // Determine trend icon and color
  const getTrendInfo = (percent: number) => {
    if (percent > 0) {
      return { 
        icon: <TrendingUpIcon fontSize="small" />, 
        color: theme.palette.success.main,
        text: 'Increase'
      };
    } else if (percent < 0) {
      return { 
        icon: <TrendingDownIcon fontSize="small" />, 
        color: theme.palette.error.main,
        text: 'Decrease'
      };
    } else {
      return { 
        icon: <TrendingFlatIcon fontSize="small" />, 
        color: theme.palette.grey[500],
        text: 'No change'
      };
    }
  };
  
  const trend = getTrendInfo(percentChange);
  
  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: 2, 
        height: '100%',
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      <Box sx={{ mb: 1 }}>
        <Typography variant="subtitle2" color="text.secondary">
          {title}
        </Typography>
      </Box>
      
      <Box sx={{ minHeight: 80 /* or exact height like 88px */, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
  {isLoading ? (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <CircularProgress size={24} />
    </Box>
  ) : (
    <>
      <Typography variant="h4" component="div" fontWeight="medium">
        {formatNumber(value)}
      </Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
        <Chip
          icon={trend.icon}
          label={`${Math.abs(percentChange).toFixed(1)}%`}
          size="small"
          sx={{ 
            bgcolor: `${trend.color}20`, 
            color: trend.color,
            fontWeight: 'bold',
            mr: 1
          }}
        />
        <Tooltip title={`Previous: ${formatNumber(previousValue)}`}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
            vs Previous <InfoIcon fontSize="inherit" sx={{ ml: 0.5 }} />
          </Typography>
        </Tooltip>
      </Box>
    </>
  )}
</Box>

    </Paper>
  );
};

const MetricsSummary = () => {
  const { userData, currentUser, filters } = useDashboard();
  const [isLoading, setIsLoading] = useState(true);
  const [summaryData, setSummaryData] = useState<Record<MetricType, { current: number; reference: number; percentChange: number }>>({
    mySpend: { current: 0, reference: 0, percentChange: 0 },
    sameStoreSpend: { current: 0, reference: 0, percentChange: 0 },
    newStoreSpend: { current: 0, reference: 0, percentChange: 0 },
    lostStoreSpend: { current: 0, reference: 0, percentChange: 0 }
  });
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Calculate summary metrics based on filtered data
  useEffect(() => {
    if (userData.length === 0) return;
    
    setIsLoading(true);
    
    // Simulate loading delay for better UX
    const timer = setTimeout(() => {
      // Filter data based on sector and category if selected
      let filteredData = [...userData];
      
      if (filters.sector.length > 0) {
        filteredData = filteredData.filter(item => filters.sector.includes(item.sector));
      }
      
      if (filters.category.length > 0) {
        filteredData = filteredData.filter(item => filters.category.includes(item.category));
      }
      
      // Filter by date range if selected
      if (filters.startDate && filters.endDate) {
        const startDate = new Date(filters.startDate);
        const endDate = new Date(filters.endDate);
        
        filteredData = filteredData.filter(item => {
          const itemStartDate = new Date(item.startDate);
          const itemEndDate = new Date(item.endDate);
          
          return (
            (itemStartDate >= startDate && itemStartDate <= endDate) ||
            (itemEndDate >= startDate && itemEndDate <= endDate) ||
            (itemStartDate <= startDate && itemEndDate >= endDate)
          );
        });
      }
      
      // Calculate totals for each metric
      const totals: Record<MetricType, { current: number; reference: number; percentChange: number }> = {
        mySpend: { current: 0, reference: 0, percentChange: 0 },
        sameStoreSpend: { current: 0, reference: 0, percentChange: 0 },
        newStoreSpend: { current: 0, reference: 0, percentChange: 0 },
        lostStoreSpend: { current: 0, reference: 0, percentChange: 0 }
      };
      
      const metricTypes: MetricType[] = ['mySpend', 'sameStoreSpend', 'newStoreSpend', 'lostStoreSpend'];
      
      filteredData.forEach(item => {
        metricTypes.forEach(metric => {
          totals[metric].current += item[metric].current;
          totals[metric].reference += item[metric].reference;
        });
      });
      
      // Calculate percent changes
      metricTypes.forEach(metric => {
        if (totals[metric].reference !== 0) {
          totals[metric].percentChange = 
            ((totals[metric].current - totals[metric].reference) / 
            totals[metric].reference) * 100;
        }
      });
      
      setSummaryData(totals);
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [userData, filters]);
  
  const metricLabels: Record<MetricType, string> = {
    mySpend: 'Total Spend',
    sameStoreSpend: 'Same Store',
    newStoreSpend: 'New Store',
    lostStoreSpend: 'Lost Store'
  };
  
  return (
    <Paper 
      elevation={3} 
      sx={{ 
        mb: 3,
        borderRadius: 2,
        overflow: 'hidden',
        width: '100%'
      }}
    >
      <Box 
        sx={{ 
          p: 2, 
          bgcolor: 'primary.light',
          color: '#0f63b2'
        }}
      >
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
          Key Metrics Summary
          {currentUser && (
            <Chip 
              label={currentUser.name} 
              size="small" 
              sx={{ ml: 2, bgcolor: 'rgba(255,255,255,0.2)' }} 
            />
          )}
        </Typography>
      </Box>
      
      <Box sx={{ p: 2 }}>
        <Grid container spacing={2}>
          <Grid xs={12} sm={6} md={3}>
            <MetricCard
              title={metricLabels.mySpend}
              value={summaryData.mySpend.current}
              previousValue={summaryData.mySpend.reference}
              percentChange={summaryData.mySpend.percentChange}
              isLoading={isLoading}
            />
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <MetricCard
              title={metricLabels.sameStoreSpend}
              value={summaryData.sameStoreSpend.current}
              previousValue={summaryData.sameStoreSpend.reference}
              percentChange={summaryData.sameStoreSpend.percentChange}
              isLoading={isLoading}
            />
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <MetricCard
              title={metricLabels.newStoreSpend}
              value={summaryData.newStoreSpend.current}
              previousValue={summaryData.newStoreSpend.reference}
              percentChange={summaryData.newStoreSpend.percentChange}
              isLoading={isLoading}
            />
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <MetricCard
              title={metricLabels.lostStoreSpend}
              value={summaryData.lostStoreSpend.current}
              previousValue={summaryData.lostStoreSpend.reference}
              percentChange={summaryData.lostStoreSpend.percentChange}
              isLoading={isLoading}
            />
          </Grid>
        </Grid>
        
        {!isMobile && (
          <Box sx={{ mt: 2, pt: 1, borderTop: `1px solid ${theme.palette.divider}` }}>
            <Typography variant="caption" color="text.secondary">
              * Values shown are based on current filter selections. Reset filters to see all data.
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default MetricsSummary;