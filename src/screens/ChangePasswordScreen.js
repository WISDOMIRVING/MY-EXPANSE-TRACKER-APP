// Sovereign Ledger — Change Password Screen
import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, StatusBar,
  TextInput, ScrollView, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '../theme/colors';
import { FontFamily, FontSize } from '../theme/typography';
import { Spacing, BorderRadius } from '../theme/spacing';

const ChangePasswordScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const requirements = useMemo(() => {
    return [
      { label: 'At least 12 characters long', met: newPassword.length >= 12 },
      { label: 'Contains uppercase & lowercase', met: /[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword) },
      { label: 'Contains a number or special symbol', met: /[0-9!@#$%^&*]/.test(newPassword) },
      { label: "Doesn't resemble previous passwords", met: newPassword.length > 0 && newPassword !== currentPassword },
    ];
  }, [newPassword, currentPassword]);

  const strength = useMemo(() => {
    const metCount = requirements.filter(r => r.met).length;
    return metCount;
  }, [requirements]);

  const canSubmit = currentPassword.length > 0 && strength === 4 && newPassword === confirmPassword;

  return (
    <View style={[styles.container, { backgroundColor: '#FFFFFF', paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#1B2141" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Change Password</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.iconContainer}>
           <View style={styles.iconCircle}>
              <Ionicons name="lock-closed" size={32} color="#1B2141" />
           </View>
        </View>

        <Text style={styles.mainTitle}>Change Password</Text>
        <Text style={styles.subtitle}>Update your password to keep your account secure and protected.</Text>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>CURRENT PASSWORD</Text>
            <View style={styles.inputWrapper}>
              <TextInput 
                style={styles.input} 
                secureTextEntry={!showCurrent}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Enter current password"
              />
              <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)}>
                 <Ionicons name={showCurrent ? 'eye-off-outline' : 'eye-outline'} size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>NEW PASSWORD</Text>
            <View style={styles.inputWrapper}>
              <TextInput 
                style={styles.input} 
                secureTextEntry={!showNew}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Enter new password"
              />
              <TouchableOpacity onPress={() => setShowNew(!showNew)}>
                 <Ionicons name={showNew ? 'eye-off-outline' : 'eye-outline'} size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
            
            {/* Strength Bars */}
            <View style={styles.strengthRow}>
              {[1, 2, 3, 4].map((i) => (
                <View 
                  key={i} 
                  style={[
                    styles.strengthBar, 
                    { backgroundColor: i <= strength ? '#10B981' : '#F3F4F6' }
                  ]} 
                />
              ))}
              <Text style={styles.strengthText}>
                {strength === 0 ? '' : strength < 3 ? 'Weak' : strength < 4 ? 'Strong' : 'Very Strong'}
              </Text>
            </View>
          </View>

          <View style={styles.requirements}>
            {requirements.map((req) => (
              <View key={req.label} style={styles.reqItem}>
                <Ionicons 
                  name={req.met ? 'checkmark-circle' : 'checkmark-circle-outline'} 
                  size={18} 
                  color={req.met ? '#10B981' : '#E5E7EB'} 
                />
                <Text style={[styles.reqText, req.met && { color: '#1B2141' }]}>{req.label}</Text>
              </View>
            ))}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>CONFIRM NEW PASSWORD</Text>
            <View style={styles.inputWrapper}>
              <TextInput 
                style={styles.input} 
                secureTextEntry={!showConfirm}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Re-enter new password"
              />
              <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                 <Ionicons name={showConfirm ? 'eye-off-outline' : 'eye-outline'} size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.updateBtn, { backgroundColor: canSubmit ? '#1B2141' : '#E5E7EB' }]}
          disabled={!canSubmit}
          onPress={() => {
            Alert.alert('Success', 'Password updated successfully');
            navigation.goBack();
          }}
        >
          <Text style={styles.updateText}>Update Password</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
           <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 16 },
  backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontFamily: FontFamily.bold, fontSize: 18, color: '#1B2141' },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 60 },
  iconContainer: { alignItems: 'center', marginVertical: 32 },
  iconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  mainTitle: { fontFamily: FontFamily.bold, fontSize: 24, color: '#1B2141', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontFamily: FontFamily.medium, fontSize: 14, color: '#9CA3AF', textAlign: 'center', marginBottom: 40, lineHeight: 22 },
  form: { gap: 24 },
  inputGroup: { gap: 8 },
  label: { fontFamily: FontFamily.bold, fontSize: 10, color: '#9CA3AF', letterSpacing: 1 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', height: 52, borderWidth: 1, borderColor: '#F3F4F6', borderRadius: 12, paddingHorizontal: 16 },
  input: { flex: 1, fontFamily: FontFamily.medium, fontSize: 15, color: '#1B2141' },
  strengthRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8 },
  strengthBar: { flex: 1, height: 4, borderRadius: 2 },
  strengthText: { fontFamily: FontFamily.bold, fontSize: 10, color: '#10B981', marginLeft: 8 },
  requirements: { gap: 12, marginVertical: 8 },
  reqItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  reqText: { fontFamily: FontFamily.medium, fontSize: 13, color: '#9CA3AF' },
  updateBtn: { height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginTop: 40 },
  updateText: { fontFamily: FontFamily.bold, fontSize: 16, color: '#FFF' },
  cancelBtn: { paddingVertical: 16, alignItems: 'center' },
  cancelText: { fontFamily: FontFamily.bold, fontSize: 14, color: '#9CA3AF' },
});

export default ChangePasswordScreen;
