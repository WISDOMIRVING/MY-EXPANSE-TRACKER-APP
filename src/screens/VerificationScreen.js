// Sovereign Ledger — Identity Verification Screen (Liveness Check)
import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, StatusBar,
  Animated, Dimensions, Platform, ActivityIndicator, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import Colors from '../theme/colors';
import { FontFamily, FontSize } from '../theme/typography';
import { Spacing, BorderRadius, Shadow } from '../theme/spacing';
import { useAppContext } from '../context/AppContext';

const { width, height } = Dimensions.get('window');
const CIRCLE_SIZE = width * 0.65;

const INSTRUCTIONS = [
  'Position your face within the frame',
  'Blink slowly two times',
  'Turn your head slightly to the left',
  'Turn your head slightly to the right',
  'Smile naturally',
  'Hold still for verification',
];

const VerificationScreen = ({ onVerified }) => {
  const insets = useSafeAreaInsets();
  const { setVerified } = useAppContext();
  const [step, setStep] = useState('info'); // 'info' | 'camera' | 'processing' | 'success' | 'failed'
  const [permission, requestPermission] = useCameraPermissions();
  const [currentInstruction, setCurrentInstruction] = useState(0);
  const [progress, setProgress] = useState(0);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const instructionFade = useRef(new Animated.Value(1)).current;

  // Pulse animation for circle
  useEffect(() => {
    if (step === 'camera') {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [step]);

  // Liveness verification sequence
  useEffect(() => {
    if (step === 'camera') {
      const sequence = async () => {
        for (let i = 0; i < INSTRUCTIONS.length; i++) {
          setCurrentInstruction(i);
          
          // Fade in instruction
          instructionFade.setValue(0);
          Animated.timing(instructionFade, { toValue: 1, duration: 400, useNativeDriver: true }).start();
          
          // Wait for user to "complete" step
          await new Promise(resolve => setTimeout(resolve, 2500));
          
          // Update progress
          setProgress(((i + 1) / INSTRUCTIONS.length) * 100);
        }
        
        setStep('processing');
        setTimeout(() => setStep('success'), 2000);
      };
      
      sequence();
    }
  }, [step]);

  // Success animation
  useEffect(() => {
    if (step === 'success') {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          bounciness: 12,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [step]);

  const startVerification = async () => {
    const { status } = await requestPermission();
    if (status === 'granted') {
      setStep('camera');
    } else {
      Alert.alert('Permission Denied', 'Camera access is required for identity verification.');
    }
  };

  const handleGoToDashboard = () => {
    setVerified(true);
    if (onVerified) onVerified();
  };

  // INFO SCREEN
  if (step === 'info') {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.infoContent}>
          <View style={styles.infoIconContainer}>
            <View style={styles.infoIconCircle}>
              <Ionicons name="shield-checkmark" size={48} color={Colors.primary} />
            </View>
          </View>

          <Text style={styles.infoTitle}>Identity Verification</Text>
          <Text style={styles.infoSubtitle}>
            Center your face in the frame and follow the instructions to secure your account.
          </Text>

          <View style={styles.instructionsList}>
            <View style={styles.instructionItem}>
              <View style={styles.checkIcon}>
                <Ionicons name="checkmark" size={16} color={Colors.success} />
              </View>
              <Text style={styles.instructionText}>Center your face in the frame</Text>
            </View>
            <View style={styles.instructionItem}>
              <View style={styles.checkIcon}>
                <Ionicons name="checkmark" size={16} color={Colors.success} />
              </View>
              <Text style={styles.instructionText}>Follow on-screen movements</Text>
            </View>
            <View style={styles.instructionItem}>
              <View style={styles.checkIcon}>
                <Ionicons name="checkmark" size={16} color={Colors.success} />
              </View>
              <Text style={styles.instructionText}>Ensure adequate lighting</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.startBtn} onPress={startVerification}>
            <Text style={styles.startBtnText}>Start Verification</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelLink}
            onPress={() => handleGoToDashboard()}
          >
            <Text style={styles.cancelLinkText}>Skip for now</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // CAMERA SCREEN
  if (step === 'camera') {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <StatusBar barStyle="dark-content" />
        
        <View style={styles.headerSimple}>
          <TouchableOpacity onPress={() => setStep('info')}>
            <Ionicons name="close" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitleSimple}>VERIFYING IDENTITY</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.cameraContainer}>
          <View style={styles.cameraWrapper}>
            <CameraView style={styles.camera} facing="front" />
            <View style={styles.circleOverlay}>
              <Animated.View
                style={[
                  styles.circleFrame,
                  { transform: [{ scale: pulseAnim }] },
                ]}
              />
            </View>
          </View>

          <View style={styles.progressSection}>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <Animated.View style={[styles.instructionBox, { opacity: instructionFade }]}>
              <Text style={styles.instructionMain}>
                {INSTRUCTIONS[currentInstruction]}
              </Text>
            </Animated.View>
          </View>
        </View>
      </View>
    );
  }

  // PROCESSING SCREEN
  if (step === 'processing') {
    return (
      <View style={[styles.container, styles.centerContainer]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.processingText}>Analyzing facial features...</Text>
      </View>
    );
  }

  // SUCCESS SCREEN
  return (
    <View style={[styles.container, styles.centerContainer]}>
      <Animated.View style={[styles.successContent, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.successCircle}>
          <Ionicons name="checkmark" size={60} color={Colors.success} />
        </View>
        <Text style={styles.successTitle}>Verification Successful</Text>
        <Text style={styles.successSubtitle}>Identity verified. Accessing your ledger.</Text>
        
        <TouchableOpacity style={styles.dashboardBtn} onPress={handleGoToDashboard}>
          <Text style={styles.dashboardBtnText}>Go to Dashboard</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xxl,
  },
  infoContent: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxl,
    alignItems: 'center',
  },
  infoIconContainer: {
    marginBottom: Spacing.xxxl,
  },
  infoIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primaryFaded,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 26,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  infoSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.xxxl,
  },
  instructionsList: {
    alignSelf: 'stretch',
    gap: Spacing.lg,
    marginBottom: Spacing.massive,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  checkIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.successFaded,
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructionText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  startBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.round,
    paddingVertical: Spacing.xl,
    alignSelf: 'stretch',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    ...Shadow.small,
  },
  startBtnText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.lg,
    color: Colors.textInverse,
  },
  cancelLink: {
    paddingVertical: Spacing.md,
  },
  cancelLinkText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  // Camera Step
  headerSimple: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  headerTitleSimple: {
    fontFamily: FontFamily.semiBold,
    fontSize: 12,
    color: Colors.textSecondary,
    letterSpacing: 2,
  },
  cameraContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: Spacing.xxxl,
  },
  cameraWrapper: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: Colors.border,
  },
  camera: {
    flex: 1,
  },
  circleOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleFrame: {
    width: CIRCLE_SIZE - 20,
    height: CIRCLE_SIZE - 20,
    borderRadius: (CIRCLE_SIZE - 20) / 2,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
  },
  progressSection: {
    marginTop: Spacing.massive,
    alignSelf: 'stretch',
    paddingHorizontal: Spacing.massive,
    alignItems: 'center',
  },
  progressTrack: {
    height: 4,
    backgroundColor: Colors.border,
    width: '100%',
    borderRadius: 2,
    marginBottom: Spacing.xl,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  instructionBox: {
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.lg,
    ...Shadow.small,
  },
  instructionMain: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  processingText: {
    marginTop: Spacing.xl,
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  // Success
  successContent: {
    alignItems: 'center',
    width: '100%',
  },
  successCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.successFaded,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xxxl,
    borderWidth: 2,
    borderColor: Colors.success,
  },
  successTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 28,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  successSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.massive,
  },
  dashboardBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.round,
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.massive,
    alignSelf: 'stretch',
    alignItems: 'center',
    ...Shadow.small,
  },
  dashboardBtnText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.lg,
    color: Colors.textInverse,
  },
});

export default VerificationScreen;
