import { Ionicons } from "@expo/vector-icons"; // Built into Expo
import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "white",
          height: 60,
          paddingBottom: 10,
          borderTopWidth: 1,
          borderTopColor: "#eee",
        },
        tabBarActiveTintColor: "#dc2626", // Red like your SOS button
        tabBarInactiveTintColor: "#8e8e93",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons name="map" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="emergency" // Make sure you have emergency.tsx in your (tabs) folder
        options={{
          title: "Emergency",
          tabBarIcon: ({ color }) => (
            <Ionicons name="alert-circle" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile" // Make sure you have profile.tsx in your (tabs) folder
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
