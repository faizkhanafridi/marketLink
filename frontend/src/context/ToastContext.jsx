import React, { createContext, useCallback } from 'react';
import { toast } from 'react-toastify';

export const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const success = useCallback((message) => toast.success(message), []);
  const error = useCallback((message) => toast.error(message), []);
  const info = useCallback((message) => toast.info(message), []);
  const warning = useCallback((message) => toast.warning(message), []);

  const showApiError = useCallback((err, fallback = 'Something went wrong') => {
    const errors = err?.response?.data?.errors;
    if (errors && typeof errors === 'object') {
      Object.values(errors).flat().forEach((msg) => toast.error(msg));
    } else {
      toast.error(err?.response?.data?.message || fallback);
    }
  }, []);

  const value = { success, error, info, warning, showApiError };

  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  );
};