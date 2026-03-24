import * as Location from "expo-location";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT, Region } from "react-native-maps";
import Svg, { Path } from "react-native-svg";

interface PlaceMarker {
  id: number;
  name: string;
  lat: number;
  lon: number;
  address: string;
}

const CDO_REGION: Region = {
  latitude: 8.4542,
  longitude: 124.6319,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

export default function MapScreen() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [markers, setMarkers] = useState<PlaceMarker[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<PlaceMarker | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);

  const mapRef = useRef<MapView>(null);

  // 📍 Get user location
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const loc = await Location.getCurrentPositionAsync({});
      setUserLocation({
        lat: loc.coords.latitude,
        lon: loc.coords.longitude,
      });
    })();
  }, []);

  // 📍 Go to my location
  const goToMyLocation = () => {
    if (!userLocation) {
      Alert.alert("Location unavailable", "Enable location permission first.");
      return;
    }

    mapRef.current?.animateToRegion(
      {
        latitude: userLocation.lat,
        longitude: userLocation.lon,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      },
      800
    );
  };

  // 🔍 FIXED SEARCH (LOCAL ONLY)
  const handleSearch = async () => {
    const trimmed = query.trim();
    if (!trimmed) return;

    Keyboard.dismiss();
    setLoading(true);
    setMarkers([]);
    setSelectedMarker(null);

    try {
      const lat = userLocation?.lat ?? CDO_REGION.latitude;
      const lon = userLocation?.lon ?? CDO_REGION.longitude;

      // 🔥 FORCE LOCAL CONTEXT
      const searchQuery = `${trimmed}, Cagayan de Oro`;
      const encoded = encodeURIComponent(searchQuery);

      const url =
        `https://nominatim.openstreetmap.org/search` +
        `?q=${encoded}` +
        `&format=json` +
        `&limit=10` +
        `&countrycodes=ph` +
        `&viewbox=${lon - 0.1},${lat + 0.1},${lon + 0.1},${lat - 0.1}` +
        `&bounded=1`;

      const res = await fetch(url, {
        headers: {
          "User-Agent": "SmartGuideIoT/1.0",
          "Accept-Language": "en",
        },
      });

      if (!res.ok) throw new Error("Network error");

      const data = await res.json();

      if (!data || data.length === 0) {
        Alert.alert("No results", `Nothing found for "${trimmed}".`);
        return;
      }

      const newMarkers: PlaceMarker[] = data.map((item: any) => ({
        id: item.place_id,
        name: item.display_name.split(",")[0],
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon),
        address: item.display_name,
      }));

      setMarkers(newMarkers);

      // 📍 Auto zoom
      const lats = newMarkers.map((m) => m.lat);
      const lons = newMarkers.map((m) => m.lon);

      const minLat = Math.min(...lats);
      const maxLat = Math.max(...lats);
      const minLon = Math.min(...lons);
      const maxLon = Math.max(...lons);

      mapRef.current?.animateToRegion(
        {
          latitude: (minLat + maxLat) / 2,
          longitude: (minLon + maxLon) / 2,
          latitudeDelta: Math.max((maxLat - minLat) * 1.6, 0.01),
          longitudeDelta: Math.max((maxLon - minLon) * 1.6, 0.01),
        },
        800
      );
    } catch {
      Alert.alert("Error", "Could not fetch results.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setQuery("");
    setMarkers([]);
    setSelectedMarker(null);
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={CDO_REGION}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={{ latitude: marker.lat, longitude: marker.lon }}
            pinColor="#BAA06A"
            onPress={() => setSelectedMarker(marker)}
          />
        ))}
      </MapView>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search nearby places..."
            placeholderTextColor="#666"
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
          />
        </View>

        <TouchableOpacity style={styles.goBtn} onPress={handleSearch}>
          {loading ? (
            <ActivityIndicator size="small" color="#000" />
          ) : (
            <Text>Go</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* My Location */}
      <TouchableOpacity style={styles.locBtn} onPress={goToMyLocation}>
        <Text style={{ color: "#BAA06A" }}>◎</Text>
      </TouchableOpacity>

      {/* Info Card */}
      {selectedMarker && (
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoText}>
              <Text style={styles.infoName}>{selectedMarker.name}</Text>
              <Text style={styles.infoAddress}>
                {selectedMarker.address}
              </Text>
            </View>

            <TouchableOpacity onPress={() => setSelectedMarker(null)}>
              <Text style={{ color: "#BAA06A" }}>X</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { ...StyleSheet.absoluteFillObject },

  searchContainer: {
    position: "absolute",
    top: 60,
    left: 16,
    right: 16,
    flexDirection: "row",
  },

  searchBar: {
    flex: 1,
    backgroundColor: "#111",
    borderRadius: 10,
    padding: 10,
  },

  searchInput: {
    color: "#fff",
  },

  goBtn: {
    backgroundColor: "#BAA06A",
    padding: 12,
    marginLeft: 8,
    borderRadius: 10,
  },

  locBtn: {
    position: "absolute",
    bottom: 100,
    right: 20,
    backgroundColor: "#111",
    padding: 12,
    borderRadius: 10,
  },

  infoCard: {
    position: "absolute",
    bottom: 40,
    left: 16,
    right: 16,
    backgroundColor: "#111",
    padding: 12,
    borderRadius: 10,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  infoText: { flex: 1 },

  infoName: {
    color: "#fff",
    fontWeight: "bold",
  },

  infoAddress: {
    color: "#aaa",
    fontSize: 12,
  },
});