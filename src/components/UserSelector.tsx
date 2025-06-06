import { useState } from 'react';
import { 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemText, 
  Avatar, 
  Box, 
  Typography,
  Chip,
  Tooltip,
  IconButton,
  DialogActions
} from '@mui/material';
import { 
  Person as PersonIcon, 
  ArrowDropDown as ArrowDropDownIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import type { User } from '../types';
import { useDashboard } from '../context/DashboardContext';

const UserSelector = () => {
  const { users, currentUser, setCurrentUser } = useDashboard();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleUserSelect = (user: User) => {
    setCurrentUser(user);
    handleClose();
  };

  const getRoleColor = (role: string) => {
    const roleColors: Record<string, string> = {
      'Manager': 'primary',
      'Analyst': 'info',
      'Director': 'secondary',
      'Executive': 'error',
      'Consultant': 'success'
    };
    return roleColors[role] || 'default';
  };

  return (
    <>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleOpen}
        endIcon={<ArrowDropDownIcon />}
        startIcon={
          currentUser ? (
            <Avatar 
              sx={{ 
                width: 24, 
                height: 24, 
                fontSize: '0.875rem',
                bgcolor: 'primary.dark'
              }}
            >
              {currentUser.name.charAt(0)}
            </Avatar>
          ) : (
            <PersonIcon />
          )
        }
        sx={{ 
          borderRadius: '20px',
          px: 2,
          textTransform: 'none',
          fontWeight: 'medium'
        }}
      >
        {currentUser ? currentUser.name : 'Select User'}
      </Button>
      
      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Select User</Typography>
            <IconButton onClick={handleClose} size="small">
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent dividers>
          <List sx={{ pt: 0 }}>
            {users.map((user) => (
              <ListItem 
                key={user.id} 
                disablePadding
                secondaryAction={
                  <Chip 
                    label={user.role} 
                    size="small" 
                    color={getRoleColor(user.role) as any}
                    variant="outlined"
                  />
                }
              >
                <ListItemButton 
                  onClick={() => handleUserSelect(user)}
                  selected={currentUser?.id === user.id}
                  sx={{ 
                    borderRadius: 1,
                    py: 1.5,
                    '&.Mui-selected': {
                      backgroundColor: 'primary.light',
                      '&:hover': {
                        backgroundColor: 'primary.light',
                      }
                    }
                  }}
                >
                  <Tooltip title={`Switch to ${user.name}`} placement="top">
                    <Avatar 
                      sx={{ 
                        mr: 2, 
                        bgcolor: currentUser?.id === user.id ? 'primary.dark' : 'primary.main'
                      }}
                    >
                      {user.name.charAt(0)}
                    </Avatar>
                  </Tooltip>
                  <ListItemText 
                    primary={
                      <Typography variant="body1" fontWeight={currentUser?.id === user.id ? 'bold' : 'regular'}>
                        {user.name}
                      </Typography>
                    } 
                    secondary={user.email}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserSelector;