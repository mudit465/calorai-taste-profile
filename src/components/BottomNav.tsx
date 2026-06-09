import { View, Text } from "react-native";

export default function BottomNav() {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-around",
        backgroundColor: "#111",
        padding: 15,
        borderRadius: 25,
      }}
    >
      <Text style={{ color: "#43E97B" }}>🏠</Text>
      <Text style={{ color: "white" }}>?</Text>
      <Text style={{ color: "white" }}>🪽</Text>
      <Text style={{ color: "white" }}>🔍</Text>
    </View>
  );
}