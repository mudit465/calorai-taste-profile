import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import BottomNav from "../components/BottomNav";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
  bg: "#0C0C0E",
  cardBg: "rgba(255,255,255,0.052)",
  cardBorder: "rgba(255,255,255,0.088)",
  cardShadow: "#000000",
  green: "#4ADE80",
  greenBg: "rgba(74,222,128,0.15)",
  blue: "#60A5FA",
  blueBg: "rgba(96,165,250,0.18)",
  white: "#FFFFFF",
  textPrimary: "#EFEFEF",
  textSecondary: "rgba(255,255,255,0.50)",
  textMuted: "rgba(255,255,255,0.28)",
  separator: "rgba(255,255,255,0.075)",
  vertSeparator: "rgba(255,255,255,0.10)",
  dotActive: "#FFFFFF",
  dotInactive: "rgba(255,255,255,0.22)",
  accent: "rgba(74,222,128,0.06)",   // very faint green wash on bg
};

// ─── Data ─────────────────────────────────────────────────────────────────────
interface HighlightItem { emoji: string; label: string }
const KEY_HIGHLIGHTS: HighlightItem[] = [
  { emoji: "🥩", label: "Carnivore" },
  { emoji: "🇮🇹", label: "Italian Food" },
  { emoji: "🍇", label: "Fruit-Lover" },
];

interface GoalItem { label: string }
const LIFESTYLE_GOALS: GoalItem[] = [
  { label: "Active" },
  { label: "Gym-Goer" },
  { label: "Walks a lot" },
  { label: "PCOS & GI Diet" },
];

interface FoodItem { emoji: string; label: string }
const FOODS_YOU_LOVE: FoodItem[] = [
  { emoji: "🥬", label: "Spinach" },
  { emoji: "🥦", label: "Kale" },
  { emoji: "🥑", label: "Avocado" },
  { emoji: "🌿", label: "Quinoa" },
  { emoji: "🍓", label: "Strawberries" },
  { emoji: "🫐", label: "Blueberries" },
];

// ─── Shared primitives ────────────────────────────────────────────────────────

/** Frosted glass card */
function GlassCard({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: object;
}) {
  return (
    <View style={[styles.card, style]}>
      {/* blur layer */}
      <BlurView intensity={22} tint="dark" style={StyleSheet.absoluteFill} />
      {/* tint overlay */}
      <View style={styles.cardTint} pointerEvents="none" />
      {children}
    </View>
  );
}

/** Card section header: emoji badge + title + subtitle */
function CardHeader({
  emoji,
  title,
  subtitle,
}: {
  emoji: string;
  title: string;
  subtitle: string;
}) {
  return (
    <View style={styles.cardHeader}>
      <View style={styles.cardHeaderEmojiBadge}>
        <Text style={styles.cardHeaderEmoji}>{emoji}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardSubtitle} numberOfLines={1}>{subtitle}</Text>
      </View>
    </View>
  );
}

/** Full-width horizontal rule */
function HRule() {
  return <View style={styles.hRule} />;
}

/** Vertical separator used inside the highlights row */
function VRule() {
  return <View style={styles.vRule} />;
}

// ─── Key Highlights row ───────────────────────────────────────────────────────

function HighlightItem({ emoji, label }: HighlightItem) {
  return (
    <View style={styles.highlightItem}>
      <Text style={styles.highlightEmoji}>{emoji}</Text>
      <Text style={styles.highlightLabel}>{label}</Text>
    </View>
  );
}

function KeyHighlightsCard() {
  // Static dot — all three visible, first dot "active" to match Figma
  return (
    <GlassCard style={styles.highlightCard}>
      {/* Single row of all highlights */}
      <View style={styles.highlightRow}>
        {KEY_HIGHLIGHTS.map((item, i) => (
          <React.Fragment key={item.label}>
            <HighlightItem {...item} />
            {i < KEY_HIGHLIGHTS.length - 1 && <VRule />}
          </React.Fragment>
        ))}
      </View>

      {/* Pagination dots — kept as per Figma */}
      <View style={styles.dotRow}>
        {[0, 1].map((i) => (
          <View
            key={i}
            style={[styles.dot, i === 0 ? styles.dotFilled : styles.dotEmpty]}
          />
        ))}
      </View>
    </GlassCard>
  );
}

// ─── Lifestyle & Goals card ───────────────────────────────────────────────────

function GoalRow({ label }: { label: string }) {
  return (
    <View style={styles.listRow}>
      <View style={styles.checkBadge}>
        <Ionicons name="checkmark" size={12} color={C.green} />
      </View>
      <Text style={styles.listRowLabel}>{label}</Text>
    </View>
  );
}

function LifestyleCard() {
  return (
    <GlassCard>
      <CardHeader
        emoji="⚡"
        title="Lifestyle & Goals"
        subtitle="We'll use this to tailor our advice & meal plan"
      />
      <HRule />
      {LIFESTYLE_GOALS.map((g, i) => (
        <React.Fragment key={g.label}>
          <GoalRow label={g.label} />
          {i < LIFESTYLE_GOALS.length - 1 && <HRule />}
        </React.Fragment>
      ))}
    </GlassCard>
  );
}

// ─── Foods You Love card ──────────────────────────────────────────────────────

function FoodRow({ emoji, label }: FoodItem) {
  return (
    <View style={styles.listRow}>
      <View style={styles.blueDot} />
      <Text style={styles.foodEmoji}>{emoji}</Text>
      <Text style={styles.listRowLabel}>{label}</Text>
    </View>
  );
}

function FoodsCard() {
  return (
    <GlassCard>
      <CardHeader
        emoji="❤️"
        title="Foods You Love"
        subtitle="We'll Recommend These"
      />
      <HRule />
      {FOODS_YOU_LOVE.map((f, i) => (
        <React.Fragment key={f.label}>
          <FoodRow {...f} />
          {i < FOODS_YOU_LOVE.length - 1 && <HRule />}
        </React.Fragment>
      ))}
    </GlassCard>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ResultsScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.root}>

        {/* Ambient green glow top-right */}
        <View style={styles.glowBlob} pointerEvents="none" />

        {/* ── Top bar ── */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backBtn} activeOpacity={0.65}>
            <Ionicons name="chevron-back" size={19} color={C.white} />
          </TouchableOpacity>
        </View>

        {/* ── Page heading (outside scroll → stays fixed) ── */}
        <View style={styles.pageHeading}>
          <Text style={styles.pageTitle}>Your Taste Profile</Text>
          <Text style={styles.pageSubtitle}>
            Tailored to your unique needs. We'll use this for recommendations and meal plans
          </Text>
          <Text style={styles.sectionEyebrow}>Key Highlights:</Text>
        </View>

        {/* ── Cards scroll ── */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          overScrollMode="never"
        >
          <KeyHighlightsCard />
          <LifestyleCard />
          <FoodsCard />
          {/* spacer so last card clears BottomNav */}
          <View style={{ height: 116 }} />
        </ScrollView>

        <BottomNav activeTab="TasteProfile" />
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({

  // ── Root
  safeArea: {
    flex: 1,
    backgroundColor: C.bg,
  },
  root: {
    flex: 1,
    backgroundColor: C.bg,
  },
  glowBlob: {
    position: "absolute",
    top: -120,
    right: -100,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: "rgba(74,222,128,0.07)",
  },

  // ── Top bar
  topBar: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 18 : 10,
    paddingBottom: 6,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },

  // ── Page heading
  pageHeading: {
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: 20,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: C.textPrimary,
    letterSpacing: -0.6,
    marginBottom: 8,
  },
  pageSubtitle: {
    fontSize: 13.5,
    lineHeight: 20,
    color: C.textSecondary,
    marginBottom: 20,
  },
  sectionEyebrow: {
    fontSize: 12,
    fontWeight: "600",
    color: C.textMuted,
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },

  // ── Scroll
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 12,
  },

  // ── Glass card
  card: {
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: C.cardBorder,
    paddingHorizontal: 18,
    paddingVertical: 18,
    // Shadow for depth
    shadowColor: C.cardShadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.40,
    shadowRadius: 18,
    elevation: 10,
  },
  cardTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: C.cardBg,
    borderRadius: 20,
  },

  // ── Card header
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    marginBottom: 14,
  },
  cardHeaderEmojiBadge: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.07)",
    alignItems: "center",
    justifyContent: "center",
  },
  cardHeaderEmoji: {
    fontSize: 18,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: C.textPrimary,
    letterSpacing: -0.2,
  },
  cardSubtitle: {
    fontSize: 12,
    color: C.textSecondary,
    marginTop: 2,
  },

  // ── Rules
  hRule: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: C.separator,
    marginVertical: 11,
  },
  vRule: {
    width: StyleSheet.hairlineWidth,
    height: 52,
    backgroundColor: C.vertSeparator,
    alignSelf: "center",
  },

  // ── Key Highlights
  highlightCard: {
    paddingHorizontal: 0,   // we control padding per-section
    paddingVertical: 0,
  },
  highlightRow: {
    flexDirection: "row",
    alignItems: "stretch",
    paddingTop: 22,
    paddingBottom: 18,
    paddingHorizontal: 4,
  },
  highlightItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 4,
  },
  highlightEmoji: {
    fontSize: 34,
    lineHeight: 40,
  },
  highlightLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: C.textPrimary,
    textAlign: "center",
    letterSpacing: 0.1,
  },

  // ── Dot indicators
  dotRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    paddingBottom: 14,
  },
  dot: {
    height: 5,
    borderRadius: 3,
  },
  dotFilled: {
    width: 18,
    backgroundColor: C.dotActive,
  },
  dotEmpty: {
    width: 5,
    backgroundColor: C.dotInactive,
  },

  // ── Shared list row
  listRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    paddingVertical: 3,
    minHeight: 36,
  },
  listRowLabel: {
    fontSize: 14.5,
    fontWeight: "500",
    color: C.textPrimary,
    flex: 1,
  },

  // ── Check badge (Goals)
  checkBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: C.greenBg,
    alignItems: "center",
    justifyContent: "center",
  },

  // ── Blue dot (Foods)
  blueDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: C.blue,
    shadowColor: C.blue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
  },
  foodEmoji: {
    fontSize: 17,
    width: 24,
    textAlign: "center",
  },
});