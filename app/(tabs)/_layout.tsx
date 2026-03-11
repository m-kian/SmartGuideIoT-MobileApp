import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: "none" }, // hide expo-router tab bar
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="dashboard" />
      <Tabs.Screen name="explore" options={{ href: null }} />
      <Tabs.Screen name="modal" options={{ href: null }} />
    </Tabs>
  );
}
