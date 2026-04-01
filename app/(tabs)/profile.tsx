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
  Modal,
  TextInput,
  ScrollView,
} from "react-native";

export default function ProfileScreen() {
  const router = useRouter();

  // SETTINGS STATES
  const [notifications, setNotifications] = useState(true);
  const [location, setLocation] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  // MODAL STATES
  const [modalVisible, setModalVisible] = useState(false);
  const [deviceId, setDeviceId] = useState("Rocel Saguing");
  const [email, setEmail] = useState("rocel.saguing@email.com");
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);

  const devices = [
    "STICK 1",
    "STICK 2",
    "STICK 3",
  ];

  // SIGN OUT FUNCTION
  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => router.replace("/"),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.header}>Profile & Settings</Text>

        {/* PROFILE CARD */}
        <Pressable
          style={styles.profileCard}
          onPress={() => setModalVisible(true)}
        >
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={40} color="#BAA06A" />
          </View>
          <View>
            <Text style={styles.name}>{deviceId}</Text>
            <Text style={styles.email}>{email}</Text>
            {selectedDevice && (
              <Text style={styles.email}>Device: {selectedDevice}</Text>
            )}
          </View>
        </Pressable>

        {/* SETTINGS */}
        <View style={styles.section}>
          <View style={styles.settingRow}>
            <View style={styles.rowLeft}>
              <Ionicons name="notifications-outline" size={20} color="#BAA06A" />
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

        {/* LOGOUT */}
        <Pressable style={styles.logoutButton} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={20} color="#FDF5E6" />
          <Text style={styles.logoutText}>Sign Out</Text>
        </Pressable>
      </View>

      {/* MODAL */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit Profile</Text>

            {/* DEVICE ID */}
            <TextInput
              value={deviceId}
              onChangeText={setDeviceId}
              placeholder="Device ID"
              placeholderTextColor="#888"
              style={styles.input}
            />

            {/* EMAIL */}
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              placeholderTextColor="#888"
              style={styles.input}
            />

            {/* DEVICES */}
            <Text style={styles.devicesTitle}>Available Devices</Text>
            <ScrollView style={styles.deviceList}>
              {devices.map((device, index) => {
                const isSelected = selectedDevice === device;
                return (
                  <Pressable
                    key={index}
                    onPress={() => setSelectedDevice(device)}
                    style={[
                      styles.deviceItem,
                      isSelected && styles.deviceItemSelected,
                    ]}
                  >
                    <Text
                      style={{
                        color: isSelected ? "#0A0A0A" : "#FDF5E6",
                        fontWeight: isSelected ? "bold" : "normal",
                      }}
                    >
                      {device}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* BUTTONS */}
            <View style={styles.modalButtons}>
              <Pressable
                onPress={() => setModalVisible(false)}
                style={styles.cancelBtn}
              >
                <Text style={{ color: "#fff" }}>Cancel</Text>
              </Pressable>

              <Pressable
                onPress={() => setModalVisible(false)}
                style={styles.saveBtn}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>
                  Save
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0A0A0A" },
  content: { paddingHorizontal: 24, paddingTop: 40 },

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
    fontSize: 18,
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

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContainer: {
    width: "90%",
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#333",
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#BAA06A",
    marginBottom: 16,
  },

  input: {
    backgroundColor: "#262626",
    color: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },

  devicesTitle: {
    color: "#BAA06A",
    marginTop: 10,
    marginBottom: 6,
  },

  deviceList: {
    maxHeight: 150,
    backgroundColor: "#262626",
    borderRadius: 10,
    padding: 6,
  },

  deviceItem: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 4,
  },

  deviceItemSelected: {
    backgroundColor: "#BAA06A",
  },

  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 16,
    gap: 10,
  },

  cancelBtn: {
    backgroundColor: "#555",
    padding: 10,
    borderRadius: 8,
  },

  saveBtn: {
    backgroundColor: "#dc2626",
    padding: 10,
    borderRadius: 8,
  },
});