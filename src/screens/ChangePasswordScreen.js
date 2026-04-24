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

  // Password requirements
  const requirements = useMemo(() => {
    return [
      {
        label: 'At least 12 characters long',
        met: newPassword.length >= 12,
      },
      {
        label: 'Contains uppercase & lowercase',
        met: /[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword),
      },
      {
        label: 'Contains a number or special symbol',
        met: /[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword),
      },
      {
        label: "Doesn't resemble previous passwords",
        met: newPassword.length > 0 && newPassword !== currentPassword,
      },
    ];
  }, [newPassword, currentPassword]);

  const allRequirementsMet = requirements.every(r => r.met);
  const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;
  const canSubmit = currentPassword.length > 0 && allRequirementsMet && passwordsMatch;

  const handleUpdatePassword = () => {
    if (!canSubmit) return;
    Alert.alert(
      'Password Updated',
      'Your password has been successfully updated.',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Change Password</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.formContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* Lock Icon */}
        <View style={styles.lockIconContainer}>
          <View style={styles.lockIcon}>
            <Ionicons name="lock-closed" size={32} color={Colors.primary} />
          </View>
        </View>

        <Text style={styles.description}>
          Choose a strong password to protect your financial data. Your password must meet all requirements below.
        </Text>

        {/* Current Password */}
        <Text style={styles.inputLabel}>CURRENT PASSWORD</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter current password"
            placeholderTextColor={Colors.inputPlaceholder}
            secureTextEntry={!showCurrent}
            value={currentPassword}
            onChangeText={setCurrentPassword}
          />
          <TouchableOpacity
            style={styles.eyeBtn}
            onPress={() => setShowCurrent(!showCurrent)}
          >
            <Ionicons
              name={showCurrent ? 'eye-off' : 'eye'}
              size={20}
              color={Colors.textMuted}
            />
          </TouchableOpacity>
        </View>

        {/* New Password */}
        <Text style={styles.inputLabel}>NEW PASSWORD</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter new password"
            placeholderTextColor={Colors.inputPlaceholder}
            secureTextEntry={!showNew}
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TouchableOpacity
            style={styles.eyeBtn}
            onPress={() => setShowNew(!showNew)}
          >
            <Ionicons
              name={showNew ? 'eye-off' : 'eye'}
              size={20}
              color={Colors.textMuted}
            />
          </TouchableOpacity>
        </View>

        {/* Requirements */}
        <View style={styles.requirementsList}>
          {requirements.map((req) => (
            <View key={req.label} style={styles.requirementItem}>
              <Ionicons
                name={req.met ? 'checkmark-circle' : 'ellipse-outline'}
                size={18}
                color={req.met ? Colors.success : Colors.textMuted}
              />
              <Text style={[styles.requirementText, req.met && styles.requirementMet]}>
                {req.label}
              </Text>
            </View>
          ))}
        </View>

        {/* Confirm Password */}
        <Text style={styles.inputLabel}>CONFIRM NEW PASSWORD</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Re-enter new password"
            placeholderTextColor={Colors.inputPlaceholder}
            secureTextEntry={!showConfirm}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity
            style={styles.eyeBtn}
            onPress={() => setShowConfirm(!showConfirm)}
          >
            <Ionicons
              name={showConfirm ? 'eye-off' : 'eye'}
              size={20}
              color={Colors.textMuted}
            />
          </TouchableOpacity>
        </View>
        {confirmPassword.length > 0 && !passwordsMatch && (
          <Text style={styles.errorText}>Passwords do not match</Text>
        )}

        {/* Update Button */}
        <TouchableOpacity
          style={[styles.updateBtn, !canSubmit && styles.updateBtnDisabled]}
          onPress={handleUpdatePassword}
          disabled={!canSubmit}
        >
          <Ionicons name="shield-checkmark" size={18} color={Colors.textPrimary} />
          <Text style={styles.updateBtnText}>Update Password</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelBtnText}>Cancel</Text>
        </TouchableOpacity>

        <View style={styles.footerNote}>
          <Ionicons name="lock-closed" size={12} color={Colors.textMuted} />
          <Text style={styles.footerNoteText}>
            Your password is encrypted end-to-end
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  headerTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xl,
    color: Colors.textPrimary,
  },
  formContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.massive,
  },
  lockIconContainer: {
    alignItems: 'center',
    marginVertical: Spacing.xxl,
  },
  lockIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primaryFaded,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(47, 124, 246, 0.3)',
  },
  description: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.xxl,
  },
  inputLabel: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    marginTop: Spacing.lg,
    letterSpacing: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  input: {
    flex: 1,
    padding: Spacing.lg,
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  eyeBtn: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
  requirementsList: {
    marginTop: Spacing.lg,
    gap: Spacing.md,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  requirementText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  requirementMet: {
    color: Colors.success,
  },
  errorText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.danger,
    marginTop: Spacing.xs,
  },
  updateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.lg,
    marginTop: Spacing.xxl,
  },
  updateBtnDisabled: {
    opacity: 0.4,
  },
  updateBtnText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
  },
  cancelBtn: {
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  cancelBtnText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  footerNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: Spacing.sm,
  },
  footerNoteText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
});

export default ChangePasswordScreen;
