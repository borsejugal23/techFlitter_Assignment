import { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Chip,
  OutlinedInput,
  type SelectChangeEvent,
  Button,
  Typography,
  Divider,
  IconButton,
  Tooltip,
  Collapse,
  useTheme,
  useMediaQuery
} from '@mui/material';
import Grid from '@mui/material/Grid';

import { 
  DatePicker 
} from '@mui/x-date-pickers/DatePicker';
import { 
  FilterAlt as FilterIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Refresh as RefreshIcon,
  CalendarMonth as CalendarIcon,
  Category as CategoryIcon,
  Layers as LayersIcon,
  ShowChart as ChartIcon
} from '@mui/icons-material';
import { useDashboard } from '../context/DashboardContext';
import type { AttributeType, MetricType } from '../types';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const FilterPanel = () => {
  const { userData, filters, updateFilters, resetFilters } = useDashboard();
  const [expanded, setExpanded] = useState(true);
  const [sectors, setSectors] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  useEffect(() => {
    if (isMobile) {
      setExpanded(false);
    }
  }, [isMobile]);
  
  useEffect(() => {
    if (userData.length > 0) {
      const uniqueSectors = [...new Set(userData.map(item => item.sector))];
      const uniqueCategories = [...new Set(userData.map(item => item.category))];
      
      setSectors(uniqueSectors);
      setCategories(uniqueCategories);
    }
  }, [userData]);
  
  const today = new Date();
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(today.getMonth() - 12);
  
  const handleDateChange = (type: 'startDate' | 'endDate', date: Date | null) => {
    updateFilters({ [type]: date });
  };
  
  const handleSectorChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    updateFilters({ sector: typeof value === 'string' ? [value] : value });
  };
  
  const handleCategoryChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    updateFilters({ category: typeof value === 'string' ? [value] : value });
  };
  
  const handleAttributeChange = (event: SelectChangeEvent<AttributeType[]>) => {
    const value = event.target.value as unknown as AttributeType[];
    updateFilters({ attributes: value });
  };
  
  const handleMetricChange = (event: SelectChangeEvent<MetricType[]>) => {
    const value = event.target.value as unknown as MetricType[];
    updateFilters({ metrics: value });
  };
  
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };
  
  const attributes: { value: AttributeType; label: string; icon: JSX.Element }[] = [
    { value: 'country', label: 'Country', icon: <LayersIcon fontSize="small" /> },
    { value: 'state', label: 'State', icon: <LayersIcon fontSize="small" /> },
    { value: 'city', label: 'City', icon: <LayersIcon fontSize="small" /> },
    { value: 'sector', label: 'Sector', icon: <CategoryIcon fontSize="small" /> },
    { value: 'category', label: 'Category', icon: <CategoryIcon fontSize="small" /> },
  ];
  
  const metrics: { value: MetricType; label: string; icon: JSX.Element }[] = [
    { value: 'mySpend', label: 'My Spend', icon: <ChartIcon fontSize="small" /> },
    { value: 'sameStoreSpend', label: 'Same Store Spend', icon: <ChartIcon fontSize="small" /> },
    { value: 'newStoreSpend', label: 'New Store Spend', icon: <ChartIcon fontSize="small" /> },
    { value: 'lostStoreSpend', label: 'Lost Store Spend', icon: <ChartIcon fontSize="small" /> },
  ];
  
  // Count active filters
  const activeFilterCount = [
    filters.startDate, 
    filters.endDate, 
    ...filters.sector, 
    ...filters.category, 
    ...filters.attributes, 
    ...filters.metrics
  ].filter(Boolean).length;
  
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
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          bgcolor: 'primary.light',
          color: '#0f63b2'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FilterIcon sx={{ mr: 1 }} />
          <Typography variant="h6">
            Filters
            {activeFilterCount > 0 && (
              <Chip 
                label={activeFilterCount} 
                size="small" 
                color="primary" 
                sx={{ ml: 1, height: 20, minWidth: 20 }} 
              />
            )}
          </Typography>
        </Box>
        <Box>
          <Tooltip title={expanded ? "Collapse filters" : "Expand filters"}>
            <IconButton 
              onClick={toggleExpanded} 
              size="small" 
              sx={{ color: 'inherit' }}
            >
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Reset all filters">
            <IconButton 
              onClick={resetFilters} 
              size="small" 
              sx={{ color: 'inherit', ml: 1 }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      
      <Collapse in={expanded}>
        <Box sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {/* Date Range Section */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CalendarIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="subtitle1" fontWeight="medium">Date Range</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2 }}>
                <DatePicker
                  label="Start Date"
                  value={filters.startDate}
                  onChange={(date) => handleDateChange('startDate', date)}
                  minDate={new Date('2024-01-01')}
                  maxDate={new Date('2024-12-31')}
                  sx={{ flex: 1 }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: "small"
                    }
                  }}
                />
                <DatePicker
                  label="End Date"
                  value={filters.endDate}
                  onChange={(date) => handleDateChange('endDate', date)}
                  minDate={new Date('2024-01-01')}
                  maxDate={new Date('2024-12-31')}
                  sx={{ flex: 1 }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: "small"
                    }
                  }}
                />
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <Divider />
            </Grid>
            
            {/* Categories Section */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CategoryIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="subtitle1" fontWeight="medium">Categories</Typography>
              </Box>
              <Grid container spacing={2}>
                {/* Sector Dropdown */}
                <Grid item xs={12} >
                 <FormControl 
                    fullWidth={false} 
                    size="small" 
                    sx={{ width: '110px' }}  
                  >
                    <InputLabel id="sector-label">Sector</InputLabel>
                    <Select
                      labelId="sector-label"
                      id="sector-select"
                      multiple
                      value={filters.sector}
                      onChange={handleSectorChange}
                      input={<OutlinedInput id="select-sector" label="Sector" />}
                      renderValue={(selected) => (
                        <Box
                          sx={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          <Tooltip title={(selected as string[]).join(', ')}>
                            <Box sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {(selected as string[]).join(', ')}
                            </Box>
                          </Tooltip>
                        </Box>
                      )}
                      MenuProps={MenuProps}
                    >
                      {sectors.map((sector) => (
                        <MenuItem key={sector} value={sector}>
                          {sector}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                </Grid>
                
                {/* Category Dropdown */}
                <Grid item xs={12}>
                  <FormControl 
                      fullWidth={false} 
                      size="small" 
                      sx={{ width: '110px' }}
                      >
                    <InputLabel id="category-label">Category</InputLabel>
                    <Select
                      labelId="category-label"
                      id="category-select"
                      multiple
                      value={filters.category}
                      onChange={handleCategoryChange}
                      input={<OutlinedInput id="select-category" label="Category" />}
                      renderValue={(selected) => (
                         <Box
                          sx={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          <Tooltip title={(selected as string[]).join(', ')}>
                            <Box sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {(selected as string[]).join(', ')}
                            </Box>
                          </Tooltip>
                        </Box>
                      )}
                      MenuProps={MenuProps}
                    >
                      {categories.map((category) => (
                        <MenuItem key={category} value={category}>
                          {category}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
            
            {/* Data View Section */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <ChartIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="subtitle1" fontWeight="medium">Data View</Typography>
              </Box>
              <Grid container spacing={2}>
                {/* Attribute Selector */}
                <Grid item xs={12}>
                  <FormControl 
                      fullWidth={false} 
                      size="small" 
                      sx={{ width: '210px' }}
                      >
                    <InputLabel id="attribute-label">Grouping Attributes</InputLabel>
                    <Select
                      labelId="attribute-label"
                      id="attribute-select"
                      multiple
                      value={filters.attributes}
                      onChange={handleAttributeChange}
                      input={<OutlinedInput id="select-attribute" label="Grouping Attributes" />}
                      renderValue={(selected) => (
                         <Box
                          sx={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                        <Tooltip title={(selected as string[]).join(', ')}>
                            <Box sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {(selected as string[]).join(', ')}
                            </Box>
                        </Tooltip>
                        </Box>
                      )}
                      MenuProps={MenuProps}
                    >
                      {attributes.map((attribute) => (
                        <MenuItem key={attribute.value} value={attribute.value}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {attribute.icon}
                            <Typography sx={{ ml: 1 }}>{attribute.label}</Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                {/* Metric Selector */}
                <Grid item xs={12}>
                  <FormControl 
                      fullWidth={true} 
                      size="small" 
                      sx={{ width: '210px' }}
                      >
                    <InputLabel id="metric-label">Metrics</InputLabel>
                    <Select
                      labelId="metric-label"
                      id="metric-select"
                      multiple
                      value={filters.metrics}
                      onChange={handleMetricChange}
                      input={<OutlinedInput id="select-metric" label="Metrics" />}
                      renderValue={(selected) => (
                         <Box
                          sx={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          <Tooltip title={(selected as string[]).join(', ')}>
                            <Box sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {(selected as string[]).join(', ')}
                            </Box>
                          </Tooltip>
                        </Box>
                      )}
                      MenuProps={MenuProps}
                    >
                      {metrics.map((metric) => (
                        <MenuItem key={metric.value} value={metric.value}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {metric.icon}
                            <Typography sx={{ ml: 1 }}>{metric.label}</Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
            
            {/* Actions */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                <Button 
                  variant="outlined" 
                  onClick={resetFilters}
                  startIcon={<RefreshIcon />}
                  size="small"
                >
                  Reset All Filters
                </Button>
                <Button 
                  variant="contained" 
                  sx={{ ml: 2 }}
                  size="small"
                >
                  Apply Filters
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Collapse>
      
      {!expanded && activeFilterCount > 0 && (
        <Box sx={{ px: 2, py: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {filters.startDate && (
            <Chip 
              label={`From: ${filters.startDate.toLocaleDateString()}`} 
              size="small" 
              onDelete={() => handleDateChange('startDate', null)}
            />
          )}
          {filters.endDate && (
            <Chip 
              label={`To: ${filters.endDate.toLocaleDateString()}`} 
              size="small" 
              onDelete={() => handleDateChange('endDate', null)}
            />
          )}
          {filters.sector.map(sector => (
            <Chip 
              key={sector} 
              label={`Sector: ${sector}`} 
              size="small" 
              onDelete={() => updateFilters({ sector: filters.sector.filter(s => s !== sector) })}
            />
          ))}
          {filters.category.map(category => (
            <Chip 
              key={category} 
              label={`Category: ${category}`} 
              size="small" 
              onDelete={() => updateFilters({ category: filters.category.filter(c => c !== category) })}
            />
          ))}
        </Box>
      )}
    </Paper>
  );
};

export default FilterPanel;