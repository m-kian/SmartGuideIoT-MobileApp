import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function EmergencyScreen() {
  const [sosState, setSosState] = useState("idle");

  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.05,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const handleSOS = () => {
    setSosState("alerting");

    setTimeout(() => {
      setSosState("sent");
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Emergency Services</Text>

      <Animated.View style={{ transform: [{ scale }] }}>
        <TouchableOpacity style={styles.sos} onPress={handleSOS}>
          <Text style={styles.sosText}>
            {sosState === "idle" && "SOS"}
            {sosState === "alerting" && "Alerting..."}
            {sosState === "sent" && "Help Sent"}
          </Text>
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.card}>
        <Text>📞 Emergency Hotline</Text>
        <Text>911 Available 24/7</Text>
      </View>

      <View style={styles.card}>
        <Text>🚓 Police Station</Text>
        <Text>0.8 km away</Text>
      </View>

      <View style={styles.card}>
        <Text>🏥 Hospital</Text>
        <Text>1.2 km away</Text>
      </View>

      <View style={styles.card}>
        <Text>🚒 Fire Station</Text>
        <Text>2.1 km away</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },

  sos: {
    backgroundColor: "#ef4444",
    width: 140,
    height: 140,
    borderRadius: 70,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },

  sosText: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },

  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
  },
});
