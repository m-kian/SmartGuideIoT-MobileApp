import * as Location from "expo-location";
import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    View
} from "react-native";
import MapView, { Circle, Marker } from "react-native-maps";

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

      const geo = await Location.reverseGeocodeAsync({ latitude, longitude });

      if (geo.length > 0) {
        const g = geo[0];
        setLocationLabel(g.street ?? g.city ?? "Current Location");
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
    <View style={{ flex: 1 }}>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#dc2626" />
          <Text>Getting your location...</Text>
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
        >
          <Circle
            center={userCoords}
            radius={80}
            fillColor="rgba(220,38,38,0.1)"
            strokeColor="rgba(220,38,38,0.4)"
          />

          <Marker coordinate={userCoords} title="You are here" />
        </MapView>
      )}

      <View style={styles.locationCard}>
        <Text style={styles.title}>Current Location</Text>
        <Text>{locationLabel}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  locationCard: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
  },

  title: {
    fontWeight: "bold",
  },
});
