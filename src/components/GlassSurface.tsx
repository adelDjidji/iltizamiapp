import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  View,
  Image,
  StyleSheet,
  Platform,
  Pressable,
  Animated,
  StyleProp,
  ViewStyle,
  ImageSourcePropType,
} from "react-native";
import { BlurView, BlurTint } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../hooks/useTheme";

export function glassTokens(isDark: boolean) {
  return {
    intensity: isDark ? 20 : 70,
    tint: (isDark
      ? "systemUltraThinMaterialDark"
      : "systemUltraThinMaterialLight") as BlurTint,
    // flat fill kept for consumers that paint their own glass
    fill: isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.22)",
    fillGradient: (isDark
      ? ["rgba(255,255,255,0.04)", "rgba(255,255,255,0.0)"]
      : ["rgba(255,255,255,0.34)", "rgba(255,255,255,0.10)"]) as [
      string,
      string,
    ],
    sheen: isDark ? "rgba(255,255,255,0)" : "rgba(255,255,255,0.26)",
    border: isDark ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.78)",
    borderDim: isDark ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.45)",
    highlight: isDark ? "rgba(255,255,255,0.34)" : "rgba(255,255,255,0.95)",
    shadow: isDark ? "#000000" : "#0f172a",
  };
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// ── Backdrop sampling (real blur on Android without blurring content) ──
// Android's only true-blur option for BlurView snapshots the screen and
// captures the card's own children, ghosting text. Instead, GlassBackdrop
// exposes the wallpaper to each GlassSurface, which renders its own
// blurred copy (Image blurRadius) offset to line up with the background.
// Content sits above in a normal layer and stays crisp.

type GlassBackdropInfo = {
  source: ImageSourcePropType;
  width: number;
  height: number;
  bgRef: React.RefObject<View | null>;
};

const GlassBackdropContext = React.createContext<GlassBackdropInfo | null>(
  null,
);

export function GlassBackdrop({
  source,
  style,
  children,
}: {
  source: ImageSourcePropType;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}) {
  const bgRef = useRef<View>(null);
  const [dims, setDims] = useState({ width: 0, height: 0 });

  const value = useMemo(
    () => (dims.width > 0 ? { source, ...dims, bgRef } : null),
    [source, dims],
  );

  return (
    <View
      ref={bgRef}
      style={style}
      onLayout={(e) =>
        setDims({
          width: e.nativeEvent.layout.width,
          height: e.nativeEvent.layout.height,
        })
      }
    >
      <Image
        source={source}
        resizeMode="cover"
        style={StyleSheet.absoluteFill}
      />
      <GlassBackdropContext.Provider value={value}>
        {children}
      </GlassBackdropContext.Provider>
    </View>
  );
}

function useBackdropSample(rootRef: React.RefObject<View | null>) {
  const backdrop = useContext(GlassBackdropContext);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  const measure = useCallback(() => {
    const bgNode = backdrop?.bgRef.current;
    if (!bgNode || !rootRef.current) return;
    rootRef.current.measureLayout(
      bgNode,
      (x, y) => setPos({ x, y }),
      () => setPos(null),
    );
  }, [backdrop, rootRef]);

  useEffect(() => {
    measure();
  }, [measure, backdrop?.width, backdrop?.height]);

  if (Platform.OS !== "android" || !backdrop || !pos) {
    return { sample: null, onLayout: measure };
  }
  return {
    onLayout: measure,
    sample: (
      <Image
        source={backdrop.source}
        resizeMode="cover"
        blurRadius={22}
        style={{
          position: "absolute",
          top: -pos.y,
          left: -pos.x,
          width: backdrop.width,
          height: backdrop.height,
        }}
      />
    ),
  };
}

const usePressScale = (pressedScale: number) => {
  const scale = useRef(new Animated.Value(1)).current;
  const animateTo = (toValue: number) =>
    Animated.spring(scale, {
      toValue,
      useNativeDriver: true,
      speed: 40,
      bounciness: 0,
    }).start();
  return {
    scale,
    onPressIn: () => animateTo(pressedScale),
    onPressOut: () => animateTo(1),
  };
};

type GlassSurfaceProps = {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  accentColor?: string;
  accentPosition?: "top" | "left" | "right";
  intensity?: number;
  borderRadius?: number;
  fillOverride?: string;
};

export function GlassSurface({
  children,
  style,
  accentColor,
  accentPosition = "top",
  intensity,
  borderRadius = 24,
  fillOverride,
}: GlassSurfaceProps) {
  const theme = useTheme();
  const isDark = theme.mode === "dark";
  const glass = glassTokens(isDark);
  const rootRef = useRef<View>(null);
  const { sample, onLayout } = useBackdropSample(rootRef);

  return (
    <View
      ref={rootRef}
      onLayout={onLayout}
      style={[styles.root, { borderRadius }, style]}
    >
      {sample ?? (
        <BlurView
          intensity={intensity ?? glass.intensity}
          tint={glass.tint}
          style={StyleSheet.absoluteFill}
        />
      )}
      {fillOverride ? (
        <View
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, { backgroundColor: fillOverride }]}
        />
      ) : (
        <LinearGradient
          pointerEvents="none"
          colors={glass.fillGradient}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      )}
      <LinearGradient
        pointerEvents="none"
        colors={[glass.sheen, "rgba(255,255,255,0)"]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={styles.sheen}
      />
      <View
        pointerEvents="none"
        style={[
          styles.rim,
          {
            borderRadius,
            borderColor: glass.border,
            borderTopColor: glass.highlight,
            borderBottomColor: glass.borderDim,
          },
        ]}
      />
      {accentColor && accentPosition === "top" && (
        <View
          pointerEvents="none"
          style={[styles.accentTop, { backgroundColor: accentColor + "55" }]}
        />
      )}
      {accentColor && accentPosition === "left" && (
        <View
          pointerEvents="none"
          style={[
            styles.accentLeft,
            { left: 0, backgroundColor: accentColor + "55" },
          ]}
        />
      )}
      {accentColor && accentPosition === "right" && (
        <View
          pointerEvents="none"
          style={[
            styles.accentLeft,
            { right: 0, backgroundColor: accentColor + "55" },
          ]}
        />
      )}
      {children}
    </View>
  );
}

type GlassCardProps = GlassSurfaceProps & {
  onPress?: () => void;
};

export function GlassCard({
  children,
  style,
  accentColor,
  accentPosition,
  onPress,
  intensity,
  borderRadius = 24,
  fillOverride,
}: GlassCardProps) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.97);

  const shell = [styles.card, { borderRadius }, style];

  const surface = (
    <GlassSurface
      style={StyleSheet.absoluteFill}
      accentColor={accentColor}
      accentPosition={accentPosition}
      intensity={intensity}
      borderRadius={borderRadius}
      fillOverride={fillOverride}
    />
  );

  const body = <View style={styles.cardContent}>{children}</View>;

  if (onPress) {
    return (
      <AnimatedPressable
        style={[...shell, { transform: [{ scale }] }]}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        {surface}
        {body}
      </AnimatedPressable>
    );
  }

  return (
    <View style={shell}>
      {surface}
      {body}
    </View>
  );
}

export function GlassPill({
  children,
  style,
  intensity,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  intensity?: number;
}) {
  const theme = useTheme();
  const glass = glassTokens(theme.mode === "dark");

  return (
    <View style={[styles.pill, { borderColor: glass.border }, style]}>
      <GlassSurface intensity={intensity} borderRadius={22} />
      <View style={styles.pillContent}>{children}</View>
    </View>
  );
}

type GlassButtonProps = {
  onPress: () => void;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  active?: boolean;
  activeColor?: string;
};

export function GlassButton({
  onPress,
  children,
  style,
  active,
  activeColor,
}: GlassButtonProps) {
  const theme = useTheme();
  const isDark = theme.mode === "dark";
  const glass = glassTokens(isDark);
  const { scale, onPressIn, onPressOut } = usePressScale(0.93);
  const rootRef = useRef<View>(null);
  const { sample, onLayout } = useBackdropSample(rootRef);

  return (
    <AnimatedPressable
      ref={rootRef}
      onLayout={onLayout}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={[styles.button, style, { transform: [{ scale }] }]}
    >
      {sample ?? (
        <BlurView
          intensity={isDark ? 32 : 48}
          tint={glass.tint}
          style={StyleSheet.absoluteFill}
        />
      )}
      {active ? (
        <View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: activeColor ?? "rgba(255,255,255,0.25)" },
          ]}
        />
      ) : (
        <LinearGradient
          pointerEvents="none"
          colors={glass.fillGradient}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      )}
      <View
        pointerEvents="none"
        style={[
          styles.buttonRim,
          {
            borderColor: active
              ? (activeColor ?? glass.highlight)
              : glass.border,
            borderTopColor: glass.highlight,
          },
        ]}
      />
      <View style={styles.buttonContent}>{children}</View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  root: {
    overflow: "hidden",
    borderCurve: "continuous",
  },
  pill: {
    borderRadius: 22,
    borderCurve: "continuous",
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth * 2,
  },
  pillContent: {
    zIndex: 1,
  },
  rim: {
    ...StyleSheet.absoluteFillObject,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth * 2,
  },
  sheen: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "45%",
  },
  accentTop: {
    position: "absolute",
    top: 0,
    left: 16,
    right: 16,
    height: 1.5,
    borderRadius: 1,
  },
  accentLeft: {
    position: "absolute",
    top: 12,
    bottom: 12,
    width: 2,
    borderRadius: 1,
  },
  card: {
    overflow: "hidden",
    borderCurve: "continuous",
  },
  cardContent: {
    zIndex: 1,
  },
  button: {
    overflow: "hidden",
    borderCurve: "continuous",
  },
  buttonRim: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderRadius: 999,
  },
  buttonContent: {
    alignItems: "center",
    justifyContent: "center",
  },
});
