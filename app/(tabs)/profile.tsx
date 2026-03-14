import React, { useState } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";

export default function ProfileScreen() {
  const [notifications, setNotifications] = useState(true);
  const [location, setLocation] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Profile & Settings</Text>

      <View style={styles.profileCard}>
        <Text style={styles.name}>Rocel Saguing </Text>
        <Text style={styles.email}>rocel.saguing@email.com</Text>
      </View>

      <View style={styles.settingRow}>
        <Text>Notifications</Text>
        <Switch
          value={notifications}
          onValueChange={() => setNotifications(!notifications)}
        />
      </View>

      <View style={styles.settingRow}>
        <Text>Location Services</Text>
        <Switch value={location} onValueChange={() => setLocation(!location)} />
      </View>

      <View style={styles.settingRow}>
        <Text>Dark Mode</Text>
        <Switch value={darkMode} onValueChange={() => setDarkMode(!darkMode)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },

  profileCard: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },

  name: {
    fontSize: 18,
    fontWeight: "bold",
  },

  email: {
    color: "gray",
  },

  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
});
