import PropTypes from 'prop-types';
import { Container } from '@mui/material';
import Cart from '../components/Cart';

const CartPage = ({ 
  cart, 
  onRemoveItem, 
  onUpdateQuantity,
  onCheckout, 
  error, 
  onBackClick 
}) => {
  return (
    <Container maxWidth={false} sx={{ 
      flex: 1,
      width: '100%',
      maxWidth: '100vw !important',
      px: { xs: 2, sm: 3, md: 4 },
      py: 2
    }}>
      <Cart
        cart={cart}
        onRemoveItem={onRemoveItem}
        onUpdateQuantity={onUpdateQuantity}
        onCheckout={onCheckout}
        error={error}
        onBackClick={onBackClick}
      />
    </Container>
  );
};

CartPage.propTypes = {
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

export default CartPage;