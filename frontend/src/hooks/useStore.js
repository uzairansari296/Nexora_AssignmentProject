import { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchProducts, addToCart, fetchCart, removeCartItem, updateCartItem } from '../api';
import { createErrorMessage, createStorageHelper } from '../utils';

// Create storage helper for products cache
const productsStorage = createStorageHelper('ecommerce_products');

export const useProducts = () => {
  const [products, setProducts] = useState(() => {
    // Initialize from localStorage if available
    const cachedProducts = productsStorage.get();
    return cachedProducts || [];
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadProducts = useCallback(async (forceRefresh = false) => {
    try {
      // Check cache first if not forcing refresh
      if (!forceRefresh) {
        const cachedProducts = productsStorage.get();
        if (cachedProducts && cachedProducts.length > 0) {
          setProducts(cachedProducts);
          setLoading(false);
          return;
        }
      }

      setLoading(true);
      setError('');
      const data = await fetchProducts();

      // Deduplicate products received from the API (backend may occasionally return duplicates)
      // Prefer stable unique keys: id -> sku -> title
      let deduped = data;
      if (Array.isArray(data)) {
        deduped = Array.from(
          new Map(
            data.map((item) => [item.id ?? item.sku ?? item.title, item])
          ).values()
        );
      }

      // Enforce a frontend whitelist so only the intended products appear in the UI
      // This is a frontend-only safeguard; the permanent fix is to remove unwanted items in the backend.
      const allowedIds = new Set([1, 2, 3, 4]);
      const allowedNames = new Set(['Vibe Tee', 'Vibe Hoodie', 'Vibe Cap', 'Vibe Socks']);

      const filtered = deduped.filter((item) => {
        // Prefer numeric id match, fall back to name match when id is missing or non-numeric
        const numericId = Number(item?.id);
        if (!Number.isNaN(numericId) && allowedIds.has(numericId)) return true;
        if (typeof item?.name === 'string' && allowedNames.has(item.name)) return true;
        return false;
      });

      setProducts(filtered);

      // Cache the (deduplicated + filtered) products
      productsStorage.set(filtered);
    } catch (err) {
      const errorMessage = createErrorMessage(err);
      console.error('Error loading products:', err);

      // When the API is unreachable, fall back to a small trusted offline product list
      // so the frontend still shows the four allowed products the user requested.
      const offlineProducts = [
        { id: 1, name: 'Vibe Tee', price: 19.99, image: 'https://via.placeholder.com/200x200?text=Vibe+Tee' },
        { id: 2, name: 'Vibe Hoodie', price: 49.99, image: 'https://via.placeholder.com/200x200?text=Vibe+Hoodie' },
        { id: 3, name: 'Vibe Cap', price: 14.99, image: 'https://via.placeholder.com/200x200?text=Vibe+Cap' },
        { id: 4, name: 'Vibe Socks', price: 9.99, image: 'https://via.placeholder.com/200x200?text=Vibe+Socks' }
      ];

      // Notify the UI that we couldn't connect but we're showing offline products
      setError(errorMessage || 'Unable to connect to server. Showing offline products.');
      setProducts(offlineProducts);
      productsStorage.set(offlineProducts);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return { 
    products, 
    loading, 
    error, 
    refetch: () => loadProducts(true) 
  };
};

// Create storage helper for cart persistence
const cartStorage = createStorageHelper('ecommerce_cart');

export const useCart = () => {
  const [cart, setCart] = useState(() => {
    // Initialize from localStorage if available
    const savedCart = cartStorage.get();
    return savedCart || { items: [], total: 0 };
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Memoized cart statistics
  const cartStats = useMemo(() => {
    const items = cart.items || [];
    const itemCount = items.reduce((sum, item) => sum + (item.qty || 0), 0);
    const total = items.reduce((sum, item) => {
      const lineTotal = (item.price || 0) * (item.qty || 0);
      return sum + lineTotal;
    }, 0);
    
    return {
      itemCount,
      total: Number(total.toFixed(2)),
      isEmpty: items.length === 0
    };
  }, [cart.items]);

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    cartStorage.set(cart);
  }, [cart]);

  const loadCart = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await fetchCart();
      
      // Merge with local storage cart if needed
      const localCart = cartStorage.get();
      if (localCart && localCart.items?.length > 0 && (!data.items || data.items.length === 0)) {
        // Use local cart if server cart is empty
        setCart(localCart);
      } else {
        setCart(data);
      }
    } catch (err) {
      const errorMessage = createErrorMessage(err);
      setError(errorMessage);
      console.error('Error loading cart:', err);
      
      // Keep local cart if server fails
      const localCart = cartStorage.get();
      if (localCart) {
        setCart(localCart);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const handleAddToCart = useCallback(async (productId, qty = 1) => {
    try {
      setError('');
      
      // Optimistic update - find product in current items or create new
      const currentItems = cart.items || [];
      const existingItem = currentItems.find(item => item.productId === productId);
      
      let optimisticCart;
      if (existingItem) {
        optimisticCart = {
          ...cart,
          items: currentItems.map(item =>
            item.productId === productId
              ? { ...item, qty: item.qty + qty }
              : item
          )
        };
      } else {
        // Try to populate product details from cached products so optimistic cart is complete
        const cachedProducts = productsStorage.get() || [];
        const matched = cachedProducts.find(p => Number(p.id) === Number(productId) || p.id === productId);

        const price = matched ? Number(matched.price) || 0 : 0;
        const name = matched ? matched.name || 'Product' : 'Product';
        const image = matched ? matched.image || '' : '';
        const lineTotal = Number((price * qty).toFixed(2)) || 0;

        optimisticCart = {
          ...cart,
          items: [...currentItems, { productId, qty, price, name, image, lineTotal }]
        };
      }
      
      setCart(optimisticCart);
      
      // Make API call
      const updatedCart = await addToCart(productId, qty);
      setCart(updatedCart);
      return updatedCart;
    } catch (err) {
      const errorMessage = createErrorMessage(err);
      setError(errorMessage);
      console.error('Error adding to cart:', err);
      // Revert optimistic update
      await loadCart();
      throw err;
    }
  }, [cart, loadCart]);

  const handleRemoveFromCart = useCallback(async (cartItemId) => {
    try {
      setError('');
      
      // Optimistic update
      const optimisticCart = {
        ...cart,
        items: cart.items.filter(item => item.id !== cartItemId)
      };
      setCart(optimisticCart);
      
      // Make API call
      const updatedCart = await removeCartItem(cartItemId);
      setCart(updatedCart);
      return updatedCart;
    } catch (err) {
      const errorMessage = createErrorMessage(err);
      setError(errorMessage);
      console.error('Error removing from cart:', err);
      // Revert optimistic update
      await loadCart();
      throw err;
    }
  }, [cart, loadCart]);

  const handleUpdateQuantity = useCallback(async (cartItemId, quantity) => {
    try {
      setError('');
      
      // Optimistic update
      const optimisticCart = {
        ...cart,
        items: cart.items.map(item =>
          item.id === cartItemId ? { ...item, qty: quantity } : item
        )
      };
      setCart(optimisticCart);
      
      // Make API call
      const updatedCart = await updateCartItem(cartItemId, quantity);
      setCart(updatedCart);
      return updatedCart;
    } catch (err) {
      const errorMessage = createErrorMessage(err);
      setError(errorMessage);
      console.error('Error updating quantity:', err);
      // Revert optimistic update
      await loadCart();
      throw err;
    }
  }, [cart, loadCart]);

  const clearCart = useCallback(() => {
    const emptyCart = { items: [], total: 0 };
    setCart(emptyCart);
    cartStorage.set(emptyCart);
  }, []);

  // Backward compatibility
  const cartCount = cartStats.itemCount;

  return {
    cart,
    cartCount,
    cartStats,
    loading,
    error,
    handleAddToCart,
    handleRemoveFromCart,
    handleUpdateQuantity,
    refetchCart: loadCart,
    clearCart
  };
};