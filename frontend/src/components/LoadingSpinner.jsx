import PropTypes from 'prop-types';
import { Box, CircularProgress, Typography, Backdrop } from '@mui/material';

const LoadingSpinner = ({ 
  size = 'medium', 
  message = 'Loading...', 
  overlay = false,
  color = 'primary'
}) => {
  const sizeMap = {
    small: 24,
    medium: 40,
    large: 60
  };

  const spinnerSize = typeof size === 'string' ? sizeMap[size] : size;

  const spinnerContent = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: overlay ? 0 : 6,
        gap: 2
      }}
    >
      <CircularProgress 
        size={spinnerSize} 
        thickness={4}
        color={color}
      />
      {message && (
        <Typography 
          variant="body1" 
          color={overlay ? "inherit" : "textSecondary"}
          sx={{ fontWeight: 500 }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );

  if (overlay) {
    return (
      <Backdrop
        sx={{ 
          color: '#fff', 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)'
        }}
        open={true}
      >
        {spinnerContent}
      </Backdrop>
    );
  }

  return spinnerContent;
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOfType([
    PropTypes.oneOf(['small', 'medium', 'large']),
    PropTypes.number
  ]),
  message: PropTypes.string,
  overlay: PropTypes.bool,
  color: PropTypes.oneOf(['primary', 'secondary', 'error', 'info', 'success', 'warning', 'inherit'])
};

export default LoadingSpinner;