import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';

// Context
import { AppProvider } from './context/AppContext';

// Custom Hooks
import { useProducts, useCart } from './hooks/useStore';
import { useCheckout } from './hooks/useCheckout';

// Components
import Header from './components/Header';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';
import NotificationSystem from './components/NotificationSystem';

// Pages
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ReceiptPage from './pages/ReceiptPage';

// Create MUI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    success: {
      main: '#2e7d32',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

// Main App Layout Component
function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  // Custom hooks for state management
  const {
    products,
    loading: productsLoading,
    error: productsError,
    refetch: refetchProducts
  } = useProducts();

  const {
    cart,
    cartCount,
    loading: _cartLoading,
    error: cartError,
    handleAddToCart,
    handleRemoveFromCart,
    handleUpdateQuantity,
    clearCart
  } = useCart();

  const {
    checkoutData,
    updateCheckoutData
  } = useCheckout();

  // Handle successful checkout
  const handleCheckoutSuccess = () => {
    clearCart();
    // Navigation handled in CheckoutPage
  };

  // Handle cart navigation
  const handleCartToggle = () => {
    if (location.pathname === '/cart') {
      navigate('/');
    } else {
      navigate('/cart');
    }
  };

  // Handle checkout navigation
  const handleCheckout = () => {
    navigate('/checkout', { state: { from: location.pathname } });
  };

  // Handle back navigation from cart
  const handleBackFromCart = () => {
    navigate('/');
  };

  // Show loading spinner while products are loading
  if (productsLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        width: '100vw'
      }}>
        <LoadingSpinner size="large" message="Loading Vibe Commerce..." />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      width: '100vw',
      backgroundColor: 'background.default',
      overflow: 'hidden' 
    }}>
      {/* Header */}
      <Header 
        cartCount={cartCount} 
        cartTotal={cart.total}
        onCartClick={handleCartToggle}
      />

      {/* Main Content */}
      <Box sx={{ 
        width: '100vw',
        minHeight: 'calc(100vh - 80px)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Routes>
          <Route 
            path="/" 
            element={
              <ProductsPage
                products={products}
                loading={productsLoading}
                error={productsError}
                onAddToCart={handleAddToCart}
                onRetry={refetchProducts}
              />
            } 
          />
          <Route 
            path="/cart" 
            element={
              <CartPage
                cart={cart}
                onRemoveItem={handleRemoveFromCart}
                onUpdateQuantity={handleUpdateQuantity}
                onCheckout={handleCheckout}
                error={cartError}
                onBackClick={handleBackFromCart}
              />
            } 
          />
          <Route 
            path="/checkout" 
            element={
              <CheckoutPage
                cart={cart}
                onCheckoutSuccess={handleCheckoutSuccess}
                checkoutData={checkoutData}
                onUpdateCheckoutData={updateCheckoutData}
              />
            } 
          />
          <Route 
            path="/receipt" 
            element={<ReceiptPage />} 
          />
        </Routes>
      </Box>
    </Box>
  );
}

// Main App Component with Router
function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <AppLayout />
          </Router>
          <NotificationSystem />
        </ThemeProvider>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;
