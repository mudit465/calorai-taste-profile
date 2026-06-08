import { View, Text, StyleSheet } from "react-native";

export default function ResultsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Your Taste Profile</Text>

      <View style={styles.card}>
        <Text style={styles.item}>❤️ Foods Reviewed: 4</Text>
        <Text style={styles.item}>🎯 Profile Generated</Text>
        <Text style={styles.item}>🥗 Healthy & Balanced Eater</Text>
      </View>

      <Text style={styles.description}>
        You enjoy a mix of comfort food and healthy options. Based on your
        choices, CalorAI can recommend meals that match your taste.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  heading: {
    color: "white",
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 30,
  },

  card: {
    width: "100%",
    backgroundColor: "#111",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#333",
  },

  item: {
    color: "white",
    fontSize: 18,
    marginBottom: 15,
  },

  description: {
    color: "#999",
    textAlign: "center",
    marginTop: 30,
    lineHeight: 22,
  },
});