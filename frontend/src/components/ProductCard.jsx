import PropTypes from 'prop-types';
import { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip
} from '@mui/material';
import { AddShoppingCart } from '@mui/icons-material';

const ProductCard = ({ product, onAddToCart, loading = false }) => {
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    if (isAdding || loading) return;
    
    try {
      setIsAdding(true);
      await onAddToCart(product.id);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6
        }
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={product.image}
        alt={product.name}
        loading="lazy"
        sx={{
          objectFit: 'cover',
          backgroundColor: '#f5f5f5'
        }}
      />
      
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Typography 
          gutterBottom 
          variant="h6" 
          component="h3"
          sx={{ 
            fontWeight: 600,
            fontSize: '1.1rem',
            lineHeight: 1.3,
            mb: 1
          }}
        >
          {product.name}
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Chip
            label={`$${product.price.toFixed(2)}`}
            color="success"
            variant="filled"
            sx={{
              fontWeight: 700,
              fontSize: '1rem'
            }}
          />
        </Box>
      </CardContent>
      
      <CardActions sx={{ px: 2, pb: 2 }}>
        <Button
          variant="contained"
          fullWidth
          startIcon={<AddShoppingCart />}
          onClick={handleAddToCart}
          disabled={isAdding || loading}
          sx={{
            py: 1.5,
            fontWeight: 600,
            textTransform: 'none',
            fontSize: '1rem'
          }}
        >
          {isAdding ? 'Adding...' : 'Add to Cart'}
        </Button>
      </CardActions>
    </Card>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired
  }).isRequired,
  onAddToCart: PropTypes.func.isRequired,
  loading: PropTypes.bool
};

export default ProductCard;