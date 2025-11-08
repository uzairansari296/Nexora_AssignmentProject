import PropTypes from 'prop-types';
import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Chip,
  IconButton,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { Delete } from '@mui/icons-material';

const CartItem = ({ item, onRemove, onUpdateQuantity, isRemoving = false }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleRemove = () => {
    if (!isRemoving) {
      onRemove(item.id);
    }
  };

  const handleQuantityChange = async (event) => {
    const newQuantity = parseInt(event.target.value, 10);
    if (onUpdateQuantity && newQuantity !== item.qty && !isUpdating) {
      setIsUpdating(true);
      try {
        await onUpdateQuantity(item.id, newQuantity);
      } catch (error) {
        console.error('Failed to update quantity:', error);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  return (
    <Card sx={{ mb: 2, '&:hover': { boxShadow: 3 } }}>
      <CardContent sx={{ p: 3 }}>
        <Grid container spacing={2} alignItems="center">
          {/* Product Image */}
          <Grid item xs={3} sm={2}>
            <Avatar
              src={item.image}
              alt={item.name}
              variant="rounded"
              sx={{
                width: { xs: 60, sm: 80 },
                height: { xs: 60, sm: 80 },
                backgroundColor: '#f5f5f5'
              }}
            />
          </Grid>

          {/* Product Details */}
          <Grid item xs={5} sm={6}>
            <Typography 
              variant="h6" 
              component="h4" 
              gutterBottom
              sx={{ 
                fontWeight: 600,
                fontSize: { xs: '1rem', sm: '1.1rem' }
              }}
            >
              {item.name}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1, alignItems: 'center' }}>
              <FormControl size="small" sx={{ minWidth: 80 }}>
                <InputLabel id={`quantity-label-${item.id}`}>Qty</InputLabel>
                <Select
                  labelId={`quantity-label-${item.id}`}
                  value={item.qty}
                  label="Qty"
                  onChange={handleQuantityChange}
                  disabled={isRemoving || isUpdating}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <MenuItem key={num} value={num}>
                      {num}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Chip
                label={`$${(Number(item?.price) || 0).toFixed(2)} each`}
                size="small"
                color="default"
                variant="outlined"
              />
            </Box>
          </Grid>

          {/* Price and Actions */}
          <Grid item xs={4} sm={4}>
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'flex-end',
                gap: 1
              }}
            >
              <Typography 
                variant="h6" 
                component="div"
                sx={{ 
                  fontWeight: 700,
                  color: 'success.main',
                  fontSize: { xs: '1.1rem', sm: '1.25rem' }
                }}
              >
                ${(() => {
                  const price = Number(item?.price) || 0;
                  const qty = Number(item?.qty) || 0;
                  const line = Number(item?.lineTotal ?? (price * qty)) || 0;
                  return line.toFixed(2);
                })()}
              </Typography>
              
              <Button
                variant="outlined"
                color="error"
                size="small"
                startIcon={<Delete />}
                onClick={handleRemove}
                disabled={isRemoving}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                {isRemoving ? 'Removing...' : 'Remove'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

CartItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    qty: PropTypes.number.isRequired,
    lineTotal: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired
  }).isRequired,
  onRemove: PropTypes.func.isRequired,
  onUpdateQuantity: PropTypes.func.isRequired,
  isRemoving: PropTypes.bool
};

export default CartItem;