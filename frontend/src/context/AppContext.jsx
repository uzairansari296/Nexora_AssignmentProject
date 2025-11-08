import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { createErrorMessage, createStorageHelper } from '../utils';

// Create storage helper for global state persistence
const appStateStorage = createStorageHelper('ecommerce_app_state');

// Action types
export const ACTION_TYPES = {
  // UI Actions
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_NOTIFICATION: 'SET_NOTIFICATION',
  CLEAR_NOTIFICATION: 'CLEAR_NOTIFICATION',
  
  // User Actions
  SET_USER: 'SET_USER',
  LOGOUT_USER: 'LOGOUT_USER',
  
  // App Settings
  SET_THEME: 'SET_THEME',
  SET_CURRENCY: 'SET_CURRENCY',
  SET_LANGUAGE: 'SET_LANGUAGE',
  
  // Search and Filters
  SET_SEARCH_QUERY: 'SET_SEARCH_QUERY',
  SET_CATEGORY_FILTER: 'SET_CATEGORY_FILTER',
  SET_PRICE_RANGE: 'SET_PRICE_RANGE',
  SET_SORT_ORDER: 'SET_SORT_ORDER',
  CLEAR_FILTERS: 'CLEAR_FILTERS'
};

// Initial state
const initialState = {
  // UI State
  loading: false,
  error: null,
  notification: null,
  
  // User State
  user: null,
  isAuthenticated: false,
  
  // App Settings
  theme: 'light',
  currency: 'USD',
  language: 'en',
  
  // Search and Filters
  searchQuery: '',
  categoryFilter: 'all',
  priceRange: { min: 0, max: 1000 },
  sortOrder: 'name-asc'
};

// Reducer function
const appReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
      
    case ACTION_TYPES.SET_ERROR:
      return {
        ...state,
        error: createErrorMessage(action.payload),
        loading: false
      };
      
    case ACTION_TYPES.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
      
    case ACTION_TYPES.SET_NOTIFICATION:
      return {
        ...state,
        notification: {
          message: action.payload.message,
          type: action.payload.type || 'info',
          duration: action.payload.duration || 5000
        }
      };
      
    case ACTION_TYPES.CLEAR_NOTIFICATION:
      return {
        ...state,
        notification: null
      };
      
    case ACTION_TYPES.SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload
      };
      
    case ACTION_TYPES.LOGOUT_USER:
      return {
        ...state,
        user: null,
        isAuthenticated: false
      };
      
    case ACTION_TYPES.SET_THEME:
      return {
        ...state,
        theme: action.payload
      };
      
    case ACTION_TYPES.SET_CURRENCY:
      return {
        ...state,
        currency: action.payload
      };
      
    case ACTION_TYPES.SET_LANGUAGE:
      return {
        ...state,
        language: action.payload
      };
      
    case ACTION_TYPES.SET_SEARCH_QUERY:
      return {
        ...state,
        searchQuery: action.payload
      };
      
    case ACTION_TYPES.SET_CATEGORY_FILTER:
      return {
        ...state,
        categoryFilter: action.payload
      };
      
    case ACTION_TYPES.SET_PRICE_RANGE:
      return {
        ...state,
        priceRange: action.payload
      };
      
    case ACTION_TYPES.SET_SORT_ORDER:
      return {
        ...state,
        sortOrder: action.payload
      };
      
    case ACTION_TYPES.CLEAR_FILTERS:
      return {
        ...state,
        searchQuery: '',
        categoryFilter: 'all',
        priceRange: { min: 0, max: 1000 },
        sortOrder: 'name-asc'
      };
      
    default:
      return state;
  }
};

// Context creation
const AppContext = createContext();

// Custom hook to use app context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// Action creators
export const useAppActions = () => {
  const { dispatch } = useAppContext();
  
  return {
    // UI Actions
    setLoading: (loading) => dispatch({ type: ACTION_TYPES.SET_LOADING, payload: loading }),
    setError: (error) => dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error }),
    clearError: () => dispatch({ type: ACTION_TYPES.CLEAR_ERROR }),
    
    showNotification: (message, type = 'info', duration = 5000) => 
      dispatch({ 
        type: ACTION_TYPES.SET_NOTIFICATION, 
        payload: { message, type, duration } 
      }),
    clearNotification: () => dispatch({ type: ACTION_TYPES.CLEAR_NOTIFICATION }),
    
    // User Actions
    setUser: (user) => dispatch({ type: ACTION_TYPES.SET_USER, payload: user }),
    logout: () => dispatch({ type: ACTION_TYPES.LOGOUT_USER }),
    
    // App Settings
    setTheme: (theme) => dispatch({ type: ACTION_TYPES.SET_THEME, payload: theme }),
    setCurrency: (currency) => dispatch({ type: ACTION_TYPES.SET_CURRENCY, payload: currency }),
    setLanguage: (language) => dispatch({ type: ACTION_TYPES.SET_LANGUAGE, payload: language }),
    
    // Search and Filters
    setSearchQuery: (query) => dispatch({ type: ACTION_TYPES.SET_SEARCH_QUERY, payload: query }),
    setCategoryFilter: (category) => dispatch({ type: ACTION_TYPES.SET_CATEGORY_FILTER, payload: category }),
    setPriceRange: (range) => dispatch({ type: ACTION_TYPES.SET_PRICE_RANGE, payload: range }),
    setSortOrder: (order) => dispatch({ type: ACTION_TYPES.SET_SORT_ORDER, payload: order }),
    clearFilters: () => dispatch({ type: ACTION_TYPES.CLEAR_FILTERS })
  };
};

// Provider component
export const AppProvider = ({ children }) => {
  // Initialize state from localStorage if available
  const [state, dispatch] = useReducer(appReducer, () => {
    const savedState = appStateStorage.get();
    return savedState ? { ...initialState, ...savedState } : initialState;
  });
  
  // Persist state to localStorage whenever it changes (excluding temporary UI state)
  useEffect(() => {
    const persistableState = {
      user: state.user,
      isAuthenticated: state.isAuthenticated,
      theme: state.theme,
      currency: state.currency,
      language: state.language,
      searchQuery: state.searchQuery,
      categoryFilter: state.categoryFilter,
      priceRange: state.priceRange,
      sortOrder: state.sortOrder
    };
    
    appStateStorage.set(persistableState);
  }, [state]);
  
  // Auto-clear notifications after their duration
  useEffect(() => {
    if (state.notification && state.notification.duration > 0) {
      const timer = setTimeout(() => {
        dispatch({ type: ACTION_TYPES.CLEAR_NOTIFICATION });
      }, state.notification.duration);
      
      return () => clearTimeout(timer);
    }
  }, [state.notification]);
  
  const contextValue = {
    state,
    dispatch
  };
  
  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Selectors (computed values from state)
export const useAppSelectors = () => {
  const { state } = useAppContext();
  
  return {
    // UI Selectors
    isLoading: state.loading,
    hasError: !!state.error,
    errorMessage: state.error,
    hasNotification: !!state.notification,
    notification: state.notification,
    
    // User Selectors
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    userName: state.user?.name || '',
    userEmail: state.user?.email || '',
    
    // App Settings Selectors
    isDarkTheme: state.theme === 'dark',
    currentTheme: state.theme,
    currentCurrency: state.currency,
    currentLanguage: state.language,
    
    // Filter Selectors
    hasActiveFilters: state.searchQuery !== '' || 
                     state.categoryFilter !== 'all' || 
                     state.priceRange.min > 0 || 
                     state.priceRange.max < 1000 ||
                     state.sortOrder !== 'name-asc',
    searchQuery: state.searchQuery,
    categoryFilter: state.categoryFilter,
    priceRange: state.priceRange,
    sortOrder: state.sortOrder
  };
};