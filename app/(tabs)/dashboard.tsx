import * as Location from "expo-location";
import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Animated,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import MapView, { Circle, Marker, PROVIDER_DEFAULT } from "react-native-maps";
import Svg, { Path } from "react-native-svg";

type TabType = "home" | "emergency" | "profile";
type SosState = "idle" | "alerting" | "sent";

// ─── Chevron Icon ─────────────────────────────────────────────────────────────
const ChevronRight = () => (
  <Svg
    width={20}
    height={20}
    viewBox="0 0 24 24"
    fill="none"
    stroke="#94a3b8"
    strokeWidth={2}
  >
    <Path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </Svg>
);

// ─── Toggle Row ───────────────────────────────────────────────────────────────
type ToggleRowProps = {
  label: string;
  value: boolean;
  onToggle: () => void;
  iconColor: string;
  iconBg: string;
  iconPath: string;
  borderBottom?: boolean;
};

const ToggleRow = ({
  label,
  value,
  onToggle,
  iconColor,
  iconBg,
  iconPath,
  borderBottom = true,
}: ToggleRowProps) => (
  <View style={[styles.settingRow, borderBottom ? styles.borderBottom : null]}>
    <View style={[styles.iconBox, { backgroundColor: iconBg }]}>
      <Svg
        width={20}
        height={20}
        viewBox="0 0 24 24"
        fill="none"
        stroke={iconColor}
        strokeWidth={2}
      >
        <Path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
      </Svg>
    </View>
    <Text style={styles.settingLabel}>{label}</Text>
    <Switch
      value={value}
      onValueChange={onToggle}
      trackColor={{ false: "#cbd5e1", true: "#dc2626" }}
      thumbColor="#ffffff"
    />
  </View>
);

// ─── Setting Button ───────────────────────────────────────────────────────────
type SettingButtonProps = {
  label: string;
  iconColor: string;
  iconBg: string;
  iconPath: string;
  labelColor?: string;
  borderBottom?: boolean;
};

const SettingButton = ({
  label,
  iconColor,
  iconBg,
  iconPath,
  labelColor = "#334155",
  borderBottom = true,
}: SettingButtonProps) => (
  <TouchableOpacity
    style={[styles.settingRow, borderBottom ? styles.borderBottom : null]}
    activeOpacity={0.7}
  >
    <View style={[styles.iconBox, { backgroundColor: iconBg }]}>
      <Svg
        width={20}
        height={20}
        viewBox="0 0 24 24"
        fill="none"
        stroke={iconColor}
        strokeWidth={2}
      >
        <Path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
      </Svg>
    </View>
    <Text style={[styles.settingLabel, { color: labelColor }]}>{label}</Text>
    <ChevronRight />
  </TouchableOpacity>
);

// ─── Emergency Card ───────────────────────────────────────────────────────────
type EmergencyCardProps = {
  label: string;
  sub: string;
  iconBg: string;
  iconColor: string;
  iconPath: string;
};

const EmergencyCard = ({
  label,
  sub,
  iconBg,
  iconColor,
  iconPath,
}: EmergencyCardProps) => (
  <TouchableOpacity style={styles.emergencyCard} activeOpacity={0.8}>
    <View style={[styles.emergencyIcon, { backgroundColor: iconBg }]}>
      <Svg
        width={28}
        height={28}
        viewBox="0 0 24 24"
        fill="none"
        stroke={iconColor}
        strokeWidth={2}
      >
        <Path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
      </Svg>
    </View>
    <View style={styles.flex1}>
      <Text style={styles.emergencyLabel}>{label}</Text>
      <Text style={styles.emergencySub}>{sub}</Text>
    </View>
    <ChevronRight />
  </TouchableOpacity>
);

// ─── Tab Icon ─────────────────────────────────────────────────────────────────
const TabIcon = ({ id, active }: { id: TabType; active: boolean }) => {
  const color = active ? "white" : "#64748b";
  const paths: Record<TabType, string> = {
    home: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    emergency:
      "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636",
    profile:
      "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  };
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
    >
      <Path strokeLinecap="round" strokeLinejoin="round" d={paths[id]} />
    </Svg>
  );
};

// ─── CDO default coords (used before GPS locks on) ───────────────────────────
const CDO_DEFAULT = { latitude: 8.4542, longitude: 124.6319 };

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const [currentTab, setCurrentTab] = useState<TabType>("home");
  const [sosState, setSosState] = useState<SosState>("idle");
  const [notificationsOn, setNotificationsOn] = useState(true);
  const [locationOn, setLocationOn] = useState(true);
  const [darkModeOn, setDarkModeOn] = useState(false);

  // Live location state
  const [userCoords, setUserCoords] = useState(CDO_DEFAULT);
  const [locationLabel, setLocationLabel] = useState("Cagayan de Oro City");
  const [locationLoading, setLocationLoading] = useState(true);
  const [locationError, setLocationError] = useState(false);
  const mapRef = useRef<MapView>(null);

  const sosScale = useRef(new Animated.Value(1)).current;

  // ── Request permission + watch GPS ───────────────────────────────────────
  useEffect(() => {
    let watcher: Location.LocationSubscription | null = null;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocationError(true);
        setLocationLoading(false);
        return;
      }

      // Get first fix quickly
      const initial = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const { latitude, longitude } = initial.coords;
      setUserCoords({ latitude, longitude });
      setLocationLoading(false);

      // Reverse geocode to get street name
      const geo = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (geo.length > 0) {
        const g = geo[0];
        const parts = [g.street, g.district ?? g.subregion ?? g.city].filter(
          Boolean,
        );
        setLocationLabel(parts.join(", ") || "Cagayan de Oro City");
      }

      // Watch position — update marker every 15 m
      watcher = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 15,
          timeInterval: 5000,
        },
        (loc) => {
          const coords = {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          };
          setUserCoords(coords);
          mapRef.current?.animateToRegion(
            { ...coords, latitudeDelta: 0.01, longitudeDelta: 0.01 },
            800,
          );
        },
      );
    })();

    return () => {
      watcher?.remove();
    };
  }, []);

  // ── SOS pulse animation ───────────────────────────────────────────────────
  useEffect(() => {
    if (sosState === "idle") {
      Animated.loop(
        Animated.sequence([
          Animated.timing(sosScale, {
            toValue: 1.06,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(sosScale, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      sosScale.stopAnimation();
      sosScale.setValue(1);
    }
  }, [sosState]);

  const handleSOS = () => {
    if (sosState !== "idle") return;
    setSosState("alerting");
    setTimeout(() => {
      setSosState("sent");
      setTimeout(() => setSosState("idle"), 2000);
    }, 1500);
  };

  const recenterMap = () => {
    mapRef.current?.animateToRegion(
      { ...userCoords, latitudeDelta: 0.01, longitudeDelta: 0.01 },
      600,
    );
  };

  const emergencyContacts: EmergencyCardProps[] = [
    {
      label: "Emergency Hotline",
      sub: "911 • Available 24/7",
      iconBg: "#fee2e2",
      iconColor: "#dc2626",
      iconPath:
        "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
    },
    {
      label: "Police Station",
      sub: "0.8 km away",
      iconBg: "#dbeafe",
      iconColor: "#dc2626",
      iconPath:
        "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
    },
    {
      label: "Hospital",
      sub: "1.2 km away",
      iconBg: "#d1fae5",
      iconColor: "#059669",
      iconPath:
        "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
    },
    {
      label: "Fire Station",
      sub: "2.1 km away",
      iconBg: "#fef3c7",
      iconColor: "#d97706",
      iconPath:
        "M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z",
    },
  ];

  const tabs: { id: TabType; label: string }[] = [
    { id: "home", label: "Home" },
    { id: "emergency", label: "Emergency" },
    { id: "profile", label: "Profile" },
  ];

  // ── HOME TAB ─────────────────────────────────────────────────────────────────
  const HomeTab = () => (
    <View style={styles.flex1}>
      {/* Header */}
      <View style={styles.homeHeader}>
        <View>
          <Text style={styles.welcomeText}>Welcome back!</Text>
          <Text style={styles.appTitle}>SmartGuide</Text>
        </View>
        <TouchableOpacity style={styles.notifBtn}>
          <Svg
            width={20}
            height={20}
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth={2}
          >
            <Path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </Svg>
        </TouchableOpacity>
      </View>

      {/* Map Card */}
      <View style={styles.mapCard}>
        {/* Loading state */}
        {locationLoading && !locationError && (
          <View style={styles.mapPlaceholder}>
            <ActivityIndicator size="large" color="#dc2626" />
            <Text style={styles.mapPlaceholderText}>
              Getting your location...
            </Text>
          </View>
        )}

        {/* Permission denied */}
        {locationError && (
          <View style={styles.mapPlaceholder}>
            <Svg
              width={40}
              height={40}
              viewBox="0 0 24 24"
              fill="none"
              stroke="#dc2626"
              strokeWidth={2}
            >
              <Path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              />
            </Svg>
            <Text style={styles.mapPlaceholderText}>
              Location permission denied
            </Text>
            <Text style={styles.mapPlaceholderSub}>
              Enable in device Settings → Privacy
            </Text>
          </View>
        )}

        {/* Live Map */}
        {!locationLoading && !locationError && (
          <>
            <MapView
              ref={mapRef}
              style={StyleSheet.absoluteFillObject}
              provider={PROVIDER_DEFAULT}
              initialRegion={{
                ...userCoords,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              showsUserLocation={false}
              showsMyLocationButton={false}
              showsCompass={true}
              showsScale={true}
              mapType="standard"
            >
              {/* Accuracy ring */}
              <Circle
                center={userCoords}
                radius={80}
                fillColor="rgba(220,38,38,0.1)"
                strokeColor="rgba(220,38,38,0.4)"
                strokeWidth={1.5}
              />
              {/* You are here */}
              <Marker
                coordinate={userCoords}
                title="You are here"
                description={locationLabel}
                anchor={{ x: 0.5, y: 0.5 }}
              >
                <View style={styles.liveMarker}>
                  <View style={styles.liveMarkerCore} />
                </View>
              </Marker>
            </MapView>

            {/* Recenter button */}
            <View style={styles.mapControls}>
              <TouchableOpacity
                style={[styles.mapControlBtn, { backgroundColor: "#dc2626" }]}
                onPress={recenterMap}
              >
                <Svg width={20} height={20} viewBox="0 0 24 24" fill="white">
                  <Path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06z" />
                </Svg>
              </TouchableOpacity>
            </View>

            {/* Location info overlay */}
            <View style={styles.infoCard}>
              <View style={styles.infoIconBox}>
                <Svg
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#dc2626"
                  strokeWidth={2}
                >
                  <Path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <Path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </Svg>
              </View>
              <View style={styles.flex1}>
                <Text style={styles.infoTitle}>Current Location</Text>
                <Text style={styles.infoSub} numberOfLines={1}>
                  {locationLabel}
                </Text>
              </View>
              <View style={styles.activeBadge}>
                <Text style={styles.activeBadgeText}>● Live</Text>
              </View>
            </View>
          </>
        )}
      </View>
    </View>
  );

  // ── EMERGENCY TAB ─────────────────────────────────────────────────────────────
  const EmergencyTab = () => (
    <ScrollView
      style={styles.flex1}
      contentContainerStyle={styles.emergencyContainer}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.emergencyTitle}>Emergency Services</Text>
      <Text style={styles.emergencySubTitle}>
        Quick access to help when you need it
      </Text>

      <View style={styles.sosWrapper}>
        <Animated.View style={{ transform: [{ scale: sosScale }] }}>
          <TouchableOpacity
            onPress={handleSOS}
            activeOpacity={0.85}
            style={[
              styles.sosButton,
              sosState === "sent" ? styles.sosSent : styles.sosIdle,
            ]}
          >
            {sosState === "idle" && (
              <>
                <Svg
                  width={40}
                  height={40}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth={2}
                >
                  <Path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                  />
                </Svg>
                <Text style={styles.sosText}>SOS</Text>
              </>
            )}
            {sosState === "alerting" && (
              <Text style={styles.sosText}>Alerting...</Text>
            )}
            {sosState === "sent" && (
              <>
                <Svg
                  width={40}
                  height={40}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth={2}
                >
                  <Path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </Svg>
                <Text style={styles.sosText}>Help Sent</Text>
              </>
            )}
          </TouchableOpacity>
        </Animated.View>
      </View>

      {emergencyContacts.map((item) => (
        <React.Fragment key={item.label}>
          <EmergencyCard {...item} />
        </React.Fragment>
      ))}
    </ScrollView>
  );

  // ── PROFILE TAB ───────────────────────────────────────────────────────────────
  const ProfileTab = () => (
    <ScrollView
      style={styles.flex1}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.profileContainer}
    >
      <View style={styles.profileHeader}>
        <Text style={styles.profileHeaderTitle}>Profile & Settings</Text>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatarBox}>
          <Text style={styles.avatarText}>JD</Text>
        </View>
        <View style={styles.flex1}>
          <Text style={styles.profileName}>John Doe</Text>
          <Text style={styles.profileEmail}>john.doe@email.com</Text>
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumText}>Premium Member</Text>
          </View>
        </View>
      </View>

      <View style={styles.settingsSections}>
        <View style={styles.settingsCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>ACCOUNT</Text>
          </View>
          <SettingButton
            label="Edit Profile"
            iconBg="#dbeafe"
            iconColor="#dc2626"
            iconPath="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
          <SettingButton
            label="Security"
            iconBg="#f3e8ff"
            iconColor="#942a17"
            iconPath="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            borderBottom={false}
          />
        </View>

        <View style={styles.settingsCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>PREFERENCES</Text>
          </View>
          <ToggleRow
            label="Notifications"
            value={notificationsOn}
            onToggle={() => setNotificationsOn(!notificationsOn)}
            iconBg="#fef3c7"
            iconColor="#d97706"
            iconPath="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
          <ToggleRow
            label="Location Services"
            value={locationOn}
            onToggle={() => setLocationOn(!locationOn)}
            iconBg="#d1fae5"
            iconColor="#059669"
            iconPath="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <ToggleRow
            label="Dark Mode"
            value={darkModeOn}
            onToggle={() => setDarkModeOn(!darkModeOn)}
            iconBg="#f1f5f9"
            iconColor="#475569"
            iconPath="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            borderBottom={false}
          />
        </View>

        <View style={styles.settingsCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>SUPPORT</Text>
          </View>
          <SettingButton
            label="Help Center"
            iconBg="#cffafe"
            iconColor="#dc2626"
            iconPath="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
          <SettingButton
            label="Log Out"
            iconBg="#fee2e2"
            iconColor="#b91c1c"
            iconPath="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            labelColor="#b91c1c"
            borderBottom={false}
          />
        </View>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <View style={styles.flex1}>
        {currentTab === "home" && <HomeTab />}
        {currentTab === "emergency" && <EmergencyTab />}
        {currentTab === "profile" && <ProfileTab />}
      </View>

      {/* Bottom Tab Bar */}
      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const active = currentTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tabBtn, active ? styles.tabBtnActive : null]}
              onPress={() => setCurrentTab(tab.id)}
              activeOpacity={0.8}
            >
              <TabIcon id={tab.id} active={active} />
              <Text
                style={[styles.tabLabel, active ? styles.tabLabelActive : null]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#ffffff" },
  flex1: { flex: 1 },

  // Home header
  homeHeader: {
    backgroundColor: "#dc2626",
    padding: 24,
    paddingBottom: 80,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  welcomeText: { color: "#fecaca", fontSize: 13 },
  appTitle: { color: "white", fontSize: 24, fontWeight: "700", marginTop: 4 },
  notifBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },

  // Map card (the floating card that overlaps the header)
  mapCard: {
    flex: 1,
    marginHorizontal: 16,
    marginBottom: 16,
    marginTop: -56,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    backgroundColor: "#f1f5f9",
    minHeight: 300,
  },

  // Loading / error placeholder
  mapPlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 32,
  },
  mapPlaceholderText: {
    color: "#334155",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  mapPlaceholderSub: { color: "#94a3b8", fontSize: 12, textAlign: "center" },

  // Live location marker
  liveMarker: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "rgba(220,38,38,0.2)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#dc2626",
  },
  liveMarkerCore: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#dc2626",
  },

  // Recenter button
  mapControls: { position: "absolute", top: 16, right: 16 },
  mapControlBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  // Info card overlay at bottom of map
  infoCard: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  infoIconBox: {
    width: 48,
    height: 48,
    backgroundColor: "#fee2e2",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  infoTitle: { fontWeight: "600", color: "#1e293b", fontSize: 15 },
  infoSub: { color: "#64748b", fontSize: 13, marginTop: 2 },
  activeBadge: {
    backgroundColor: "#d1fae5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  activeBadgeText: { color: "#065f46", fontSize: 11, fontWeight: "600" },

  // Emergency
  emergencyContainer: { padding: 16, paddingBottom: 32 },
  emergencyTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1e293b",
    textAlign: "center",
    marginBottom: 4,
  },
  emergencySubTitle: {
    color: "#64748b",
    textAlign: "center",
    marginBottom: 32,
  },
  sosWrapper: { alignItems: "center", marginBottom: 32 },
  sosButton: {
    width: 128,
    height: 128,
    borderRadius: 64,
    alignItems: "center",
    justifyContent: "center",
    elevation: 10,
    shadowColor: "#ef4444",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  sosIdle: { backgroundColor: "#ef4444" },
  sosSent: { backgroundColor: "#10b981" },
  sosText: { color: "white", fontWeight: "700", fontSize: 16, marginTop: 4 },
  emergencyCard: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    marginBottom: 12,
  },
  emergencyIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  emergencyLabel: { fontWeight: "600", color: "#1e293b", fontSize: 15 },
  emergencySub: { color: "#64748b", fontSize: 13, marginTop: 2 },

  // Profile
  profileContainer: { paddingBottom: 32 },
  profileHeader: { backgroundColor: "#1e293b", padding: 24, paddingBottom: 64 },
  profileHeaderTitle: { color: "white", fontSize: 20, fontWeight: "700" },
  profileCard: {
    marginHorizontal: 16,
    marginTop: -40,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 24,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    marginBottom: 16,
  },
  avatarBox: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: "#d82b2b",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "white", fontSize: 24, fontWeight: "700" },
  profileName: { fontSize: 20, fontWeight: "700", color: "#1e293b" },
  profileEmail: { color: "#64748b", fontSize: 14 },
  premiumBadge: {
    marginTop: 8,
    backgroundColor: "#d1fae5",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  premiumText: { color: "#065f46", fontSize: 12, fontWeight: "600" },
  settingsSections: { paddingHorizontal: 16, paddingBottom: 32 },
  settingsCard: {
    backgroundColor: "white",
    borderRadius: 20,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    marginBottom: 16,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#f8fafc",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#94a3b8",
    letterSpacing: 1,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 16,
  },
  borderBottom: { borderBottomWidth: 1, borderBottomColor: "#f1f5f9" },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  settingLabel: { flex: 1, fontSize: 15, fontWeight: "500", color: "#334155" },

  // Tab bar
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  tabBtn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 16,
    gap: 4,
  },
  tabBtnActive: { backgroundColor: "#b83e2e" },
  tabLabel: { fontSize: 11, fontWeight: "500", color: "#64748b" },
  tabLabelActive: { color: "white" },
});
