import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Swiper from "react-native-deck-swiper";
import { foods } from "../data/foods";

export default function SwipeScreen() {
  return (
    <View style={styles.container}>
      <Swiper
        cards={foods}
        renderCard={(card) => {
          if (!card) return null;

          return (
            <View style={styles.card}>
              <Text style={styles.emoji}>
                {card.emoji}
              </Text>

              <Text style={styles.title}>
                {card.name}
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  card: {
    flex: 0.7,
    borderRadius: 20,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333",
  },

  emoji: {
    fontSize: 80,
  },

  title: {
    color: "white",
    fontSize: 28,
    marginTop: 20,
    fontWeight: "700",
  },
});