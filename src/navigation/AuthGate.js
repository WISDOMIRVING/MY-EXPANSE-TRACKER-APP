import React from 'react';
import { useAppContext } from '../context/AppContext';
import VerificationScreen from '../screens/VerificationScreen';
import AppNavigator from './AppNavigator';

const AuthGate = () => {
  const { isVerified } = useAppContext();

  if (!isVerified) {
    return <VerificationScreen />;
  }

  return <AppNavigator />;
};

export default AuthGate;
