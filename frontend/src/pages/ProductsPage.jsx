import PropTypes from 'prop-types';
import { Container } from '@mui/material';
import ProductGrid from '../components/ProductGrid';
import ErrorMessage from '../components/ErrorMessage';

const ProductsPage = ({ 
  products, 
  loading, 
  error, 
  onAddToCart, 
  onRetry 
}) => {
  return (
    <Container maxWidth={false} sx={{ 
      flex: 1,
      width: '100%',
      maxWidth: '100vw !important',
      px: { xs: 2, sm: 3, md: 4 },
      py: 2
    }}>
      {/* Global Error Messages */}
      {error && (
        <ErrorMessage 
          message={error} 
          onRetry={onRetry}
        />
      )}

      {/* Products Section - Full Width */}
      <ProductGrid
        products={products}
        loading={loading}
        error={error}
        onAddToCart={onAddToCart}
        onRetry={onRetry}
      />
    </Container>
  );
};

ProductsPage.propTypes = {
  products: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  onAddToCart: PropTypes.func.isRequired,
  onRetry: PropTypes.func.isRequired
};

export default ProductsPage;