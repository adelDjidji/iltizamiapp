import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import * as Updates from "expo-updates";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Top-level error boundary. Catches any render/runtime error thrown in the
 * React tree and shows a recoverable fallback instead of letting the whole
 * app crash to a white screen / native crash for the user.
 */
export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: unknown) {
    // Keep a console trace for dev; in production this is where a crash
    // reporter (e.g. Sentry) would be notified.
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.error("Uncaught error caught by ErrorBoundary:", error, info);
    }
  }

  handleReload = async () => {
    try {
      await Updates.reloadAsync();
    } catch {
      // Updates.reloadAsync is unavailable in Expo Go / dev; just reset state.
      this.setState({ hasError: false });
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.emoji}>🕌</Text>
          <Text style={styles.title}>حدث خطأ غير متوقع</Text>
          <Text style={styles.subtitle}>Something went wrong</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={this.handleReload}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>إعادة التشغيل / Restart</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#02101b",
    padding: 24,
  },
  emoji: {
    fontSize: 56,
    marginBottom: 16,
  },
  title: {
    color: "#ffffff",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    color: "#9aa5b1",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 28,
  },
  button: {
    backgroundColor: "#e5c651",
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 12,
  },
  buttonText: {
    color: "#02101b",
    fontSize: 15,
    fontWeight: "700",
  },
});
