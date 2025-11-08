import PropTypes from 'prop-types';
import {
  Box,
  Grid,
  Typography,
  Paper
} from '@mui/material';
import { Inventory } from '@mui/icons-material';
import ProductCard from './ProductCard';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

const ProductGrid = ({ products, loading, error, onAddToCart, onRetry }) => {
  if (loading) {
    return <LoadingSpinner message="Loading products..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={onRetry} />;
  }

  if (!products || products.length === 0) {
    return (
      <Paper 
        sx={{ 
          p: 6, 
          textAlign: 'center',
          backgroundColor: '#fafafa'
        }}
      >
        <Inventory sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
        <Typography variant="h5" gutterBottom color="textSecondary">
          No products available
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Check back later for new items!
        </Typography>
      </Paper>
    );
  }

  return (
    <Box component="section" sx={{ mb: 4, width: '100%' }}>
      <Typography 
        variant="h4" 
        component="h2" 
        gutterBottom
        sx={{ 
          fontWeight: 700,
          mb: 4,
          color: 'primary.main',
          textAlign: 'center'
        }}
      >
        Our Products
      </Typography>
      
      <Grid container spacing={3} sx={{ width: '100%', m: 0 }}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4} key={product.id}>
            <ProductCard
              product={product}
              onAddToCart={onAddToCart}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

ProductGrid.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      image: PropTypes.string.isRequired
    })
  ),
  loading: PropTypes.bool,
  error: PropTypes.string,
  onAddToCart: PropTypes.func.isRequired,
  onRetry: PropTypes.func
};

export default ProductGrid;