import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Swiper from "react-native-deck-swiper";
import { foods } from "../data/foods";

export default function SwipeScreen() {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  return (
    <View style={styles.container}>
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${((currentIndex + 1) / foods.length) * 100}%`,
            },
          ]}
        />
      </View>

      {/* Swiper */}
      <View style={styles.swiperContainer}>
        <Swiper
          cards={foods}
          backgroundColor="transparent"
          stackSize={3}
          cardVerticalMargin={50}
          onSwiped={() => {
            setCurrentIndex((prev) => prev + 1);
          }}
          renderCard={(card) => {
            if (!card) return null;

            return (
              <View style={styles.card}>
                <Text style={styles.emoji}>{card.emoji}</Text>
                <Text style={styles.title}>{card.name}</Text>
              </View>
            );
          }}
        />
      </View>

      {/* Bottom Buttons */}
      <View style={styles.buttonContainer}>
        <Text style={styles.button}>❌</Text>
        <Text style={styles.button}>❓</Text>
        <Text style={styles.button}>⭐</Text>
        <Text style={styles.button}>❤️</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  progressContainer: {
    marginTop: 60,
    marginHorizontal: 20,
    height: 6,
    backgroundColor: "#222",
    borderRadius: 10,
  },

  progressFill: {
    height: 6,
    backgroundColor: "#43E97B",
    borderRadius: 10,
  },

  swiperContainer: {
    flex: 1,
    justifyContent: "center",
  },

  card: {
    height: 450,
    borderRadius: 25,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333",
  },

  emoji: {
    fontSize: 90,
  },

  title: {
    color: "white",
    fontSize: 28,
    fontWeight: "700",
    marginTop: 20,
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingBottom: 40,
  },

  button: {
    fontSize: 40,
  },
});