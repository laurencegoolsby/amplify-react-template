import { useState } from 'react';

export const useAlert = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error'>('success');
  const [alertFading, setAlertFading] = useState(false);

  const showAlertMessage = (message: string, type: 'success' | 'error') => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => {
      setAlertFading(true);
      setTimeout(() => {
        setShowAlert(false);
        setAlertFading(false);
      }, 300);
    }, 4000);
  };

  const closeAlert = () => {
    setAlertFading(true);
    setTimeout(() => {
      setShowAlert(false);
      setAlertFading(false);
    }, 300);
  };

  return {
    showAlert,
    alertMessage,
    alertType,
    alertFading,
    showAlertMessage,
    closeAlert
  };
};