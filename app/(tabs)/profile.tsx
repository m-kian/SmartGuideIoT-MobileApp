import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";

export default function ProfileScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);
  const [location, setLocation] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  // Function to handle Sign Out with a confirmation alert
  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => router.replace("/"), // This redirects to your index.tsx / login
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.header}>Profile & Settings</Text>

        {/* User Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={40} color="#BAA06A" />
          </View>
          <View>
            <Text style={styles.name}>Rocel Saguing</Text>
            <Text style={styles.email}>rocel.saguing@email.com</Text>
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <View style={styles.settingRow}>
            <View style={styles.rowLeft}>
              <Ionicons
                name="notifications-outline"
                size={20}
                color="#BAA06A"
              />
              <Text style={styles.settingText}>Notifications</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: "#333", true: "#dc2626" }}
              thumbColor={notifications ? "#FDF5E6" : "#8A8A8A"}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.rowLeft}>
              <Ionicons name="location-outline" size={20} color="#BAA06A" />
              <Text style={styles.settingText}>Location Services</Text>
            </View>
            <Switch
              value={location}
              onValueChange={setLocation}
              trackColor={{ false: "#333", true: "#dc2626" }}
              thumbColor={location ? "#FDF5E6" : "#8A8A8A"}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.rowLeft}>
              <Ionicons name="moon-outline" size={20} color="#BAA06A" />
              <Text style={styles.settingText}>Dark Mode</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: "#333", true: "#dc2626" }}
              thumbColor={darkMode ? "#FDF5E6" : "#8A8A8A"}
            />
          </View>
        </View>

        {/* Sign Out Button */}
        <Pressable style={styles.logoutButton} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={20} color="#FDF5E6" />
          <Text style={styles.logoutText}>Sign Out</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#BAA06A",
    marginBottom: 30,
  },
  profileCard: {
    backgroundColor: "#1A1A1A",
    padding: 20,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#333",
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#262626",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    borderWidth: 1,
    borderColor: "#BAA06A",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FDF5E6",
  },
  email: {
    color: "#8A8A8A",
    fontSize: 14,
  },
  section: {
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#333",
    marginBottom: 40,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#262626",
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingText: {
    color: "#FDF5E6",
    fontSize: 16,
    marginLeft: 12,
  },
  logoutButton: {
    backgroundColor: "#dc2626",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    gap: 10,
  },
  logoutText: {
    color: "#FDF5E6",
    fontSize: 16,
    fontWeight: "bold",
  },
});
