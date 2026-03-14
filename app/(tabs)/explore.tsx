import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Path } from "react-native-svg";

const places = [
  {
    name: "City Hospital",
    distance: "1.2 km",
    type: "Hospital",
    color: "#332200", // Dark Gold background
    iconColor: "#BAA06A", // Gold icon
    icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
  },
  {
    name: "Police HQ",
    distance: "0.8 km",
    type: "Police",
    color: "#330000", // Dark Red background
    iconColor: "#dc2626", // Red icon
    icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
  },
  {
    name: "Fire Station A",
    distance: "2.1 km",
    type: "Fire",
    color: "#330000",
    iconColor: "#dc2626",
    icon: "M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z",
  },
  {
    name: "Pharmacy Plus",
    distance: "0.5 km",
    type: "Pharmacy",
    color: "#332200",
    iconColor: "#BAA06A",
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  },
  {
    name: "Community Center",
    distance: "1.8 km",
    type: "Community",
    color: "#262626", // Dark Grey background
    iconColor: "#FDF5E6", // Off-white icon
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
  },
];

export default function ExploreScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore Nearby</Text>
        <Text style={styles.headerSub}>
          Emergency & Safety locations near you
        </Text>
      </View>

      <View style={styles.searchBar}>
        <Svg
          width={18}
          height={18}
          viewBox="0 0 24 24"
          fill="none"
          stroke="#BAA06A"
          strokeWidth={2}
        >
          <Path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </Svg>
        <Text style={styles.searchPlaceholder}>Search places...</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {places.map((place, i) => (
          <TouchableOpacity
            key={i}
            style={styles.placeCard}
            activeOpacity={0.8}
          >
            <View style={[styles.placeIcon, { backgroundColor: place.color }]}>
              <Svg
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke={place.iconColor}
                strokeWidth={2}
              >
                <Path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d={place.icon}
                />
              </Svg>
            </View>
            <View style={styles.placeInfo}>
              <Text style={styles.placeName}>{place.name}</Text>
              <Text style={styles.placeType}>{place.type}</Text>
            </View>
            <View style={styles.placeRight}>
              <Text style={styles.placeDistance}>{place.distance}</Text>
              <View style={styles.dirBtn}>
                <Svg
                  width={14}
                  height={14}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#dc2626"
                  strokeWidth={2}
                >
                  <Path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </Svg>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0A0A0A" },
  header: {
    backgroundColor: "#1A1A1A",
    padding: 24,
    paddingTop: 48,
    paddingBottom: 40,
  },
  headerTitle: { color: "#BAA06A", fontSize: 24, fontWeight: "700" },
  headerSub: { color: "#8A8A8A", fontSize: 13, marginTop: 4 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginHorizontal: 16,
    marginTop: -20,
    backgroundColor: "#262626",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#333",
  },
  searchPlaceholder: { color: "#8A8A8A", fontSize: 14 },
  list: { paddingHorizontal: 16, paddingBottom: 32, paddingTop: 8 },
  placeCard: {
    backgroundColor: "#1A1A1A",
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#333",
  },
  placeIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  placeInfo: { flex: 1 },
  placeName: { fontSize: 15, fontWeight: "600", color: "#FDF5E6" },
  placeType: { fontSize: 12, color: "#8A8A8A", marginTop: 2 },
  placeRight: { alignItems: "flex-end", gap: 6 },
  placeDistance: { fontSize: 12, fontWeight: "600", color: "#dc2626" },
  dirBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#260000",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#440000",
  },
});
