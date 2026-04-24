// Sovereign Ledger — Pixel Perfect Identity Verification
import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, StatusBar,
  Animated, Dimensions, Platform, ActivityIndicator, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { FontFamily, FontSize } from '../theme/typography';
import { Spacing, BorderRadius, Shadow } from '../theme/spacing';
import { useAppContext } from '../context/AppContext';

const { width } = Dimensions.get('window');
const SCANNER_SIZE = width * 0.65;

const INSTRUCTIONS = [
  'Center your face in the frame',
  'Blink slowly two times',
  'Turn your head slightly to the left',
  'Turn your head slightly to the right',
  'Smile naturally',
  'Hold still for final analysis',
];

const VerificationScreen = () => {
  const insets = useSafeAreaInsets();
  const { setVerified, colors, themeMode } = useAppContext();
  const [step, setStep] = useState('info'); // 'info' | 'camera' | 'processing' | 'success' | 'failure'
  const [permission, requestPermission] = useCameraPermissions();
  const [currentInstruction, setCurrentInstruction] = useState(0);
  const [progress, setProgress] = useState(0);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const instructionFade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (step === 'camera') {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.08, duration: 1000, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [step]);

  useEffect(() => {
    if (step === 'camera') {
      const sequence = async () => {
        try {
          for (let i = 0; i < INSTRUCTIONS.length; i++) {
            setCurrentInstruction(i);
            instructionFade.setValue(0);
            Animated.timing(instructionFade, { toValue: 1, duration: 400, useNativeDriver: true }).start();
            await new Promise(resolve => setTimeout(resolve, 2500));
            setProgress(((i + 1) / INSTRUCTIONS.length) * 100);
          }
          setStep('processing');
          // Simulated liveness check result
          setTimeout(() => {
            const isSuccess = Math.random() > 0.05; // 95% success rate for simulation
            setStep(isSuccess ? 'success' : 'failure');
          }, 2000);
        } catch (error) {
          setStep('failure');
        }
      };
      sequence();
    }
  }, [step]);

  useEffect(() => {
    if (step === 'success' || step === 'failure') {
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
    }
  }, [step]);

  const startVerification = async () => {
    const { status } = await requestPermission();
    if (status === 'granted') {
      setStep('camera');
      setProgress(0);
    } else {
      Alert.alert('Permission Denied', 'Camera access is required for identity verification.');
    }
  };

  const dynamicStyles = {
    container: { backgroundColor: colors.background },
    textPrimary: { color: colors.textPrimary },
    textSecondary: { color: colors.textSecondary },
    surface: { backgroundColor: colors.surface },
  };

  if (step === 'info') {
    return (
      <View style={[styles.container, dynamicStyles.container, { paddingTop: insets.top }]}>
        <StatusBar barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'} />
        <View style={styles.content}>
          <View style={styles.topSection}>
            <View style={[styles.miniCircle, { backgroundColor: colors.primaryFaded }]}>
              <Ionicons name="finger-print" size={24} color={colors.primary} />
            </View>
            <Text style={[styles.title, dynamicStyles.textPrimary]}>Identity Verification</Text>
            <Text style={[styles.subtitle, dynamicStyles.textSecondary]}>
              We need to perform a quick liveness check to confirm your identity.
            </Text>
          </View>

          <View style={styles.visualContainer}>
            <View style={[styles.scannerCircle, { borderColor: colors.primary }]}>
              <Ionicons name="camera-outline" size={60} color={colors.primary} />
            </View>
            <View style={[styles.instructionBadge, { backgroundColor: colors.infoFaded }]}>
              <Ionicons name="information-circle" size={16} color={colors.info} />
              <Text style={[styles.badgeText, { color: colors.info }]}>Center your face in the frame</Text>
            </View>
          </View>

          <TouchableOpacity style={[styles.mainBtn, { backgroundColor: colors.primary }]} onPress={startVerification}>
            <Text style={styles.mainBtnText}>Start Verification</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (step === 'camera') {
    return (
      <View style={[styles.container, dynamicStyles.container, { paddingTop: insets.top }]}>
        <View style={styles.cameraHeader}>
          <TouchableOpacity onPress={() => setStep('info')}><Ionicons name="close" size={28} color={colors.textPrimary} /></TouchableOpacity>
        </View>
        <View style={styles.cameraContent}>
          <View style={[styles.cameraWrapper, { borderColor: colors.primary }]}>
            <CameraView style={styles.camera} facing="front" />
            <Animated.View style={[styles.cameraPulse, { transform: [{ scale: pulseAnim }], borderColor: colors.primary }]} />
          </View>
          <View style={styles.livenessProgress}>
            <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
              <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: colors.primary }]} />
            </View>
            <Animated.View style={{ opacity: instructionFade }}>
              <Text style={[styles.livenessText, dynamicStyles.textPrimary]}>{INSTRUCTIONS[currentInstruction]}</Text>
            </Animated.View>
          </View>
        </View>
      </View>
    );
  }

  if (step === 'processing') {
    return (
      <View style={[styles.container, dynamicStyles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.processingText, dynamicStyles.textSecondary]}>Validating account security...</Text>
      </View>
    );
  }

  if (step === 'failure') {
    return (
      <View style={[styles.container, dynamicStyles.container, styles.center]}>
        <Animated.View style={[styles.successContent, { opacity: fadeAnim }]}>
          <View style={[styles.successCircle, { backgroundColor: colors.dangerFaded, borderColor: colors.danger }]}>
            <Ionicons name="close" size={60} color={colors.danger} />
          </View>
          <Text style={[styles.successTitle, dynamicStyles.textPrimary]}>Verification Failed</Text>
          <Text style={[styles.successSubtitle, dynamicStyles.textSecondary]}>We couldn't confirm your liveness. Please try again in better lighting.</Text>
          <TouchableOpacity style={[styles.mainBtn, { backgroundColor: colors.primary, width: '100%' }]} onPress={startVerification}>
            <Text style={styles.mainBtnText}>Retry Verification</Text>
            <Ionicons name="refresh" size={20} color="#FFF" />
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={[styles.container, dynamicStyles.container, styles.center]}>
      <Animated.View style={[styles.successContent, { opacity: fadeAnim }]}>
        <View style={[styles.successCircle, { backgroundColor: colors.successFaded, borderColor: colors.success }]}>
          <Ionicons name="checkmark" size={60} color={colors.success} />
        </View>
        <Text style={[styles.successTitle, dynamicStyles.textPrimary]}>Verification Successful</Text>
        <Text style={[styles.successSubtitle, dynamicStyles.textSecondary]}>Connecting to your account securely...</Text>
        <TouchableOpacity style={[styles.mainBtn, { backgroundColor: colors.primary, width: '100%' }]} onPress={() => setVerified(true)}>
          <Text style={styles.mainBtnText}>Go to Dashboard</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFF" />
        </TouchableOpacity>
        <Text style={[styles.encryptionNote, { color: colors.textMuted }]}>
          <Ionicons name="lock-closed" size={12} /> Secured by Enterprise Grade Encryption
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: Spacing.xxl, alignItems: 'center', justifyContent: 'space-between' },
  topSection: { alignItems: 'center', gap: Spacing.md },
  miniCircle: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: FontFamily.bold, fontSize: 28, textAlign: 'center' },
  subtitle: { fontFamily: FontFamily.regular, fontSize: FontSize.md, textAlign: 'center', lineHeight: 24 },
  visualContainer: { alignItems: 'center', gap: Spacing.xl },
  scannerCircle: { width: SCANNER_SIZE, height: SCANNER_SIZE, borderRadius: SCANNER_SIZE / 2, borderWidth: 6, alignItems: 'center', justifyContent: 'center', borderStyle: 'solid' },
  instructionBadge: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, borderRadius: BorderRadius.round },
  badgeText: { fontFamily: FontFamily.semiBold, fontSize: 13 },
  mainBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, borderRadius: BorderRadius.md, paddingVertical: Spacing.xl, width: '100%', ...Shadow.medium },
  mainBtnText: { fontFamily: FontFamily.bold, fontSize: FontSize.lg, color: '#FFF' },
  cameraHeader: { padding: Spacing.lg },
  cameraContent: { flex: 1, alignItems: 'center', paddingTop: Spacing.xxl },
  cameraWrapper: { width: SCANNER_SIZE, height: SCANNER_SIZE, borderRadius: SCANNER_SIZE / 2, overflow: 'hidden', borderWidth: 4 },
  camera: { flex: 1 },
  cameraPulse: { ...StyleSheet.absoluteFillObject, borderRadius: SCANNER_SIZE / 2, borderWidth: 4 },
  livenessProgress: { marginTop: Spacing.massive, width: '80%', alignItems: 'center' },
  progressTrack: { height: 6, width: '100%', borderRadius: 3, marginBottom: Spacing.xl },
  progressFill: { height: '100%', borderRadius: 3 },
  livenessText: { fontFamily: FontFamily.bold, fontSize: FontSize.xl, textAlign: 'center' },
  center: { justifyContent: 'center', alignItems: 'center', padding: Spacing.xxl },
  processingText: { marginTop: Spacing.xl, fontFamily: FontFamily.medium, fontSize: FontSize.md },
  successContent: { alignItems: 'center', width: '100%' },
  successCircle: { width: 120, height: 120, borderRadius: 60, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.xxxl, borderWidth: 2 },
  successTitle: { fontFamily: FontFamily.bold, fontSize: 32, marginBottom: Spacing.md },
  successSubtitle: { fontFamily: FontFamily.regular, fontSize: FontSize.md, textAlign: 'center', marginBottom: Spacing.massive },
  encryptionNote: { marginTop: Spacing.xl, fontFamily: FontFamily.regular, fontSize: 12 },
});

export default VerificationScreen;
