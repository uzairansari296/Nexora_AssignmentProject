import React, { memo, useMemo, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Button,
  Paper,
  InputAdornment
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import ProductCard from './ProductCard.optimized';
import LoadingSpinner from './LoadingSpinner';
import { debounce } from '../utils';

const ProductGrid = memo(({
  products = [],
  loading = false,
  error = null,
  onAddToCart,
  cartItems = [],
  searchQuery = '',
  onSearchChange,
  categoryFilter = 'all',
  onCategoryChange,
  sortOrder = 'name-asc',
  onSortChange,
  priceRange = { min: 0, max: 1000 },
  onPriceRangeChange
}) => {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  // Debounced search function
  const debouncedSearch = useMemo(
    () => debounce((query) => {
      if (onSearchChange) {
        onSearchChange(query);
      }
    }, 300),
    [onSearchChange]
  );

  // Handle local search input
  const handleSearchInput = useCallback((e) => {
    const value = e.target.value;
    setLocalSearchQuery(value);
    debouncedSearch(value);
  }, [debouncedSearch]);

  // Clear search
  const handleClearSearch = useCallback(() => {
    setLocalSearchQuery('');
    if (onSearchChange) {
      onSearchChange('');
    }
  }, [onSearchChange]);

  // Get unique categories from products
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(products.map(p => p.category).filter(Boolean))];
    return ['all', ...uniqueCategories];
  }, [products]);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        (product.description && product.description.toLowerCase().includes(query)) ||
        (product.category && product.category.toLowerCase().includes(query))
      );
    }

    // Apply category filter
    if (categoryFilter && categoryFilter !== 'all') {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }

    // Apply price range filter
    if (priceRange) {
      filtered = filtered.filter(product => 
        product.price >= priceRange.min && product.price <= priceRange.max
      );
    }

    // Apply sorting
    if (sortOrder) {
      filtered = [...filtered].sort((a, b) => {
        switch (sortOrder) {
          case 'name-asc':
            return a.name.localeCompare(b.name);
          case 'name-desc':
            return b.name.localeCompare(a.name);
          case 'price-asc':
            return a.price - b.price;
          case 'price-desc':
            return b.price - a.price;
          case 'newest':
            return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
          case 'oldest':
            return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
          default:
            return 0;
        }
      });
    }

    return filtered;
  }, [products, searchQuery, categoryFilter, sortOrder, priceRange]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return searchQuery !== '' ||
           categoryFilter !== 'all' ||
           (priceRange && (priceRange.min > 0 || priceRange.max < 1000)) ||
           sortOrder !== 'name-asc';
  }, [searchQuery, categoryFilter, priceRange, sortOrder]);

  const handleClearAllFilters = useCallback(() => {
    setLocalSearchQuery('');
    if (onSearchChange) onSearchChange('');
    if (onCategoryChange) onCategoryChange('all');
    if (onSortChange) onSortChange('name-asc');
    if (onPriceRangeChange) onPriceRangeChange({ min: 0, max: 1000 });
  }, [onSearchChange, onCategoryChange, onSortChange, onPriceRangeChange]);

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="error" gutterBottom>
          Failed to load products
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Filters Section */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          {/* Search */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search products..."
              value={localSearchQuery}
              onChange={handleSearchInput}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: localSearchQuery && (
                  <InputAdornment position="end">
                    <Button
                      size="small"
                      onClick={handleClearSearch}
                      sx={{ minWidth: 'auto', p: 0.5 }}
                    >
                      <ClearIcon fontSize="small" />
                    </Button>
                  </InputAdornment>
                )
              }}
            />
          </Grid>

          {/* Category Filter */}
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryFilter}
                onChange={(e) => onCategoryChange && onCategoryChange(e.target.value)}
                label="Category"
              >
                {categories.map(category => (
                  <MenuItem key={category} value={category}>
                    {category === 'all' ? 'All Categories' : 
                     category.charAt(0).toUpperCase() + category.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Sort Order */}
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortOrder}
                onChange={(e) => onSortChange && onSortChange(e.target.value)}
                label="Sort By"
              >
                <MenuItem value="name-asc">Name A-Z</MenuItem>
                <MenuItem value="name-desc">Name Z-A</MenuItem>
                <MenuItem value="price-asc">Price: Low to High</MenuItem>
                <MenuItem value="price-desc">Price: High to Low</MenuItem>
                <MenuItem value="newest">Newest First</MenuItem>
                <MenuItem value="oldest">Oldest First</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Price Range */}
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <TextField
                type="number"
                placeholder="Min"
                size="small"
                value={priceRange?.min || ''}
                onChange={(e) => onPriceRangeChange && onPriceRangeChange({
                  ...priceRange,
                  min: Number(e.target.value) || 0
                })}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>
                }}
              />
              <Typography variant="body2">-</Typography>
              <TextField
                type="number"
                placeholder="Max"
                size="small"
                value={priceRange?.max || ''}
                onChange={(e) => onPriceRangeChange && onPriceRangeChange({
                  ...priceRange,
                  max: Number(e.target.value) || 1000
                })}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>
                }}
              />
            </Box>
          </Grid>

          {/* Clear Filters */}
          <Grid item xs={12} md={1}>
            {hasActiveFilters && (
              <Button
                variant="outlined"
                size="small"
                onClick={handleClearAllFilters}
                startIcon={<ClearIcon />}
                sx={{ textTransform: 'none' }}
              >
                Clear
              </Button>
            )}
          </Grid>
        </Grid>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {searchQuery && (
              <Chip
                label={`Search: "${searchQuery}"`}
                onDelete={() => {
                  setLocalSearchQuery('');
                  onSearchChange && onSearchChange('');
                }}
                size="small"
              />
            )}
            {categoryFilter !== 'all' && (
              <Chip
                label={`Category: ${categoryFilter}`}
                onDelete={() => onCategoryChange && onCategoryChange('all')}
                size="small"
              />
            )}
            {priceRange && (priceRange.min > 0 || priceRange.max < 1000) && (
              <Chip
                label={`Price: $${priceRange.min} - $${priceRange.max}`}
                onDelete={() => onPriceRangeChange && onPriceRangeChange({ min: 0, max: 1000 })}
                size="small"
              />
            )}
            {sortOrder !== 'name-asc' && (
              <Chip
                label={`Sort: ${sortOrder}`}
                onDelete={() => onSortChange && onSortChange('name-asc')}
                size="small"
              />
            )}
          </Box>
        )}
      </Paper>

      {/* Results Summary */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {loading ? 'Loading...' : `${filteredAndSortedProducts.length} product${filteredAndSortedProducts.length !== 1 ? 's' : ''} found`}
        </Typography>
      </Box>

      {/* Products Grid */}
      {loading ? (
        <LoadingSpinner message="Loading products..." />
      ) : (
        <>
          {filteredAndSortedProducts.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" gutterBottom>
                No products found
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Try adjusting your search criteria or filters
              </Typography>
              {hasActiveFilters && (
                <Button
                  variant="outlined"
                  onClick={handleClearAllFilters}
                  sx={{ mt: 2 }}
                >
                  Clear all filters
                </Button>
              )}
            </Box>
          ) : (
            <Grid container spacing={3}>
              {filteredAndSortedProducts.map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                  <ProductCard
                    product={product}
                    onAddToCart={onAddToCart}
                    cartItems={cartItems}
                    loading={loading}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}
    </Box>
  );
});

ProductGrid.displayName = 'ProductGrid';

ProductGrid.propTypes = {
  products: PropTypes.array,
  loading: PropTypes.bool,
  error: PropTypes.string,
  onAddToCart: PropTypes.func,
  cartItems: PropTypes.array,
  searchQuery: PropTypes.string,
  onSearchChange: PropTypes.func,
  categoryFilter: PropTypes.string,
  onCategoryChange: PropTypes.func,
  sortOrder: PropTypes.string,
  onSortChange: PropTypes.func,
  priceRange: PropTypes.shape({
    min: PropTypes.number,
    max: PropTypes.number
  }),
  onPriceRangeChange: PropTypes.func
};

export default ProductGrid;