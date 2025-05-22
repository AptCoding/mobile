import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { Connector, ConnectorFlash } from "../atoms/assets/icons";

interface ConnectorAnimationProps {
  size: number;
  color: string;
  flashColor?: string;
}

export default function ConnectorFlashing({
  size,
  color,
  flashColor = "white",
}: ConnectorAnimationProps) {
  const opacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 700 }), -1, true);
  }, []);

  return (
    <View style={styles.container}>
      <Connector size={size} color={color} />
      <Animated.View style={[animatedStyle, styles.flashContainer]}>
        <ConnectorFlash size={size} color={flashColor} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  flashContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
});
