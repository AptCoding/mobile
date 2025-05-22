import { useEffect, useRef } from "react";
import { Animated, Easing, View } from "react-native";

interface ProgressBarProps {
  progress: number;
}

export default function ProgressBar({ progress }: ProgressBarProps) {
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: progress,
      duration: 500,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, [progress, animatedWidth]);

  const widthInterpolate = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <View className="h-2 w-full overflow-hidden rounded-full bg-gray-300">
      <Animated.View
        className="h-full rounded-full bg-ev-500"
        style={{ width: widthInterpolate }}
      />
    </View>
  );
}
