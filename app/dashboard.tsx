import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import authStyles from '@/styles/authStyles';

export default function DashboardScreen() {
  const router = useRouter();

  return (
    <View style={authStyles.screen}>
      <View style={authStyles.backgroundBase} />
      <View style={authStyles.backgroundGlowTop} />
      <View style={authStyles.backgroundGlowBottom} />

      <ScrollView contentContainerStyle={authStyles.dashboardShell}>
        <View style={authStyles.dashboardCard}>
        <Text style={authStyles.dashboardTitle}>Dashboard</Text>
        <Text style={authStyles.subtitle}>Welcome to SmartGuide monitoring center.</Text>

        <View style={authStyles.statGrid}>
          <View style={authStyles.statCard}>
            <Ionicons name="pulse-outline" size={18} color="#E7C989" />
            <Text style={authStyles.statLabel}>System Status</Text>
            <Text style={authStyles.statValue}>Online</Text>
          </View>
          <View style={authStyles.statCard}>
            <Ionicons name="notifications-outline" size={18} color="#E7C989" />
            <Text style={authStyles.statLabel}>Alerts</Text>
            <Text style={authStyles.statValue}>2 Active</Text>
          </View>
        </View>

        <Pressable style={authStyles.secondaryButton} onPress={() => router.replace('/')}>
          <Text style={authStyles.secondaryButtonText}>Sign Out</Text>
        </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
