import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";

import { CloseCircle } from "../atoms/assets/icons";
import { ThemedText } from "../atoms/themed";

export interface ActionSheetProps {
  isVisible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const ANIMATION_DURATION = 200;
const BACKDROP_OPACITY = 0.4;

export default function ActionSheet({
  children,
  isVisible,
  onClose,
  title,
}: ActionSheetProps) {
  const [showContent, setShowContent] = useState(isVisible);
  const containerHeight = useRef(new Animated.Value(0)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      setShowContent(true);
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: BACKDROP_OPACITY,
          duration: ANIMATION_DURATION,
          useNativeDriver: false,
        }),
        Animated.timing(containerHeight, {
          toValue: SCREEN_HEIGHT,
          duration: ANIMATION_DURATION,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: ANIMATION_DURATION,
          useNativeDriver: false,
        }),
        Animated.timing(containerHeight, {
          toValue: 0,
          duration: ANIMATION_DURATION,
          useNativeDriver: false,
        }),
      ]).start(() => {
        setShowContent(false);
      });
    }
  }, [isVisible, containerHeight, backdropOpacity]);

  const handleBackdropPress = () => {
    onClose();
  };

  if (!showContent) {
    return null;
  }

  return (
    <Animated.View
      className="absolute bottom-0 left-0 right-0 z-50 overflow-hidden"
      style={{
        height: containerHeight,
      }}
    >
      <Animated.View
        style={{ opacity: backdropOpacity }}
        className="absolute bottom-0 left-0 right-0 top-0 bg-black"
      >
        <TouchableOpacity
          className="absolute bottom-0 left-0 right-0 top-0 bg-black"
          onPress={handleBackdropPress}
          activeOpacity={1}
        />
      </Animated.View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="absolute bottom-0 left-0 w-full overflow-hidden"
      >
        <View className="max-h-96 rounded-2xl rounded-b-none bg-white p-5 dark:bg-neutral-800">
          {title && (
            <ThemedText className="font-montserrat_bold mb-4 text-lg">
              {title}
            </ThemedText>
          )}
          <ScrollView className="max-h-96">{children}</ScrollView>
          <Pressable className="absolute right-3 top-3 p-2" onPress={onClose}>
            <CloseCircle size={18} color="#ffffff" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Animated.View>
  );
}
