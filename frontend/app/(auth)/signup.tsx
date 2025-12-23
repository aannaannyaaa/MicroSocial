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

export default function SignupScreen() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!username.trim()) {
      newErrors.username = 'Username is required';
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

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

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await signUp(name, email, username, password);
      router.replace('/feed');
    } catch (error: any) {
      Alert.alert('Signup Error', error.message || 'Failed to create account');
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
      marginBottom: SPACING.lg,
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
      marginVertical: SPACING.md,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: SPACING.md,
    },
    footerText: {
      fontSize: FONT_SIZES.base,
      color: COLORS.textSecondary,
    },
    loginLink: {
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
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join the minimal social revolution</Text>
          </View>

          <Input
            label="Full Name"
            placeholder="John Doe"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            error={errors.name}
            editable={!loading}
          />

          <Input
            label="Username"
            placeholder="johndoe"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            error={errors.username}
            editable={!loading}
          />

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

          <Input
            label="Confirm Password"
            placeholder="••••••••"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            error={errors.confirmPassword}
            editable={!loading}
          />

          <Button
            title="Create Account"
            onPress={handleSignup}
            loading={loading}
            fullWidth
            size="lg"
          />

          <View style={styles.divider} />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <TouchableOpacity
              onPress={() => router.push('/login')}
              disabled={loading}
            >
              <Text style={styles.loginLink}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeArea>
  );
}
