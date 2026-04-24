import React from 'react';
import { View } from 'react-native';
const PlaceholderView = () => <View style={{ flex: 1, backgroundColor: 'transparent' }} />;
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { FontFamily } from '../theme/typography';
import { useAppContext } from '../context/AppContext';

// Screens
import DashboardScreen from '../screens/DashboardScreen';
import LedgerScreen from '../screens/LedgerScreen';
import BudgetScreen from '../screens/BudgetScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AddTransactionScreen from '../screens/AddTransactionScreen';
import VerificationScreen from '../screens/VerificationScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabNavigator = () => {
  const { colors } = useAppContext();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          if (route.name === 'HomeTab') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'AnalyticsTab') iconName = focused ? 'bar-chart' : 'bar-chart-outline';
          else if (route.name === 'AddTab') {
            return <Ionicons name="add-circle" size={42} color={colors.primary} style={{ marginTop: -10 }} />;
          } else if (route.name === 'BudgetTab') iconName = focused ? 'wallet' : 'wallet-outline';
          else if (route.name === 'ProfileTab') iconName = focused ? 'person' : 'person-outline';

          return <Ionicons name={iconName} size={24} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 85,
          paddingBottom: 25,
          paddingTop: 10,
          borderTopWidth: 1,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontFamily: FontFamily.medium,
          fontSize: 10,
          marginTop: 4,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="HomeTab" component={DashboardScreen} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="AnalyticsTab" component={AnalyticsScreen} options={{ tabBarLabel: 'Analytics' }} />
      <Tab.Screen name="AddTab" component={PlaceholderView} listeners={({ navigation }) => ({ tabPress: (e) => { e.preventDefault(); navigation.navigate('AddTransaction'); } })} options={{ tabBarLabel: '' }} />
      <Tab.Screen name="BudgetTab" component={BudgetScreen} options={{ tabBarLabel: 'Budget' }} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { colors } = useAppContext();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="AddTransaction" component={AddTransactionScreen} options={{ presentation: 'modal', gestureEnabled: true }} />
      <Stack.Screen name="Verification" component={VerificationScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
