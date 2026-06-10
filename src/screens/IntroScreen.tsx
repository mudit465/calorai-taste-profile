import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import BottomNav from "../components/BottomNav";
import { Ionicons } from "@expo/vector-icons";

export default function IntroScreen({ navigation }: any) {
  return (
    <LinearGradient
      colors={["#000000", "#0a0f0a", "#000000"]}
      style={styles.container}
    >
      <View style={styles.headerRow}>
  <Ionicons
    name="arrow-back"
    size={28}
    color="white"
  />

  <Text style={styles.header}>
    Design Your Food Plan
  </Text>
</View>

      <View style={styles.card}>
        <Text style={styles.emoji}>😊</Text>

        <Text style={styles.title}>Build Your Taste Profile</Text>

        <Text style={styles.subtitle}>
          Swipe right on foods you love, left on foods you don't.
        </Text>

        <Text style={styles.small}>
          This helps us recommend meals you'll love eating.
        </Text>

<TouchableOpacity
  style={styles.button}
  onPress={() => navigation.navigate("Swipe")}
>

          <Text style={styles.buttonText}>Start Swiping</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>Takes about 2 minutes.</Text>
      </View>
    <BottomNav />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {

  flex: 1,

  padding: 20,

  justifyContent: "space-between",

  paddingTop: 80,

  paddingBottom: 20,

},
  header: {
  color: "white",
  fontSize: 32,
  fontWeight: "700",
  marginLeft: 12,
},
  card: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 25,
    padding: 25,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  emoji: {
    fontSize: 50,
    textAlign: "center",
    marginBottom: 20,
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 15,
  },
  subtitle: {
    color: "#ddd",
    textAlign: "center",
    marginBottom: 15,
  },
  small: {
    color: "#888",
    textAlign: "center",
    marginBottom: 25,
  },
  button: {
    backgroundColor: "#43E97B",
    padding: 14,
    borderRadius: 25,
    alignItems: "center",
  },
  buttonText: {
    fontWeight: "700",
  },
  footer: {
    color: "#777",
    textAlign: "center",
    marginTop: 20,
  },
  headerRow: {

  flexDirection: "row",

  alignItems: "center",

  marginBottom: 25,

},
});