import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import authStyles from '@/styles/authStyles';

export default function SignupScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const errorMessage = useMemo(() => {
    if (confirmPassword.length > 0 && password !== confirmPassword) {
      return 'Passwords do not match.';
    }

    return '';
  }, [confirmPassword, password]);

  const canSubmit =
    fullName.trim().length > 0 &&
    email.trim().length > 0 &&
    password.trim().length >= 6 &&
    password === confirmPassword;

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: 'padding', android: undefined })}
      style={authStyles.screen}>
      <View style={authStyles.backgroundBase} />
      <View style={authStyles.backgroundGlowTop} />
      <View style={authStyles.backgroundGlowBottom} />

      <ScrollView contentContainerStyle={authStyles.shell} keyboardShouldPersistTaps="handled">
        <View style={authStyles.card}>
          <View style={authStyles.headerRow}>
            <Pressable style={authStyles.iconButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={18} color="#FDF5E6" />
            </Pressable>
            <Text style={authStyles.title}>Create Account</Text>
            <View style={authStyles.iconButtonPlaceholder} />
          </View>

          <Text style={authStyles.subtitle}>Join SmartGuide in just a few steps.</Text>

          <Text style={authStyles.label}>Full Name</Text>
          <View style={authStyles.inputRow}>
            <Ionicons name="person-outline" size={18} color="#BAA06A" />
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              placeholder="Kheanne Miguel"
              placeholderTextColor="#8A8A8A"
              style={authStyles.input}
            />
          </View>

          <Text style={authStyles.label}>Email</Text>
          <View style={authStyles.inputRow}>
            <Ionicons name="mail-outline" size={18} color="#BAA06A" />
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="kheanne@example.com"
              placeholderTextColor="#8A8A8A"
              style={authStyles.input}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <Text style={authStyles.label}>Password</Text>
          <View style={authStyles.inputRow}>
            <Ionicons name="lock-closed-outline" size={18} color="#BAA06A" />
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Minimum 6 characters"
              placeholderTextColor="#8A8A8A"
              style={authStyles.input}
              secureTextEntry
            />
          </View>

          <Text style={authStyles.label}>Confirm Password</Text>
          <View style={authStyles.inputRow}>
            <Ionicons name="shield-checkmark-outline" size={18} color="#BAA06A" />
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Repeat password"
              placeholderTextColor="#8A8A8A"
              style={authStyles.input}
              secureTextEntry
            />
          </View>

          {errorMessage ? <Text style={authStyles.errorText}>{errorMessage}</Text> : null}

          <Pressable style={[authStyles.primaryButton, !canSubmit && authStyles.buttonDisabled]} disabled={!canSubmit}>
            <Text style={authStyles.primaryButtonText}>Create Account</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
