import PropTypes from 'prop-types';
import { Alert, AlertTitle, Button, Box } from '@mui/material';
import { Refresh } from '@mui/icons-material';

const ErrorMessage = ({ message, onRetry, className = '' }) => {
  if (!message) return null;

  return (
    <Box sx={{ mb: 3 }} className={className}>
      <Alert 
        severity="error" 
        sx={{ 
          alignItems: 'center',
          '& .MuiAlert-message': {
            width: '100%'
          }
        }}
        action={
          onRetry && (
            <Button
              color="inherit"
              size="small"
              startIcon={<Refresh />}
              onClick={onRetry}
              sx={{ 
                fontWeight: 600,
                textTransform: 'none'
              }}
            >
              Try Again
            </Button>
          )
        }
      >
        <AlertTitle sx={{ fontWeight: 700 }}>Error</AlertTitle>
        {message}
      </Alert>
    </Box>
  );
};

ErrorMessage.propTypes = {
  message: PropTypes.string,
  onRetry: PropTypes.func,
  className: PropTypes.string
};

export default ErrorMessage;