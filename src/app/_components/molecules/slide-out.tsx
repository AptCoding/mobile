import type { GestureResponderEvent } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Pressable,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { useColorScheme } from "nativewind";

import colors from "~/app/_styles/colors";
import { CloseCircle } from "../atoms/assets/icons";

const { width } = Dimensions.get("window");

interface SlideOutDrawerProps {
  children?: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

export default function SlideOutDrawer({
  children,
  isOpen,
  onClose,
}: SlideOutDrawerProps) {
  const { colorScheme } = useColorScheme();
  const slideAnim = useRef(new Animated.Value(width)).current;
  const [isDrawerVisible, setIsDrawerVisible] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setIsDrawerVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: width,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setIsDrawerVisible(false));
    }
  }, [isOpen, slideAnim]);

  const handlePressOutside = (event: GestureResponderEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };
  if (!isDrawerVisible) {
    return null;
  }

  return (
    <Pressable
      onPress={handlePressOutside}
      style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
      className="absolute bottom-0 left-0 top-0 z-50 h-screen w-full justify-end"
    >
      <Animated.View
        className="absolute bottom-0 right-0 top-0 -z-50 h-full flex-1"
        style={[
          {
            backgroundColor: colors[colorScheme ?? "light"].moreMenuBg,
            width: 340,
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <View className="h-full p-6 py-20">
          <View className="mt-6 w-full flex-row justify-end px-2">
            <TouchableOpacity onPress={onClose}>
              <CloseCircle size={18} color="white" />
            </TouchableOpacity>
          </View>
          <ScrollView className="flex-1">{children}</ScrollView>
        </View>
      </Animated.View>
    </Pressable>
  );
}
