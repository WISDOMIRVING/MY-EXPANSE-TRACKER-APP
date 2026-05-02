// Sovereign Ledger — Animated Screen Wrapper with Cross-Platform Animations
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

/**
 * AnimatedScreen - Wraps screen content with entrance/exit animations.
 * Supports: fadeIn, slideUp, slideLeft, scaleIn, fadeSlideUp
 */
const AnimatedScreen = ({ 
  children, 
  animation = 'fadeSlideUp', 
  duration = 400, 
  delay = 0,
  style 
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    const animations = [];

    switch (animation) {
      case 'fadeIn':
        animations.push(
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration,
            delay,
            useNativeDriver: true,
          })
        );
        slideAnim.setValue(0);
        scaleAnim.setValue(1);
        break;

      case 'slideUp':
        fadeAnim.setValue(1);
        scaleAnim.setValue(1);
        animations.push(
          Animated.spring(slideAnim, {
            toValue: 0,
            tension: 65,
            friction: 10,
            delay,
            useNativeDriver: true,
          })
        );
        break;

      case 'scaleIn':
        slideAnim.setValue(0);
        animations.push(
          Animated.parallel([
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: duration * 0.8,
              delay,
              useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
              toValue: 1,
              tension: 80,
              friction: 8,
              delay,
              useNativeDriver: true,
            }),
          ])
        );
        break;

      case 'fadeSlideUp':
      default:
        scaleAnim.setValue(1);
        animations.push(
          Animated.parallel([
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: duration * 0.6,
              delay,
              useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
              toValue: 0,
              tension: 65,
              friction: 10,
              delay,
              useNativeDriver: true,
            }),
          ])
        );
        break;
    }

    Animated.parallel(animations).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        style,
        {
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};

/**
 * AnimatedItem — Stagger-ready list item animation
 */
export const AnimatedItem = ({ children, index = 0, style }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        delay: index * 80,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 65,
        friction: 10,
        delay: index * 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};

/**
 * PulseAnimation — Continuous pulse for attention-grabbing elements
 */
export const PulseAnimation = ({ children, style }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  return (
    <Animated.View style={[style, { transform: [{ scale: scaleAnim }] }]}>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AnimatedScreen;
