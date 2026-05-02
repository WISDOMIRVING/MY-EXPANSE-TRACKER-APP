// Sovereign Ledger — Cross-Platform App Entry Point
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ActivityIndicator, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Font from 'expo-font';
import { 
  Inter_400Regular, 
  Inter_500Medium, 
  Inter_600SemiBold, 
  Inter_700Bold 
} from '@expo-google-fonts/inter';

import { AppProvider } from './src/context/AppContext';
import AuthGate from './src/navigation/AuthGate';

// Web-specific meta tags for SEO
if (Platform.OS === 'web' && typeof document !== 'undefined') {
  // Set page title
  document.title = 'Sovereign Ledger — Expense Tracker';
  
  // Add meta description
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.setAttribute('content', 'Sovereign Ledger: A premium cross-platform expense tracker. Manage budgets, track spending, and gain financial insights on mobile, web, and desktop.');
  } else {
    const meta = document.createElement('meta');
    meta.name = 'description';
    meta.content = 'Sovereign Ledger: A premium cross-platform expense tracker. Manage budgets, track spending, and gain financial insights on mobile, web, and desktop.';
    document.head.appendChild(meta);
  }

  // Add viewport meta for responsive design
  const viewport = document.querySelector('meta[name="viewport"]');
  if (!viewport) {
    const meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0';
    document.head.appendChild(meta);
  }

  // Prevent zoom on double-tap for web
  const style = document.createElement('style');
  style.textContent = `
    * { -webkit-tap-highlight-color: transparent; }
    html, body { 
      margin: 0; 
      padding: 0; 
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; 
      overflow: auto !important;
      height: auto !important;
      min-height: 100vh;
    }
    #root { 
      display: flex; 
      flex-direction: column; 
      min-height: 100vh !important; 
      height: auto !important;
    }
    ::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.2); border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.3); }
    input:focus, textarea:focus { outline: none; }
  `;
  document.head.appendChild(style);
}

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          'Inter-Regular': Inter_400Regular,
          'Inter-Medium': Inter_500Medium,
          'Inter-SemiBold': Inter_600SemiBold,
          'Inter-Bold': Inter_700Bold,
        });
        setFontsLoaded(true);
      } catch (e) {
        console.warn('Font loading error:', e);
        // Continue anyway — system fonts will be used as fallback
        setFontsLoaded(true);
      }
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3D8BFF" />
      </View>
    );
  }

  return (
    <AppProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <AuthGate />
        </NavigationContainer>
      </SafeAreaProvider>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
