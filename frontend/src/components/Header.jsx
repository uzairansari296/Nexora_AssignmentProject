import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  Chip, 
  Badge,
  IconButton
} from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';

const Header = ({ cartCount, cartTotal, onCartClick }) => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <AppBar 
      position="static" 
      elevation={1}
      sx={{ 
        backgroundColor: 'background.paper', 
        marginBottom: 3
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          onClick={handleLogoClick}
          sx={{ 
            fontWeight: 700, 
            color: 'primary.main',
            letterSpacing: '-0.02em',
            cursor: 'pointer',
            '&:hover': {
              opacity: 0.8
            }
          }}
        >
          Vibe Commerce
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            onClick={onCartClick}
            sx={{
              backgroundColor: 'rgba(25, 118, 210, 0.04)',
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.12)',
              }
            }}
          >
            <Badge 
              badgeContent={cartCount} 
              color="primary"
              sx={{
                '& .MuiBadge-badge': {
                  right: -3,
                  top: 3,
                  fontWeight: 600
                }
              }}
            >
              <ShoppingCart color="primary" sx={{ fontSize: 28 }} />
            </Badge>
          </IconButton>
          
          <Chip
            label={`$${cartTotal.toFixed(2)}`}
            color="success"
            variant="filled"
            sx={{
              fontWeight: 700,
              fontSize: '1rem',
              height: 36,
              '& .MuiChip-label': {
                px: 2
              }
            }}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

Header.propTypes = {
  cartCount: PropTypes.number.isRequired,
  cartTotal: PropTypes.number.isRequired,
  onCartClick: PropTypes.func.isRequired
};

export default Header;