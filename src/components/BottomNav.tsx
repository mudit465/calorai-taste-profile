import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";

type TabName = "Start" | "FAQ" | "TasteProfile" | "Search";

interface BottomNavProps {
  activeTab?: TabName;
  onTabPress?: (tab: TabName) => void;
}

const NAV_ITEMS: {
  key: TabName;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconActive: keyof typeof Ionicons.glyphMap;
}[] = [
  {
    key: "Start",
    label: "Start",
    icon: "home-outline",
    iconActive: "home",
  },
  {
    key: "FAQ",
    label: "FAQ",
    icon: "help-circle-outline",
    iconActive: "help-circle",
  },
  {
    key: "TasteProfile",
    label: "Taste Profile",
    icon: "person-outline",
    iconActive: "person",
  },
  {
    key: "Search",
    label: "",
    icon: "search-outline",
    iconActive: "search",
  },
];

const ACTIVE_COLOR = "#4ADE80";
const INACTIVE_COLOR = "rgba(255,255,255,0.38)";
const ACTIVE_BG = "rgba(255,255,255,0.10)";

export default function BottomNav({
  activeTab = "Start",
  onTabPress,
}: BottomNavProps) {
  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      <BlurView
        intensity={60}
        tint="dark"
        style={styles.blurContainer}
        experimentalBlurMethod={Platform.OS === "android" ? "dimezisBlurView" : undefined}
      >
        {/* Frosted overlay for extra depth */}
        <View style={styles.frostedOverlay} />

        <View style={styles.navRow}>
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.key;
            return (
              <TouchableOpacity
                key={item.key}
                style={[styles.tabItem, isActive && styles.tabItemActive]}
                onPress={() => onTabPress?.(item.key)}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={item.label || item.key}
                accessibilityState={{ selected: isActive }}
              >
                {isActive && <View style={styles.activePill} />}
                <Ionicons
                  name={isActive ? item.iconActive : item.icon}
                  size={item.key === "Search" ? 22 : 21}
                  color={isActive ? ACTIVE_COLOR : INACTIVE_COLOR}
                />
                {item.label ? (
                  <Text
                    style={[
                      styles.label,
                      isActive ? styles.labelActive : styles.labelInactive,
                    ]}
                    numberOfLines={1}
                  >
                    {item.label}
                  </Text>
                ) : null}
              </TouchableOpacity>
            );
          })}
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    // Subtle top shadow so it floats over content
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 20,
  },
  blurContainer: {
    overflow: "hidden",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    borderBottomWidth: 0,
  },
  frostedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(18, 18, 20, 0.55)",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  navRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: 14,
    minHeight: 44,
    position: "relative",
  },
  tabItemActive: {
    backgroundColor: ACTIVE_BG,
  },
  activePill: {
    position: "absolute",
    top: 0,
    left: "20%",
    right: "20%",
    height: 2,
    borderRadius: 2,
    backgroundColor: "#4ADE80", // Green accent matching Figma's green CTA
  },
  label: {
    marginTop: 4,
    fontSize: 10,
    fontWeight: "500",
    letterSpacing: 0.2,
    textAlign: "center",
  },
  labelActive: {
    color: ACTIVE_COLOR,
  },
  labelInactive: {
    color: INACTIVE_COLOR,
  },
});