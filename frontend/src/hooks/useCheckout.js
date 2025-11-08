import { useState, useCallback, useMemo } from 'react';
import { validateCheckoutForm, createStorageHelper } from '../utils';

// Create storage helper for checkout form persistence
const checkoutStorage = createStorageHelper('ecommerce_checkout');

export const useCheckout = () => {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutData, setCheckoutData] = useState(() => {
    // Initialize from localStorage if available
    const savedData = checkoutStorage.get();
    return savedData || {
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      postalCode: '',
      paymentMethod: 'credit-card',
      saveInfo: false
    };
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  // Memoized form validation
  const formValidation = useMemo(() => {
    return validateCheckoutForm(checkoutData);
  }, [checkoutData]);

  const openCheckout = useCallback(() => {
    setIsCheckoutOpen(true);
    setError('');
    setValidationErrors({});
  }, []);

  const closeCheckout = useCallback(() => {
    setIsCheckoutOpen(false);
    setError('');
    setValidationErrors({});
    
    // Only clear form if user doesn't want to save info
    if (!checkoutData.saveInfo) {
      const defaultData = {
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        paymentMethod: 'credit-card',
        saveInfo: false
      };
      setCheckoutData(defaultData);
      checkoutStorage.remove();
    }
  }, [checkoutData.saveInfo]);

  const updateCheckoutData = useCallback((field, value) => {
    setCheckoutData(prev => {
      const updated = {
        ...prev,
        [field]: value
      };
      
      // Save to localStorage if user wants to save info
      if (updated.saveInfo) {
        checkoutStorage.set(updated);
      } else {
        checkoutStorage.remove();
      }
      
      return updated;
    });
    
    // Clear field-specific validation error
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  }, [validationErrors]);

  const updateMultipleFields = useCallback((fieldsObject) => {
    setCheckoutData(prev => {
      const updated = {
        ...prev,
        ...fieldsObject
      };
      
      // Save to localStorage if user wants to save info
      if (updated.saveInfo) {
        checkoutStorage.set(updated);
      }
      
      return updated;
    });
  }, []);

  const setCheckoutError = useCallback((errorMessage) => {
    setError(errorMessage);
  }, []);

  const setFieldError = useCallback((field, errorMessage) => {
    setValidationErrors(prev => ({
      ...prev,
      [field]: errorMessage
    }));
  }, []);

  const clearErrors = useCallback(() => {
    setError('');
    setValidationErrors({});
  }, []);

  const validateForm = useCallback(() => {
    const validation = validateCheckoutForm(checkoutData);
    setValidationErrors(validation.errors);
    return validation.isValid;
  }, [checkoutData]);

  const resetForm = useCallback(() => {
    const defaultData = {
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      postalCode: '',
      paymentMethod: 'credit-card',
      saveInfo: false
    };
    setCheckoutData(defaultData);
    setValidationErrors({});
    setError('');
    checkoutStorage.remove();
  }, []);

  return {
    isCheckoutOpen,
    checkoutData,
    loading,
    error,
    validationErrors,
    formValidation,
    openCheckout,
    closeCheckout,
    updateCheckoutData,
    updateMultipleFields,
    setLoading,
    setCheckoutError,
    setFieldError,
    clearErrors,
    validateForm,
    resetForm
  };
};