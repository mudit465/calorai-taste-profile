import { View, Text } from "react-native";

export default function SwipeScreen() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#000",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ color: "white" }}>
        Swipe Screen
      </Text>
    </View>
  );
}