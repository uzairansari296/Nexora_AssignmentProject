import PropTypes from 'prop-types';
import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Divider,
  IconButton
} from '@mui/material';
import { ShoppingCartCheckout, ShoppingCartOutlined, ArrowBack } from '@mui/icons-material';
import CartItem from './CartItem';
import ErrorMessage from './ErrorMessage';

const Cart = ({ cart, onRemoveItem, onUpdateQuantity, onCheckout, error, onBackClick }) => {
  const [removingItems, setRemovingItems] = useState(new Set());

  const handleRemoveItem = async (itemId) => {
    if (removingItems.has(itemId)) return;

    setRemovingItems(prev => new Set(prev).add(itemId));
    
    try {
      await onRemoveItem(itemId);
    } catch (error) {
      console.error('Failed to remove item:', error);
    } finally {
      setRemovingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const isEmpty = !cart.items || cart.items.length === 0;

  return (
    <Box component="section" sx={{ mb: 4, width: '100%' }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: 3,
        gap: 2
      }}>
        {onBackClick && (
          <IconButton 
            onClick={onBackClick}
            sx={{ 
              backgroundColor: 'rgba(25, 118, 210, 0.04)',
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.12)',
              }
            }}
          >
            <ArrowBack color="primary" />
          </IconButton>
        )}
        <Typography 
          variant="h4" 
          component="h2" 
          sx={{ 
            fontWeight: 700,
            color: 'primary.main',
            flex: 1
          }}
        >
          Shopping Cart
        </Typography>
      </Box>
        
        {error && <ErrorMessage message={error} />}
        
        {isEmpty ? (
          <Paper 
            sx={{ 
              p: 6, 
              textAlign: 'center',
              backgroundColor: '#fafafa'
            }}
          >
            <ShoppingCartOutlined sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h5" gutterBottom color="textSecondary">
              Your cart is empty
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Add some products to get started!
            </Typography>
          </Paper>
        ) : (
          <Paper sx={{ p: 3 }}>
            {/* Cart Items */}
            <Box sx={{ mb: 3 }}>
              {cart.items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onRemove={handleRemoveItem}
                  onUpdateQuantity={onUpdateQuantity}
                  isRemoving={removingItems.has(item.id)}
                />
              ))}
            </Box>
            
            <Divider sx={{ my: 3 }} />
            
            {/* Cart Summary */}
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 2
              }}
            >
              <Typography 
                variant="h5" 
                component="div"
                sx={{ 
                  fontWeight: 700,
                  color: 'success.main'
                }}
              >
                Total: ${cart.total.toFixed(2)}
              </Typography>
              
              <Button
                variant="contained"
                size="large"
                startIcon={<ShoppingCartCheckout />}
                onClick={onCheckout}
                disabled={isEmpty}
                sx={{
                  py: 1.5,
                  px: 4,
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '1.1rem'
                }}
              >
                Proceed to Checkout
              </Button>
            </Box>
          </Paper>
        )}
    </Box>
  );
};

Cart.propTypes = {
  cart: PropTypes.shape({
    items: PropTypes.array,
    total: PropTypes.number
  }).isRequired,
  onRemoveItem: PropTypes.func.isRequired,
  onUpdateQuantity: PropTypes.func.isRequired,
  onCheckout: PropTypes.func.isRequired,
  error: PropTypes.string,
  onBackClick: PropTypes.func
};

export default Cart;