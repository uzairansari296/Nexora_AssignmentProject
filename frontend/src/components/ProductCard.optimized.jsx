import React, { memo, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  IconButton,
  Chip,
  Tooltip,
  Fade
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  ShoppingCart as CartIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon
} from '@mui/icons-material';
import { formatCurrency } from '../utils';
import { THEME_COLORS } from '../constants';

const ProductCard = memo(({
  product,
  onAddToCart,
  cartItems = [],
  loading = false,
  showQuickActions = true,
  showFavorite = true
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Find current cart item for this product
  const cartItem = cartItems.find(item => item.productId === product.id);
  const isInCart = !!cartItem;
  const cartQuantity = cartItem?.qty || 0;

  const handleAddToCart = useCallback(() => {
    if (onAddToCart) {
      onAddToCart(product, quantity);
    }
  }, [onAddToCart, product, quantity]);

  const handleQuantityChange = useCallback((delta) => {
    setQuantity(prev => Math.max(1, prev + delta));
  }, []);

  const handleFavoriteToggle = useCallback(() => {
    setIsFavorite(prev => !prev);
  }, []);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(true);
  }, []);

  // Determine if product is on sale or has special status
  const isOnSale = product.originalPrice && product.price < product.originalPrice;
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4
        },
        opacity: isOutOfStock ? 0.6 : 1
      }}
    >
      {/* Status Badges */}
      <Box sx={{ position: 'absolute', top: 8, left: 8, zIndex: 1 }}>
        {isOnSale && (
          <Chip
            label="SALE"
            size="small"
            sx={{
              backgroundColor: THEME_COLORS.error,
              color: 'white',
              fontWeight: 'bold',
              mb: 0.5
            }}
          />
        )}
        {isLowStock && !isOutOfStock && (
          <Chip
            label={`Only ${product.stock} left`}
            size="small"
            color="warning"
            variant="outlined"
          />
        )}
        {isOutOfStock && (
          <Chip
            label="Out of Stock"
            size="small"
            sx={{
              backgroundColor: '#666',
              color: 'white'
            }}
          />
        )}
      </Box>

      {/* Favorite Button */}
      {showFavorite && (
        <IconButton
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 1,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 1)'
            }
          }}
          onClick={handleFavoriteToggle}
          size="small"
        >
          {isFavorite ? (
            <FavoriteIcon color="error" />
          ) : (
            <FavoriteBorderIcon />
          )}
        </IconButton>
      )}

      {/* Product Image */}
      <Box sx={{ position: 'relative', paddingTop: '75%' }}>
        {!imageLoaded && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f5f5f5'
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Loading...
            </Typography>
          </Box>
        )}
        
        {!imageError ? (
          <CardMedia
            component="img"
            image={product.image || '/placeholder-image.jpg'}
            alt={product.name}
            onLoad={handleImageLoad}
            onError={handleImageError}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: imageLoaded ? 1 : 0,
              transition: 'opacity 0.3s ease'
            }}
          />
        ) : (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f5f5f5',
              color: 'text.secondary'
            }}
          >
            <Typography variant="body2">
              No Image
            </Typography>
          </Box>
        )}
      </Box>

      {/* Product Info */}
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Tooltip title={product.name} placement="top">
          <Typography
            gutterBottom
            variant="h6"
            component="div"
            sx={{
              fontSize: '1rem',
              fontWeight: 600,
              lineHeight: 1.2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical'
            }}
          >
            {product.name}
          </Typography>
        </Tooltip>

        {product.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              mb: 1
            }}
          >
            {product.description}
          </Typography>
        )}

        {/* Price Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 'auto' }}>
          <Typography
            variant="h6"
            component="span"
            sx={{
              fontWeight: 'bold',
              color: isOnSale ? THEME_COLORS.error : 'text.primary'
            }}
          >
            {formatCurrency(product.price)}
          </Typography>
          
          {isOnSale && (
            <Typography
              variant="body2"
              component="span"
              sx={{
                textDecoration: 'line-through',
                color: 'text.secondary'
              }}
            >
              {formatCurrency(product.originalPrice)}
            </Typography>
          )}
        </Box>

        {/* Cart Status */}
        {isInCart && (
          <Chip
            icon={<CartIcon />}
            label={`${cartQuantity} in cart`}
            size="small"
            color="success"
            variant="outlined"
            sx={{ mt: 1 }}
          />
        )}
      </CardContent>

      {/* Actions */}
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Box sx={{ display: 'flex', width: '100%', gap: 1 }}>
          {showQuickActions && !isOutOfStock && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <IconButton
                size="small"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                <RemoveIcon />
              </IconButton>
              
              <Typography
                variant="body2"
                sx={{
                  minWidth: '20px',
                  textAlign: 'center',
                  fontWeight: 'bold'
                }}
              >
                {quantity}
              </Typography>
              
              <IconButton
                size="small"
                onClick={() => handleQuantityChange(1)}
              >
                <AddIcon />
              </IconButton>
            </Box>
          )}

          <Button
            fullWidth
            variant="contained"
            startIcon={<CartIcon />}
            onClick={handleAddToCart}
            disabled={loading || isOutOfStock}
            sx={{
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </Box>
      </CardActions>
    </Card>
  );
});

ProductCard.displayName = 'ProductCard';

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    originalPrice: PropTypes.number,
    image: PropTypes.string,
    description: PropTypes.string,
    stock: PropTypes.number
  }).isRequired,
  onAddToCart: PropTypes.func,
  cartItems: PropTypes.array,
  loading: PropTypes.bool,
  showQuickActions: PropTypes.bool,
  showFavorite: PropTypes.bool
};

export default ProductCard;