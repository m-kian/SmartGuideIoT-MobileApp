import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router"; // Added Redirect
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import "react-native-gesture-handler";
import "react-native-reanimated";

import authStyles from "@/styles/authStyles";

export default function LoginScreen() {
  const router = useRouter();

  // UNCOMMENT the line below if you want the app to skip Login and open Signup first
  // return <Redirect href="/signup" />;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [role, setRole] = useState<"Admin" | "User">("Admin");

  const canLogin = email.trim().length > 0 && password.trim().length > 0;

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: "padding", android: undefined })}
      style={authStyles.screen}
    >
      {/* Background Decorative Elements */}
      <View style={authStyles.backgroundBase} />
      <View style={authStyles.backgroundGlowTop} />
      <View style={authStyles.backgroundGlowBottom} />

      <ScrollView
        contentContainerStyle={authStyles.shell}
        keyboardShouldPersistTaps="handled"
      >
        <View style={authStyles.card}>
          <View style={authStyles.brandIcon}>
            <Ionicons name="shield-checkmark" size={22} color="#FDF5E6" />
          </View>

          <Text style={authStyles.title}>SmartGuide</Text>
          <Text style={authStyles.subtitle}>
            Secure monitoring access for your platform.
          </Text>

          {/* Role Selection */}
          <View style={authStyles.roleSelector}>
            {(["Admin", "User"] as const).map((item) => (
              <Pressable
                key={item}
                style={[
                  authStyles.roleButton,
                  role === item && authStyles.roleButtonActive,
                ]}
                onPress={() => setRole(item)}
              >
                <Text
                  style={[
                    authStyles.roleButtonText,
                    role === item && authStyles.roleButtonTextActive,
                  ]}
                >
                  {item}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Email Input */}
          <Text style={authStyles.label}>Email</Text>
          <View style={authStyles.inputRow}>
            <Ionicons name="mail-outline" size={18} color="#BAA06A" />
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="admin@smartguide.com"
              placeholderTextColor="#8A8A8A"
              style={authStyles.input}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          {/* Password Input */}
          <Text style={authStyles.label}>Password</Text>
          <View style={authStyles.inputRow}>
            <Ionicons name="lock-closed-outline" size={18} color="#BAA06A" />
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              placeholderTextColor="#8A8A8A"
              style={authStyles.input}
              secureTextEntry={!isPasswordVisible}
            />
            <Pressable onPress={() => setIsPasswordVisible((prev) => !prev)}>
              <Ionicons
                name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
                size={18}
                color="#BAA06A"
              />
            </Pressable>
          </View>

          {/* Login Button */}
          <Pressable
            style={[
              authStyles.primaryButton,
              !canLogin && authStyles.buttonDisabled,
            ]}
            disabled={!canLogin}
            onPress={() => router.replace("/dashboard")} // Corrected path
          >
            <Text style={authStyles.primaryButtonText}>Sign In as {role}</Text>
            <Ionicons name="arrow-forward" size={18} color="#FDF5E6" />
          </Pressable>

          {/* Link to Signup */}
          <View style={authStyles.inlineRow}>
            <Text style={authStyles.mutedText}>{"Don't have an account?"}</Text>
            <Pressable onPress={() => router.push("./signup")}>
              <Text style={authStyles.linkText}>Sign Up</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
