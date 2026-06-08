import { View, Text } from "react-native";

export default function ResultsScreen() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#000",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          color: "white",
          fontSize: 30,
        }}
      >
        Taste Profile
      </Text>
    </View>
  );
}