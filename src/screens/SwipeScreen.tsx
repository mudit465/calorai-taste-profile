import React, { useRef, useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Platform,
  Animated,
  PanResponder,
} from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import BottomNav from "../components/BottomNav";

// ─── Types ────────────────────────────────────────────────────────────────────
type SwipeDir = "left" | "right" | "up" | "down" | null;

interface FoodCard {
  id: number;
  emoji: string;
  question: string;
}

// React Navigation prop (optional — gracefully degrades without it)
interface Props {
  navigation?: { navigate: (screen: string) => void };
}

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
  bg: "#0C0C0E",
  cardBg: "rgba(255,255,255,0.06)",
  cardBorder: "rgba(255,255,255,0.10)",
  cardShadow: "#000000",
  green: "#4ADE80",
  greenGlow: "rgba(74,222,128,0.22)",
  greenBg: "rgba(74,222,128,0.12)",
  red: "#F87171",
  redGlow: "rgba(248,113,113,0.22)",
  redBg: "rgba(248,113,113,0.12)",
  purple: "#A78BFA",
  purpleGlow: "rgba(167,139,250,0.22)",
  purpleBg: "rgba(167,139,250,0.12)",
  gray: "#9CA3AF",
  grayGlow: "rgba(156,163,175,0.18)",
  grayBg: "rgba(156,163,175,0.10)",
  white: "#FFFFFF",
  textPrimary: "#F0F0F0",
  textSecondary: "rgba(255,255,255,0.50)",
  progressBg: "rgba(255,255,255,0.10)",
};

// ─── Layout constants ─────────────────────────────────────────────────────────
const { width: W, height: H } = Dimensions.get("window");
const CARD_W = W - 48;
const CARD_H = Math.min(CARD_W * 1.18, H * 0.46);
const SWIPE_THRESHOLD = W * 0.28;
const SWIPE_V_THRESHOLD = H * 0.18;
const FLY_DURATION = 260;
const ROTATION_MAX = 10; // degrees at full swipe

// ─── Food Cards Data ──────────────────────────────────────────────────────────
const FOOD_CARDS: FoodCard[] = [
  { id: 1,  emoji: "🥗",  question: "I love eating salads" },
  { id: 2,  emoji: "🥩",  question: "I enjoy red meat" },
  { id: 3,  emoji: "🍝",  question: "Pasta is my comfort food" },
  { id: 4,  emoji: "🥑",  question: "Avocado on everything" },
  { id: 5,  emoji: "🍣",  question: "I love sushi & raw fish" },
  { id: 6,  emoji: "🫐",  question: "Fresh berries daily" },
  { id: 7,  emoji: "🍕",  question: "Pizza is a weekly staple" },
  { id: 8,  emoji: "🥦",  question: "Vegetables are my go-to" },
];

// ─── Overlay Badge ────────────────────────────────────────────────────────────
const BADGE_CONFIG: Record<
  "left" | "right" | "up" | "down",
  { label: string; color: string; borderColor: string; position: object; rotate: string }
> = {
  right: {
    label: "YES",
    color: C.green,
    borderColor: C.green,
    position: { top: 32, left: 20 },
    rotate: "-12deg",
  },
  left: {
    label: "NO",
    color: C.red,
    borderColor: C.red,
    position: { top: 32, right: 20 },
    rotate: "12deg",
  },
  up: {
    label: "SUPER LIKE",
    color: C.purple,
    borderColor: C.purple,
    position: { bottom: 40, alignSelf: "center", left: 0, right: 0 },
    rotate: "0deg",
  },
  down: {
    label: "UNSURE",
    color: C.gray,
    borderColor: C.gray,
    position: { top: 32, alignSelf: "center", left: 0, right: 0 },
    rotate: "0deg",
  },
};

function OverlayBadge({ direction }: { direction: SwipeDir }) {
  if (!direction) return null;
  const cfg = BADGE_CONFIG[direction];
  return (
    <View
      style={[
        styles.overlayBadge,
        cfg.position,
        {
          borderColor: cfg.borderColor,
          transform: [{ rotate: cfg.rotate }],
        },
      ]}
    >
      <Text style={[styles.overlayBadgeText, { color: cfg.color }]}>
        {cfg.label}
      </Text>
    </View>
  );
}

// ─── Swipeable Card ───────────────────────────────────────────────────────────
interface SwipeCardProps {
  card: FoodCard;
  isTop: boolean;
  stackIndex: number; // 0 = top
  onSwipe: (dir: "left" | "right" | "up" | "down") => void;
  triggerRef: React.MutableRefObject<((dir: "left" | "right" | "up" | "down") => void) | null>;
}

function SwipeCard({ card, isTop, stackIndex, onSwipe, triggerRef }: SwipeCardProps) {
  const pan = useRef(new Animated.ValueXY()).current;
  const swipeDirRef = useRef<SwipeDir>(null);
  const [overlayDir, setOverlayDir] = useState<SwipeDir>(null);

  // Rotation interpolated from X pan
  const rotate = pan.x.interpolate({
    inputRange: [-W, 0, W],
    outputRange: [`-${ROTATION_MAX}deg`, "0deg", `${ROTATION_MAX}deg`],
    extrapolate: "clamp",
  });

  // Stacked cards: scale down + peek up
  const stackScale = 1 - stackIndex * 0.04;
  const stackTranslateY = stackIndex * 10;

  const animatedStyle = isTop
    ? {
        transform: [
          { translateX: pan.x },
          { translateY: pan.y },
          { rotate },
        ],
        zIndex: 10,
      }
    : {
        transform: [
          { scale: stackScale },
          { translateY: stackTranslateY },
        ],
        zIndex: 10 - stackIndex,
        opacity: 1 - stackIndex * 0.12,
      };

  const flyOut = useCallback(
    (dir: "left" | "right" | "up" | "down") => {
      const targets = {
        right: { x: W * 1.6,  y: 0 },
        left:  { x: -W * 1.6, y: 0 },
        up:    { x: 0,         y: -H * 0.9 },
        down:  { x: 0,         y: H * 0.9 },
      };
      Animated.timing(pan, {
        toValue: targets[dir],
        duration: FLY_DURATION,
        useNativeDriver: true,
      }).start(() => {
        pan.setValue({ x: 0, y: 0 });
        setOverlayDir(null);
        swipeDirRef.current = null;
        onSwipe(dir);
      });
    },
    [onSwipe, pan]
  );

  // Expose flyOut so parent buttons can trigger it
  useEffect(() => {
    if (isTop) {
      triggerRef.current = flyOut;
    }
    return () => {
      if (isTop) triggerRef.current = null;
    };
  }, [isTop, flyOut, triggerRef]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => isTop,
      onMoveShouldSetPanResponder:  () => isTop,
      onPanResponderMove: (_, g) => {
        pan.setValue({ x: g.dx, y: g.dy });

        const absX = Math.abs(g.dx);
        const absY = Math.abs(g.dy);
        let dir: SwipeDir = null;

        if (absX > absY * 1.3 && absX > 20) {
          dir = g.dx > 0 ? "right" : "left";
        } else if (absY > absX * 1.3 && absY > 20) {
          dir = g.dy < 0 ? "up" : "down";
        }

        if (dir !== swipeDirRef.current) {
          swipeDirRef.current = dir;
          setOverlayDir(dir);
        }
      },
      onPanResponderRelease: (_, g) => {
        const absX = Math.abs(g.dx);
        const absY = Math.abs(g.dy);

        if (absX > SWIPE_THRESHOLD && absX > absY) {
          flyOut(g.dx > 0 ? "right" : "left");
        } else if (absY > SWIPE_V_THRESHOLD && absY > absX) {
          flyOut(g.dy < 0 ? "up" : "down");
        } else {
          // snap back
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true,
            friction: 7,
            tension: 90,
          }).start();
          swipeDirRef.current = null;
          setOverlayDir(null);
        }
      },
    })
  ).current;

  return (
    <Animated.View
      style={[styles.card, animatedStyle]}
      {...(isTop ? panResponder.panHandlers : {})}
    >
      {/* Glass blur fill */}
      <BlurView intensity={24} tint="dark" style={StyleSheet.absoluteFill} />
      {/* Tint overlay */}
      <View style={styles.cardTint} pointerEvents="none" />

      {/* Overlay badge */}
      {isTop && <OverlayBadge direction={overlayDir} />}

      {/* Card content: emoji + question */}
      <View style={styles.cardContent}>
        <Text style={styles.cardEmoji}>{card.emoji}</Text>
        <Text style={styles.cardQuestion}>{card.question}</Text>
      </View>
    </Animated.View>
  );
}

// ─── Action Button ────────────────────────────────────────────────────────────
interface ActionBtnProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  bgColor: string;
  glowColor: string;
  label: string;
  iconSize?: number;
  onPress: () => void;
}

function ActionBtn({
  icon,
  iconColor,
  bgColor,
  glowColor,
  label,
  iconSize = 24,
  onPress,
}: ActionBtnProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.spring(scale, {
        toValue: 0.86,
        useNativeDriver: true,
        speed: 50,
        bounciness: 0,
      }),
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        friction: 4,
        tension: 120,
      }),
    ]).start();
    onPress();
  };

  return (
    <View style={styles.actionBtnWrapper}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <TouchableOpacity
          style={[
            styles.actionBtn,
            { backgroundColor: bgColor, shadowColor: glowColor },
          ]}
          onPress={handlePress}
          activeOpacity={0.9}
        >
          <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
          <View
            style={[StyleSheet.absoluteFill, { backgroundColor: bgColor, borderRadius: 36 }]}
            pointerEvents="none"
          />
          <Ionicons name={icon} size={iconSize} color={iconColor} />
        </TouchableOpacity>
      </Animated.View>
      <Text style={styles.actionLabel}>{label}</Text>
    </View>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────
function ProgressBar({ progress }: { progress: number }) {
  const anim = useRef(new Animated.Value(progress)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const widthInterp = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.progressTrack}>
      <Animated.View style={[styles.progressFill, { width: widthInterp }]} />
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function SwipeScreen({ navigation }: Props) {
  const [cards, setCards] = useState<FoodCard[]>(FOOD_CARDS);
  const [swipedCount, setSwipedCount] = useState(0);
  const triggerRef = useRef<((dir: "left" | "right" | "up" | "down") => void) | null>(null);
  const total = FOOD_CARDS.length;

  const handleSwipe = useCallback(
    (_dir: "left" | "right" | "up" | "down") => {
      setCards((prev) => {
        const next = prev.slice(1);
        return next;
      });
      setSwipedCount((n) => {
        const next = n + 1;
        if (next >= total) {
          // Navigate to Results after a short delay so the animation completes
          setTimeout(() => {
            if (navigation) {
              navigation.navigate("Results");
            }
          }, 350);
        }
        return next;
      });
    },
    [total, navigation]
  );

  const triggerSwipe = (dir: "left" | "right" | "up" | "down") => {
    if (triggerRef.current) {
      triggerRef.current(dir);
    }
  };

  const progress = total > 0 ? swipedCount / total : 0;
  const hasCards = cards.length > 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        {/* ── Ambient glow blobs ── */}
        <View style={styles.glowTL} pointerEvents="none" />
        <View style={styles.glowBR} pointerEvents="none" />

        {/* ── Progress row ── */}
        <View style={styles.progressRow}>
          <ProgressBar progress={progress} />
          <Text style={styles.progressLabel}>{swipedCount}/{total}</Text>
        </View>

        {/* ── Card stack ── */}
        <View style={styles.cardStack}>
          {!hasCards ? (
            // Empty state — navigation fires automatically, this is just a fallback visual
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>✅</Text>
              <Text style={styles.emptyTitle}>All done!</Text>
              <Text style={styles.emptySubtitle}>Building your taste profile…</Text>
            </View>
          ) : (
            cards
              .slice(0, 3)
              .map((card, idx) => (
                <SwipeCard
                  key={card.id}
                  card={card}
                  isTop={idx === 0}
                  stackIndex={idx}
                  onSwipe={handleSwipe}
                  triggerRef={idx === 0 ? triggerRef : { current: null }}
                />
              ))
              .reverse() // render bottom cards first so top card is on top
          )}
        </View>

        {/* ── Action buttons ── */}
        {hasCards && (
          <View style={styles.actionRow}>
            <ActionBtn
              icon="close"
              iconColor={C.red}
              bgColor={C.redBg}
              glowColor={C.redGlow}
              label="Swipe Left"
              iconSize={26}
              onPress={() => triggerSwipe("left")}
            />
            <ActionBtn
              icon="help"
              iconColor={C.gray}
              bgColor={C.grayBg}
              glowColor={C.grayGlow}
              label="Not Sure"
              iconSize={22}
              onPress={() => triggerSwipe("down")}
            />
            <ActionBtn
              icon="star"
              iconColor={C.purple}
              bgColor={C.purpleBg}
              glowColor={C.purpleGlow}
              label="Super Like"
              iconSize={22}
              onPress={() => triggerSwipe("up")}
            />
            <ActionBtn
              icon="heart"
              iconColor={C.green}
              bgColor={C.greenBg}
              glowColor={C.greenGlow}
              label="Swipe Right"
              iconSize={22}
              onPress={() => triggerSwipe("right")}
            />
          </View>
        )}

        {/* ── Bottom Nav ── */}
        <BottomNav activeTab="Start" />
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: C.bg,
  },
  container: {
    flex: 1,
    backgroundColor: C.bg,
    overflow: "hidden",
  },

  // ── Ambient glows
  glowTL: {
    position: "absolute",
    top: -100,
    left: -80,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(74,222,128,0.07)",
  },
  glowBR: {
    position: "absolute",
    bottom: 60,
    right: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(74,222,128,0.05)",
  },

  // ── Progress
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "android" ? 18 : 12,
    paddingBottom: 16,
  },
  progressTrack: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: C.progressBg,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
    backgroundColor: C.green,
    shadowColor: C.green,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: C.textSecondary,
    minWidth: 36,
    textAlign: "right",
  },

  // ── Card stack container
  cardStack: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  // ── Glass card
  card: {
    position: "absolute",
    width: CARD_W,
    height: CARD_H,
    borderRadius: 28,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: C.cardBorder,
    shadowColor: C.cardShadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.50,
    shadowRadius: 24,
    elevation: 14,
  },
  cardTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: C.cardBg,
    borderRadius: 28,
  },

  // ── Card content
  cardContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    gap: 20,
  },
  cardEmoji: {
    fontSize: 80,
    lineHeight: 96,
    textAlign: "center",
  },
  cardQuestion: {
    fontSize: 22,
    fontWeight: "600",
    color: C.textPrimary,
    textAlign: "center",
    letterSpacing: -0.3,
    lineHeight: 30,
  },

  // ── Overlay badges
  overlayBadge: {
    position: "absolute",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 2.5,
    zIndex: 20,
  },
  overlayBadgeText: {
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 2.5,
    textTransform: "uppercase",
  },

  // ── Action buttons
  actionRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 96 : 84,
  },
  actionBtnWrapper: {
    alignItems: "center",
    gap: 7,
  },
  actionBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.09)",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.65,
    shadowRadius: 14,
    elevation: 8,
  },
  actionLabel: {
    fontSize: 10,
    fontWeight: "500",
    color: C.textSecondary,
    letterSpacing: 0.3,
    textAlign: "center",
  },

  // ── Empty state
  emptyState: {
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 40,
  },
  emptyEmoji: {
    fontSize: 56,
    lineHeight: 68,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: C.textPrimary,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    color: C.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
});