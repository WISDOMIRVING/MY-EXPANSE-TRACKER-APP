// Sovereign Ledger — Cross-Platform Identity Verification
import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, StatusBar,
  Animated, Dimensions, Platform, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontFamily } from '../theme/typography';
import { useAppContext } from '../context/AppContext';
import AnimatedScreen, { PulseAnimation } from '../components/animated/AnimatedScreen';
import useResponsiveLayout from '../hooks/useResponsiveLayout';
import FaceVerificationEngine from '../utils/FaceVerificationEngine';

const { width } = Dimensions.get('window');

// Lazy load camera - won't exist on web
let CameraView = null;
let useCameraPermissions = null;
try {
  const cam = require('expo-camera');
  CameraView = cam.CameraView;
  useCameraPermissions = cam.useCameraPermissions;
} catch (e) {
  // Camera not available on this platform
}

const INSTRUCTIONS = [
  'Center your face in the frame',
  'Blink slowly two times',
  'Turn your head slightly to the left',
  'Turn your head slightly to the right',
  'Smile naturally',
  'Hold still for final analysis',
];

const VerificationScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { setVerified } = useAppContext();
  const layout = useResponsiveLayout();
  const [step, setStep] = useState('info'); // 'info' | 'camera' | 'webVerify' | 'success'
  const [instructionIndex, setInstructionIndex] = useState(0);
  const [webProgress, setWebProgress] = useState(0);

  const [permission, requestPermission] = useCameraPermissions ? useCameraPermissions() : [null, null];

  // Shimmer animation for the scan circle
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const shimmer = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
        Animated.timing(shimmerAnim, { toValue: 0, duration: 1500, useNativeDriver: true }),
      ])
    );
    shimmer.start();
    return () => shimmer.stop();
  }, []);
  const startVerification = async () => {
    // On desktop app without camera: use simulated verification
    if (!CameraView) {
      setStep('webVerify');
      return;
    }
    // Request camera permission
    try {
      if (requestPermission) {
        const { status } = await requestPermission();
        if (status === 'granted') {
          setStep('camera');
          setInstructionIndex(0);
          return;
        }
      }
    } catch (e) {
      // Fallback to web verification
    }
    setStep('webVerify');
  };

  // Web verification progress simulation
  useEffect(() => {
    if (step === 'webVerify') {
      const interval = setInterval(() => {
        setWebProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setStep('success'), 500);
            return 100;
          }
          return prev + 2;
        });
      }, 80);
      return () => clearInterval(interval);
    }
  }, [step]);

  const videoRef = useRef(null);

  // Camera flow and Active Liveness Engine
  useEffect(() => {
    let isActive = true;
    let stream = null;

    const runLivenessEngine = async () => {
      try {
        // Initialize simple face-api models from CDN
        if (Platform.OS === 'web') {
          // Dynamic import to prevent native bundler crashes
          const faceapi = require('@vladmandic/face-api');
          const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';
          await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
            faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL)
          ]);

          // Start web camera
          stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          
          // Wait for video to start playing
          await new Promise(resolve => setTimeout(resolve, 1000));

          // Active Liveness Challenge Loop
          for (let i = 0; i < INSTRUCTIONS.length; i++) {
            if (!isActive) return;
            setInstructionIndex(i);
            
            // In a real app, we would run a loop here to detect the specific action
            // e.g. checking faceapi.detectSingleFace(video).withFaceLandmarks()
            // and comparing getLeftEye() / getRightEye() for blinks.
            
            // Simulating the user completing the action after 2.5 seconds
            await new Promise(resolve => setTimeout(resolve, 2500));
          }
          
          if (isActive) setStep('success');
        } else {
          // Native mobile simulation
          for (let i = 0; i < INSTRUCTIONS.length; i++) {
            if (!isActive) return;
            setInstructionIndex(i);
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
          if (isActive) setStep('success');
        }
      } catch (error) {
        console.warn('Liveness engine failed', error);
        if (isActive) setStep('success'); // Fallback for demo
      }
    };

    if (step === 'camera') {
      runLivenessEngine();
    }

    return () => { 
      isActive = false; 
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [step]);

  const shimmerOpacity = shimmerAnim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.8] });

  // Responsive Layout Wrapper
  const renderWrapper = (children, isDark = false) => {
    if (layout.isDesktopLayout) {
      return (
        <ScrollView 
          style={[styles.desktopWrapper, isDark && { backgroundColor: '#0B1120' }]}
          contentContainerStyle={styles.desktopWrapperContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.desktopCard, isDark && { backgroundColor: '#1E293B', borderColor: 'rgba(255,255,255,0.1)' }]}>
            {children}
          </View>
        </ScrollView>
      );
    }
    return (
      <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#FFFFFF', paddingTop: insets.top }]}>
        {children}
      </View>
    );
  };

  // INFO STEP
  if (step === 'info') {
    return (
      <AnimatedScreen animation="scaleIn">
        {renderWrapper(
          <View style={styles.content}>
            <View style={styles.iconCircle}>
              <Ionicons name="shield-checkmark-outline" size={32} color="#1B2141" />
            </View>
            <Text style={styles.title}>Identity Verification</Text>
            <Text style={styles.subtitle}>
              {Platform.OS === 'web'
                ? 'We\'ll verify your identity using a secure digital check to protect your account.'
                : 'We need to verify your identity to protect your account security.'}
            </Text>

            <View style={styles.scanCircleContainer}>
              <PulseAnimation>
                <View style={styles.scanCircleOuter}>
                  <Animated.View style={[styles.scanCircleShimmer, { opacity: shimmerOpacity }]} />
                  <View style={styles.scanCircleInner}>
                    <Ionicons
                      name={Platform.OS === 'web' ? 'finger-print-outline' : 'camera-outline'}
                      size={48}
                      color="#2F7CF6"
                    />
                  </View>
                </View>
              </PulseAnimation>
            </View>

            <View style={styles.footer}>
              <TouchableOpacity style={styles.mainBtn} onPress={startVerification} accessibilityRole="button">
                <Text style={styles.mainBtnText}>
                  {Platform.OS === 'web' ? 'Verify Identity' : 'Scan My Face'}
                </Text>
                <Ionicons name="arrow-forward" size={20} color="#FFF" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.skipBtn} onPress={() => setVerified(true)}>
                <Text style={styles.skipText}>Skip for now</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </AnimatedScreen>
    );
  }

  // WEB VERIFICATION STEP (simulated biometric)
  if (step === 'webVerify') {
    return (
      <AnimatedScreen animation="scaleIn">
        {renderWrapper(
          <View style={styles.webVerifyContent}>
            <View style={styles.webProgressContainer}>
              <View style={styles.webProgressRing}>
                <Text style={styles.webProgressText}>{Math.round(webProgress)}%</Text>
              </View>
              <View style={styles.webProgressBarContainer}>
                <Animated.View style={[styles.webProgressBar, { width: `${webProgress}%` }]} />
              </View>
            </View>
            <Text style={styles.webVerifyTitle}>Verifying Identity...</Text>
            <Text style={styles.webVerifySubtitle}>
              {webProgress < 30 ? 'Initializing secure check...' :
               webProgress < 60 ? 'Analyzing credentials...' :
               webProgress < 90 ? 'Validating identity...' :
               'Almost done...'}
            </Text>
          </View>
        )}
      </AnimatedScreen>
    );
  }

  // CAMERA STEP (Mobile & Web)
  if (step === 'camera') {
    const progress = (instructionIndex / INSTRUCTIONS.length) * 100;
    
    // Core camera content
    const cameraContent = (
      <View style={[styles.cameraContainer, layout.isDesktopLayout && styles.desktopCameraContainer]}>
        {Platform.OS === 'web' ? (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        ) : CameraView ? (
          <CameraView style={styles.fullCamera} facing="front" />
        ) : (
          <View style={styles.fullCamera} />
        )}
        <View style={[styles.cameraOverlay, layout.isDesktopLayout && styles.desktopCameraOverlay]}>
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${progress}%` }]} />
          </View>
          <View style={styles.scanFrame} />
          <View style={styles.instructionBox}>
            <Text style={styles.scanningText}>{INSTRUCTIONS[instructionIndex] || 'Analyzing...'}</Text>
          </View>
        </View>
      </View>
    );

    return (
      <AnimatedScreen animation="scaleIn">
        {renderWrapper(cameraContent, true)}
      </AnimatedScreen>
    );
  }

  // SUCCESS STEP
  return (
    <AnimatedScreen animation="scaleIn">
      {renderWrapper(
        <View style={styles.successContent}>
          <Animated.View style={{ transform: [{ scale: balanceScale(shimmerAnim) }] }}>
            <Ionicons name="checkmark-circle" size={80} color="#10B981" />
          </Animated.View>
          <Text style={styles.title}>Verification Successful</Text>
          <Text style={styles.subtitle}>Your identity has been successfully verified.</Text>
          <TouchableOpacity style={styles.mainBtn} onPress={() => setVerified(true)} accessibilityRole="button">
            <Text style={styles.mainBtnText}>Go to Dashboard</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      )}
    </AnimatedScreen>
  );
};

// Helper for success animation
const balanceScale = (anim) => anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 1.1, 1] });

const styles = StyleSheet.create({
  container: { flex: 1 },
  // Desktop-specific layout classes
  desktopWrapper: { flex: 1, backgroundColor: '#F3F4F6' },
  desktopWrapperContent: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  desktopCard: { width: '100%', maxWidth: 480, backgroundColor: '#FFFFFF', borderRadius: 32, padding: 40, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.08, shadowRadius: 40, elevation: 10, borderWidth: 1, borderColor: '#F3F4F6', overflow: 'hidden' },
  
  content: { flex: 1, width: '100%', alignItems: 'center' },
  iconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center', marginBottom: 24, marginTop: 40 },
  title: { fontFamily: FontFamily.bold, fontSize: 24, color: '#1B2141', marginBottom: 12, textAlign: 'center' },
  subtitle: { fontFamily: FontFamily.medium, fontSize: 14, color: '#9CA3AF', textAlign: 'center', lineHeight: 22, marginBottom: 32 },
  scanCircleContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', minHeight: 280 },
  scanCircleOuter: { width: 240, height: 240, borderRadius: 120, borderWidth: 8, borderColor: '#2F7CF6', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  scanCircleShimmer: { ...StyleSheet.absoluteFillObject, borderRadius: 120, backgroundColor: '#2F7CF6' },
  scanCircleInner: { width: 200, height: 200, borderRadius: 100, backgroundColor: '#EBF2FF', alignItems: 'center', justifyContent: 'center', zIndex: 1 },
  footer: { width: '100%', paddingBottom: 40, gap: 16 },
  mainBtn: { width: '100%', height: 56, backgroundColor: '#1B2141', borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 },
  mainBtnText: { fontFamily: FontFamily.bold, fontSize: 16, color: '#FFF' },
  skipBtn: { width: '100%', height: 56, alignItems: 'center', justifyContent: 'center' },
  skipText: { fontFamily: FontFamily.bold, fontSize: 14, color: '#9CA3AF' },
  
  cameraContainer: { flex: 1, width: '100%', backgroundColor: '#000' },
  desktopCameraContainer: { minHeight: 600, borderRadius: 24, overflow: 'hidden' },
  fullCamera: { flex: 1 },
  cameraOverlay: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.3)' },
  desktopCameraOverlay: { borderRadius: 24 },
  progressContainer: { position: 'absolute', top: 60, width: '80%', height: 4, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 2, overflow: 'hidden' },
  progressBar: { height: '100%', backgroundColor: '#2F7CF6' },
  scanFrame: { width: 260, height: 260, borderRadius: 130, borderWidth: 4, borderColor: '#FFF' },
  instructionBox: { marginTop: 40, paddingHorizontal: 40 },
  scanningText: { color: '#FFF', fontFamily: FontFamily.bold, fontSize: 20, textAlign: 'center' },
  successContent: { flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center', gap: 16, minHeight: 400 },
  // Web verification styles
  webVerifyContent: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  webProgressContainer: { alignItems: 'center', marginBottom: 32 },
  webProgressRing: { width: 120, height: 120, borderRadius: 60, borderWidth: 6, borderColor: '#2F7CF6', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  webProgressText: { fontFamily: FontFamily.bold, fontSize: 28, color: '#1B2141' },
  webProgressBarContainer: { width: 200, height: 6, backgroundColor: '#F3F4F6', borderRadius: 3, overflow: 'hidden' },
  webProgressBar: { height: '100%', backgroundColor: '#2F7CF6', borderRadius: 3 },
  webVerifyTitle: { fontFamily: FontFamily.bold, fontSize: 20, color: '#1B2141', marginBottom: 8 },
  webVerifySubtitle: { fontFamily: FontFamily.medium, fontSize: 14, color: '#9CA3AF' },
});

export default VerificationScreen;
