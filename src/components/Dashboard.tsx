import { useState, useEffect } from 'react';
import { 
  Box, 
  AppBar, 
  Toolbar, 
  Typography, 
  Tabs, 
  Tab, 
  useTheme, 
  useMediaQuery,
  Drawer,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { 
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  BarChart as BarChartIcon,
  ShowChart as ShowChartIcon,
  Settings as SettingsIcon,
  Help as HelpIcon
} from '@mui/icons-material';
import UserSelector from './UserSelector';
import MetricsView from '../views/MetricsView';
import AnalyticsView from '../views/AnalyticsView';
import { useDashboard } from '../context/DashboardContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      style={{ width: '100%' }}
      {...other}
    >
      {value === index && (
        <Box sx={{ width: '100%' }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `dashboard-tab-${index}`,
    'aria-controls': `dashboard-tabpanel-${index}`,
  };
}

const DRAWER_WIDTH = 240;

const Dashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { currentUser } = useDashboard();
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  useEffect(() => {
    if (!isMobile && mobileOpen) {
      setMobileOpen(false);
    }
  }, [isMobile, mobileOpen]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    if (isMobile) {
      setMobileOpen(false);
    }
  };
  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  const drawer = (
    <Box sx={{ overflow: 'auto' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Dashboard
        </Typography>
      </Box>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton 
            selected={tabValue === 0}
            onClick={() => handleTabChange({} as React.SyntheticEvent, 0)}
            sx={{ 
              borderRadius: 1,
              mx: 1,
              '&.Mui-selected': {
                bgcolor: 'primary.light',
              }
            }}
          >
            <ListItemIcon>
              <BarChartIcon color={tabValue === 0 ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText 
              primary="Metrics View" 
              primaryTypographyProps={{ 
                fontWeight: tabValue === 0 ? 'bold' : 'regular'
              }}
            />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton 
            selected={tabValue === 1}
            onClick={() => handleTabChange({} as React.SyntheticEvent, 1)}
            sx={{ 
              borderRadius: 1,
              mx: 1,
              '&.Mui-selected': {
                bgcolor: 'primary.light',
              }
            }}
          >
            <ListItemIcon>
              <ShowChartIcon color={tabValue === 1 ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText 
              primary="Analytics View" 
              primaryTypographyProps={{ 
                fontWeight: tabValue === 1 ? 'bold' : 'regular'
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      
      
      {isMobile && (
        <>
          <Divider />
          <Box sx={{ p: 2 }}>
            <UserSelector />
          </Box>
        </>
      )}
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          background: 'linear-gradient(90deg, #4dabf5 0%, #2196f3 100%)',
          borderRadius: 0
        }}
      >
        <Toolbar sx={{ 
          minHeight: '70px',
          px: { xs: 2, sm: 3 }
        }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
            <DashboardIcon sx={{ 
              mr: 1.5, 
              fontSize: '28px',
              filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.3))'
            }} />
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                fontWeight: 'bold',
                letterSpacing: '0.5px',
                textShadow: '0px 1px 2px rgba(0,0,0,0.3)'
              }}
            >
              Dashboard
            </Typography>
          </Box>
          
          <Box sx={{ flexGrow: 1 }} />
          
          {!isMobile && (
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              aria-label="dashboard tabs"
              sx={{ 
                '& .MuiTab-root': { 
                  color: 'white',
                  opacity: 0.8,
                  minHeight: '70px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    opacity: 1,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  },
                  '&.Mui-selected': {
                    opacity: 1,
                    fontWeight: 'bold',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)'
                  }
                },
                '& .MuiTabs-indicator': {
                  height: 3,
                  backgroundColor: 'white'
                }
              }}
            >
            </Tabs>
          )}
          
          <Box sx={{ flexGrow: 1 }} />
          
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: 1
          }}>
            {!isMobile && <UserSelector />}
          </Box>
        </Toolbar>
      </AppBar>
      
      <Box
        component="nav"
        sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, 
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: DRAWER_WIDTH,
              borderRadius: 0
            },
          }}
        >
          {drawer}
        </Drawer>
        
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: DRAWER_WIDTH,
              borderRight: '1px solid rgba(0, 0, 0, 0.12)',
              boxShadow: 'none'
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          px: '5px', 
          py: 2, 
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          bgcolor: '#f5f5f5',
          minHeight: '100vh',
          maxWidth: '100%',
          boxSizing: 'border-box'
        }}
      >
        <Toolbar />
        <Box sx={{ width: '100%' }}>
          <TabPanel value={tabValue} index={0}>
            <MetricsView />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <AnalyticsView />
          </TabPanel>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;