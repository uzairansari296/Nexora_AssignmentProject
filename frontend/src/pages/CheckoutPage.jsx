import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Divider,
  IconButton,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar
} from '@mui/material';
import { ArrowBack, ShoppingCartCheckout } from '@mui/icons-material';
import { checkout } from '../api';

const CheckoutPage = ({ 
  cart, 
  onCheckoutSuccess,
  checkoutData,
  onUpdateCheckoutData
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!checkoutData.name.trim() || !checkoutData.email.trim()) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const receipt = await checkout(checkoutData.name, checkoutData.email);
      onCheckoutSuccess(receipt);
      
      // Navigate to success page or back to products
      navigate('/receipt', { state: { receipt } });
    } catch (err) {
      setError('Checkout failed. Please try again.');
      console.error('Checkout error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    // Go back to previous page or cart
    const from = location.state?.from || '/cart';
    navigate(from);
  };

  const isEmpty = !cart.items || cart.items.length === 0;

  if (isEmpty) {
    return (
      <Container maxWidth="md" sx={{ py: 2 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Your cart is empty
          </Typography>
          <Button variant="contained" onClick={() => navigate('/')}>
            Continue Shopping
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: 3,
        gap: 2
      }}>
        <IconButton 
          onClick={handleBack}
          sx={{ 
            backgroundColor: 'rgba(25, 118, 210, 0.04)',
            '&:hover': {
              backgroundColor: 'rgba(25, 118, 210, 0.08)',
            }
          }}
        >
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          Checkout
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Order Summary */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Order Summary
            </Typography>
            
            <List>
              {cart.items.map((item) => (
                <ListItem key={item.id} sx={{ px: 0, py: 1 }}>
                  <ListItemAvatar>
                    <Avatar 
                      src={item.image} 
                      alt={item.name}
                      sx={{ width: 50, height: 50 }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={item.name}
                    secondary={`Quantity: ${item.qty}`}
                    sx={{ ml: 2 }}
                  />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    ${(item.price * item.qty).toFixed(2)}
                  </Typography>
                </ListItem>
              ))}
            </List>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center' 
            }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Total:
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ fontWeight: 700, color: 'success.main' }}
              >
                ${cart.total.toFixed(2)}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Checkout Form */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Billing Information
            </Typography>
            
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={checkoutData.name}
                    onChange={(e) => onUpdateCheckoutData('name', e.target.value)}
                    required
                    variant="outlined"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    value={checkoutData.email}
                    onChange={(e) => onUpdateCheckoutData('email', e.target.value)}
                    required
                    variant="outlined"
                  />
                </Grid>
              </Grid>

              {error && (
                <Typography color="error" sx={{ mt: 2, mb: 2 }}>
                  {error}
                </Typography>
              )}

              <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={handleBack}
                  disabled={loading}
                >
                  Back to Cart
                </Button>
                
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading || isEmpty}
                  startIcon={<ShoppingCartCheckout />}
                  sx={{ px: 4 }}
                >
                  {loading ? 'Processing...' : 'Complete Order'}
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

CheckoutPage.propTypes = {
  cart: PropTypes.shape({
    items: PropTypes.array,
    total: PropTypes.number
  }).isRequired,
  onCheckoutSuccess: PropTypes.func.isRequired,
  checkoutData: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string
  }).isRequired,
  onUpdateCheckoutData: PropTypes.func.isRequired
};

export default CheckoutPage;