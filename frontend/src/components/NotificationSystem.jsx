import React from 'react';
import { Snackbar, Alert, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useAppContext, useAppActions, ACTION_TYPES } from '../context/AppContext';

const NotificationSystem = () => {
  const { state } = useAppContext();
  const { clearNotification } = useAppActions();

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    clearNotification();
  };

  const { notification } = state;

  if (!notification) {
    return null;
  }

  return (
    <Snackbar
      open={true}
      autoHideDuration={notification.duration}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
    >
      <Alert
        onClose={handleClose}
        severity={notification.type}
        variant="filled"
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      >
        {notification.message}
      </Alert>
    </Snackbar>
  );
};

export default NotificationSystem;