import React from "react";
import Swiper from "react-native-deck-swiper";
import { foods } from "../data/foods";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

export default function SwipeScreen({ navigation }: any) {
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
          cardVerticalMargin={40}
          onSwiped={() => {
            setCurrentIndex((prev) => prev + 1);
          }}
          onSwipedAll={() => {
            navigation.navigate("Results");
          }}
          renderCard={(card) => {
            if (!card) return null;

            return (
              <View style={styles.card}>
                <Image
                  source={{ uri: card.image }}
                  style={styles.foodImage}
                />

                <Text style={styles.title}>{card.name}</Text>

                <Text style={styles.category}>
                  {card.category}
                </Text>
              </View>
            );
          }}
        />
      </View>

      {/* Bottom Buttons */}
      <View style={styles.buttonContainer}>
  <TouchableOpacity style={styles.circleButton}>
    <Text style={styles.buttonIcon}>❌</Text>
  </TouchableOpacity>

  <TouchableOpacity style={styles.circleButton}>
    <Text style={styles.buttonIcon}>❓</Text>
  </TouchableOpacity>

  <TouchableOpacity style={styles.circleButton}>
    <Text style={styles.buttonIcon}>⭐</Text>
  </TouchableOpacity>

  <TouchableOpacity style={styles.circleButton}>
    <Text style={styles.buttonIcon}>❤️</Text>
  </TouchableOpacity>
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
    height: 580,
    borderRadius: 25,
    backgroundColor: "#111",
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333",
  },

  foodImage: {
    width: 300,
    height: 380,
    borderRadius: 20,
  },

  title: {
    color: "white",
    fontSize: 28,
    fontWeight: "700",
    marginTop: 15,
  },

  category: {
    color: "#888",
    fontSize: 16,
    marginTop: 6,
    textTransform: "capitalize",
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingBottom: 40,
  },

  button: {
    fontSize: 40,
  },
  circleButton: {
  width: 60,
  height: 60,
  borderRadius: 30,
  backgroundColor: "#1a1a1a",
  justifyContent: "center",
  alignItems: "center",
  borderWidth: 1,
  borderColor: "#333",
},

buttonIcon: {
  fontSize: 28,
},
});