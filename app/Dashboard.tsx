import React from "react";
import { StyleSheet, View } from "react-native";
import HomeScreen from "./screens/HomeScreen";

export default function Dashboard() {
  return (
    <View style={styles.container}>
      <HomeScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
