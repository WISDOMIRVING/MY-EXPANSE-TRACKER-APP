// Sovereign Ledger — Cross-Platform Responsive Navigator
import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { FontFamily } from '../theme/typography';
import { useAppContext } from '../context/AppContext';
import useResponsiveLayout from '../hooks/useResponsiveLayout';
import useKeyboardShortcuts from '../hooks/useKeyboardShortcuts';

// Screens
import DashboardScreen from '../screens/DashboardScreen';
import LedgerScreen from '../screens/LedgerScreen';
import BudgetScreen from '../screens/BudgetScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AddTransactionScreen from '../screens/AddTransactionScreen';
import VerificationScreen from '../screens/VerificationScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';

// Desktop Components
import DesktopSidebar from '../components/desktop/DesktopSidebar';
import DesktopMenuBar from '../components/desktop/DesktopMenuBar';
import ShortcutsModal from '../components/desktop/ShortcutsModal';
import { exportToCSV, exportToPDF } from '../utils/export';
import { Alert } from 'react-native';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Mobile bottom tab navigator
const MobileTabNavigator = () => {
  const { colors } = useAppContext();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          if (route.name === 'Overview') iconName = focused ? 'grid' : 'grid-outline';
          else if (route.name === 'Budgets') iconName = focused ? 'wallet' : 'wallet-outline';
          else if (route.name === 'Insights') iconName = focused ? 'bar-chart' : 'bar-chart-outline';
          else if (route.name === 'Settings') iconName = focused ? 'person' : 'person-outline';
          return <Ionicons name={iconName} size={24} color={color} />;
        },
        tabBarActiveTintColor: '#1B2141',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#F3F4F6',
          height: 90,
          paddingBottom: 30,
          paddingTop: 10,
          borderTopWidth: 1,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontFamily: FontFamily.bold,
          fontSize: 10,
          marginTop: 2,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Overview" component={DashboardScreen} options={{ tabBarLabel: 'OVERVIEW' }} />
      <Tab.Screen name="Budgets" component={BudgetScreen} options={{ tabBarLabel: 'BUDGETS' }} />
      <Tab.Screen name="Insights" component={AnalyticsScreen} options={{ tabBarLabel: 'INSIGHTS' }} />
      <Tab.Screen name="Settings" component={ProfileScreen} options={{ tabBarLabel: 'SETTINGS' }} />
    </Tab.Navigator>
  );
};

// Desktop layout: sidebar + content area
const DesktopLayout = ({ navigation }) => {
  const { toggleTheme, transactions, currency, seedData } = useAppContext();
  const [activeTab, setActiveTab] = useState('Overview');
  const [showShortcuts, setShowShortcuts] = useState(false);
  const layout = useResponsiveLayout();

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  const handleAddTransaction = useCallback(() => {
    navigation.navigate('AddTransaction');
  }, [navigation]);

  const handleMenuAction = useCallback((action) => {
    switch (action) {
      case 'newTransaction': navigation.navigate('AddTransaction'); break;
      case 'viewDashboard': setActiveTab('Overview'); break;
      case 'viewBudgets': setActiveTab('Budgets'); break;
      case 'viewInsights': setActiveTab('Insights'); break;
      case 'viewSettings': setActiveTab('Settings'); break;
      case 'toggleTheme': toggleTheme(); break;
      case 'showShortcuts': setShowShortcuts(true); break;
      case 'exportCSV': exportToCSV(transactions, currency); break;
      case 'exportPDF': 
        if (Platform.OS === 'web') alert('PDF export is currently only available on mobile.');
        else exportToPDF(transactions, currency); 
        break;
      case 'about':
        if (Platform.OS === 'web') {
          alert('Sovereign Ledger v2.0.0\nA premium cross-platform expense tracker.');
        }
        break;
      case 'seedData': seedData(); break;
      default: break;
    }
  }, [navigation, toggleTheme, transactions, currency, seedData]);

  // Keyboard shortcuts
  const navProxy = {
    navigate: (screen) => {
      if (['Overview', 'Budgets', 'Insights', 'Settings'].includes(screen)) {
        setActiveTab(screen);
      } else {
        navigation.navigate(screen);
      }
    },
  };

  useKeyboardShortcuts(navProxy, {
    onToggleTheme: toggleTheme,
    onShowShortcuts: () => setShowShortcuts(true),
    onExport: () => exportToCSV(transactions, currency),
  });

  const renderScreen = () => {
    const screenProps = { navigation };
    switch (activeTab) {
      case 'Overview': return <DashboardScreen {...screenProps} />;
      case 'Budgets': return <BudgetScreen {...screenProps} />;
      case 'Insights': return <AnalyticsScreen {...screenProps} />;
      case 'Settings': return <ProfileScreen {...screenProps} />;
      default: return <DashboardScreen {...screenProps} />;
    }
  };

  return (
    <View style={styles.desktopContainer}>
      {layout.showMenuBar && <DesktopMenuBar onMenuAction={handleMenuAction} />}
      <View style={styles.desktopBody}>
        <DesktopSidebar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onAddTransaction={handleAddTransaction}
          sidebarWidth={layout.sidebarWidth}
        />
        <View style={styles.desktopContent}>
          {renderScreen()}
        </View>
      </View>
      <ShortcutsModal visible={showShortcuts} onClose={() => setShowShortcuts(false)} />
    </View>
  );
};

// Responsive navigator: switches between mobile tabs and desktop layout
const ResponsiveMainScreen = ({ navigation }) => {
  const layout = useResponsiveLayout();

  if (layout.showSidebar) {
    return <DesktopLayout navigation={navigation} />;
  }
  return <MobileTabNavigator />;
};

const AppNavigator = () => {
  const { colors, isVerified } = useAppContext();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#FFFFFF' },
      }}
      initialRouteName={isVerified ? 'MainTabs' : 'Verification'}
    >
      {!isVerified ? (
        <Stack.Screen name="Verification" component={VerificationScreen} />
      ) : (
        <>
          <Stack.Screen name="MainTabs" component={ResponsiveMainScreen} />
          <Stack.Screen name="AddTransaction" component={AddTransactionScreen} options={{ presentation: 'modal', gestureEnabled: true }} />
          <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
          <Stack.Screen name="Ledger" component={LedgerScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  desktopContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  desktopBody: {
    flex: 1,
    flexDirection: 'row',
  },
  desktopContent: {
    flex: 1,
  },
});

export default AppNavigator;
