import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function EmergencyScreen() {
  const [sosState, setSosState] = useState("idle");
  const scale = useRef(new Animated.Value(1)).current;
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Outer pulse animation for a high-alert visual effect
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.6,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Breathing animation for the SOS button itself
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.08,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const handleSOS = () => {
    setSosState("alerting");
    setTimeout(() => {
      setSosState("sent");
      // Reset back to idle after 3 seconds
      setTimeout(() => setSosState("idle"), 3000);
    }, 2000);
  };

  const emergencyContacts = [
    {
      title: "Emergency Hotline",
      sub: "911 Available 24/7",
      icon: "call",
      color: "#BAA06A",
    },
    {
      title: "Police HQ",
      sub: "0.8 km away",
      icon: "shield-half",
      color: "#dc2626",
    },
    {
      title: "City Hospital",
      sub: "1.3 km away",
      icon: "medical",
      color: "#BAA06A",
    },
    {
      title: "Fire Station",
      sub: "2.1 km away",
      icon: "flame",
      color: "#dc2626",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.content}>
        {/* Fixed Header with proper padding */}
        <View style={styles.headerSection}>
          <Text style={styles.header}>Emergency</Text>
          <Text style={styles.subHeader}>
            Immediate assistance at your fingertips
          </Text>
        </View>

        {/* SOS Button Area */}
        <View style={styles.sosContainer}>
          {/* Animated Pulse Ring */}
          <Animated.View
            style={[
              styles.pulseRing,
              {
                transform: [{ scale: pulse }],
                opacity: pulse.interpolate({
                  inputRange: [1, 1.6],
                  outputRange: [0.6, 0],
                }),
              },
            ]}
          />

          <Animated.View style={{ transform: [{ scale }] }}>
            <Pressable
              style={[
                styles.sosButton,
                sosState !== "idle" && styles.sosActive,
              ]}
              onPress={handleSOS}
            >
              <View style={styles.sosInner}>
                <Text style={styles.sosText}>
                  {sosState === "idle" && "SOS"}
                  {sosState === "alerting" && "..."}
                  {sosState === "sent" && "SENT"}
                </Text>
              </View>
            </Pressable>
          </Animated.View>
        </View>

        {/* Modernized Contact Cards */}
        <View style={styles.listContainer}>
          {emergencyContacts.map((item, index) => (
            <Pressable key={index} style={styles.card}>
              <View
                style={[styles.iconBox, { backgroundColor: item.color + "20" }]}
              >
                <Ionicons
                  name={item.icon as any}
                  size={22}
                  color={item.color}
                />
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardSub}>{item.sub}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#444" />
            </Pressable>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A", // Solid Black base
  },
  content: {
    flex: 1,
    paddingHorizontal: 24, // Fixes items touching the side of the screen
    paddingTop: 20,
  },
  headerSection: {
    marginBottom: 10,
  },
  header: {
    fontSize: 34,
    fontWeight: "900",
    color: "#BAA06A", // Gold
    letterSpacing: -0.5,
  },
  subHeader: {
    color: "#8A8A8A",
    fontSize: 15,
    marginTop: 4,
  },
  sosContainer: {
    height: 260,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  pulseRing: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 3,
    borderColor: "#dc2626", // Red pulse
  },
  sosButton: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "#1A1A1A",
    padding: 12,
    borderWidth: 3,
    borderColor: "#BAA06A", // Gold Border
    justifyContent: "center",
    alignItems: "center",
    elevation: 25,
    shadowColor: "#dc2626",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 20,
  },
  sosActive: {
    borderColor: "#dc2626",
    shadowColor: "#dc2626",
  },
  sosInner: {
    width: "100%",
    height: "100%",
    borderRadius: 80,
    backgroundColor: "#dc2626", // Red Button
    justifyContent: "center",
    alignItems: "center",
  },
  sosText: {
    color: "#FDF5E6",
    fontSize: 40,
    fontWeight: "900",
    letterSpacing: 1,
  },
  listContainer: {
    flex: 1,
    paddingBottom: 20,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#161616", // Dark Grey card
    padding: 18,
    borderRadius: 20,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#222",
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    color: "#FDF5E6",
    fontSize: 17,
    fontWeight: "700",
  },
  cardSub: {
    color: "#8A8A8A",
    fontSize: 13,
    marginTop: 3,
  },
});
