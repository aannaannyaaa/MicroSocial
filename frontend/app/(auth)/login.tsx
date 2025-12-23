import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { SafeArea } from '../../src/components/SafeArea';
import { Input } from '../../src/components/Input';
import { Button } from '../../src/components/Button';
import { validateEmail, validatePassword } from '../../src/utils/format';
import {
  COLORS,
  SIZES,
  FONT_SIZES,
  FONT_WEIGHTS,
  SPACING,
} from '../../src/utils/constants';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(password)) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await signIn(email, password);
      router.replace('/feed');
    } catch (error: any) {
      Alert.alert('Login Error', error.message || 'Failed to login');
      setErrors({});
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: COLORS.background,
    },
    keyboardView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: 'center',
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.xl,
    },
    header: {
      marginBottom: SPACING.xl,
    },
    title: {
      fontSize: FONT_SIZES.xxxl,
      fontWeight: FONT_WEIGHTS.bold,
      color: COLORS.primary,
      marginBottom: SIZES.sm,
    },
    subtitle: {
      fontSize: FONT_SIZES.base,
      color: COLORS.textSecondary,
      fontWeight: FONT_WEIGHTS.normal,
    },
    divider: {
      height: 1,
      backgroundColor: COLORS.border,
      marginVertical: SPACING.lg,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: SPACING.lg,
    },
    footerText: {
      fontSize: FONT_SIZES.base,
      color: COLORS.textSecondary,
    },
    signupLink: {
      color: COLORS.primary,
      fontWeight: FONT_WEIGHTS.semibold,
      marginLeft: SIZES.sm,
    },
  });

  return (
    <SafeArea style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>MicroSocial</Text>
            <Text style={styles.subtitle}>Connect with minimal complexity</Text>
          </View>

          <Input
            label="Email"
            placeholder="your@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
            editable={!loading}
          />

          <Input
            label="Password"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={errors.password}
            editable={!loading}
          />

          <Button
            title="Sign In"
            onPress={handleLogin}
            loading={loading}
            fullWidth
            size="lg"
          />

          <View style={styles.divider} />

          <View style={styles.footer}>
            <Text style={styles.footerText}>New user?</Text>
            <TouchableOpacity
              onPress={() => router.push('/signup')}
              disabled={loading}
            >
              <Text style={styles.signupLink}>Create account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeArea>
  );
}
