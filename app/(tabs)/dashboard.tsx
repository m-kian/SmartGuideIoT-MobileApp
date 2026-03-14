import * as Location from "expo-location";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import MapView, { Circle, Marker } from "react-native-maps";
// Updated import to fix the SafeAreaView deprecation warning
import { SafeAreaView } from "react-native-safe-area-context";

const CDO_DEFAULT = { latitude: 8.4542, longitude: 124.6319 };

export default function HomeScreen() {
  const [userCoords, setUserCoords] = useState(CDO_DEFAULT);
  const [locationLabel, setLocationLabel] = useState("Cagayan de Oro City");
  const [loading, setLoading] = useState(true);

  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    let watcher: any;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") return;

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      setUserCoords({ latitude, longitude });
      setLoading(false);

      // FIX: Added try-catch to prevent "java.io.IOException: jgrg: UNAVAILABLE" error
      try {
        const geo = await Location.reverseGeocodeAsync({ latitude, longitude });

        if (geo.length > 0) {
          const g = geo[0];
          setLocationLabel(g.street ?? g.city ?? "Current Location");
        }
      } catch (error) {
        console.warn("Geocoder service unavailable. Using default label.");
        setLocationLabel("Current Location");
      }

      watcher = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 15,
        },
        (loc) => {
          const coords = {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          };

          setUserCoords(coords);

          mapRef.current?.animateToRegion({
            ...coords,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        },
      );
    })();

    return () => watcher?.remove();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#BAA06A" />
          <Text style={styles.loadingText}>Getting your location...</Text>
        </View>
      ) : (
        <MapView
          ref={mapRef}
          style={{ flex: 1 }}
          initialRegion={{
            ...userCoords,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          userInterfaceStyle="dark"
        >
          <Circle
            center={userCoords}
            radius={80}
            fillColor="rgba(220, 38, 38, 0.2)"
            strokeColor="#dc2626"
            strokeWidth={2}
          />

          <Marker
            coordinate={userCoords}
            title="You are here"
            pinColor="#BAA06A"
          />
        </MapView>
      )}

      <View style={styles.locationCard}>
        <View style={styles.accentBar} />
        <View style={styles.cardContent}>
          <Text style={styles.title}>Current Location</Text>
          <Text style={styles.locationSubText}>{locationLabel}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0A0A0A",
  },
  loadingText: {
    color: "#BAA06A",
    marginTop: 10,
    fontWeight: "600",
  },
  locationCard: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    flexDirection: "row",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#333",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  accentBar: {
    width: 6,
    backgroundColor: "#dc2626",
  },
  cardContent: {
    padding: 16,
    flex: 1,
  },
  title: {
    fontWeight: "bold",
    color: "#BAA06A",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  locationSubText: {
    color: "#FDF5E6",
    fontSize: 15,
    fontWeight: "500",
  },
});
