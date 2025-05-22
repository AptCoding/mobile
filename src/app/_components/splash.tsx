import { useState } from "react";
import { Modal, StyleSheet, View } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  withDelay,
  withTiming,
} from "react-native-reanimated";

import BrandIcon from "./atoms/assets/brand-icon";
import BrandLogo from "./atoms/assets/brand-logo";

interface SplashscreenProps {
  isAppInitialized: boolean;
  onPress: () => void;
}

const Splashscreen = (props: SplashscreenProps) => {
  const [hasAnimationPlayedOnce, setHasAnimationPlayedOnce] = useState(false);

  // We only want to hide the Splash Screen after it has played at least once
  // withTiming is funny with having arrow functions only
  const handleAnimationFinish = () => {
    runOnJS(setHasAnimationPlayedOnce)(true);
  };

  const isModalVisible = !(props.isAppInitialized && hasAnimationPlayedOnce);

  // The props for animating
  const logoAnimatedStyles = {
    iconScale: 80, //Initial scale of the icon
    iconX: 0, //Initial x position of the icon
    iconOpacity: 1, //Initial opacity of the icon
    logoOpacity: 0, //Initial opacity of the logo
    logoWidth: 0, //Initial width of the logo
    scale: 1, //Initial scale of the container
    height: 100, //Initial height of the container
    opacity: 1, //Initial opacity of the container
  };

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    opacity: withDelay(
      1200,
      withTiming(logoAnimatedStyles.iconOpacity, { duration: 300 }),
    ),
    transform: [
      { scale: withTiming(logoAnimatedStyles.iconScale, { duration: 600 }) },
      {
        translateX: withDelay(
          1200,
          withTiming(logoAnimatedStyles.iconX, { duration: 300 }),
        ),
      },
    ],
  }));

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: withDelay(
      1200,
      withTiming(logoAnimatedStyles.logoOpacity, { duration: 300 }),
    ),
    width: withDelay(
      1200,
      withTiming(logoAnimatedStyles.logoWidth, { duration: 300 }),
    ),
  }));

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    height: withDelay(
      2000,
      withTiming(`${logoAnimatedStyles.height}%`, { duration: 300 }),
    ),
    opacity: withDelay(
      2200,
      withTiming(logoAnimatedStyles.opacity, { duration: 100 }),
    ),
    transform: [
      {
        scale: withDelay(
          2000,
          withTiming(
            logoAnimatedStyles.scale,
            { duration: 300 },
            handleAnimationFinish,
          ),
        ),
      },
    ],
  }));

  // Fire off the animation props
  function iconAnimate() {
    logoAnimatedStyles.iconScale = 1; //Scale down the icon
    logoAnimatedStyles.iconX = -76; //Move the icon to the left
    logoAnimatedStyles.iconOpacity = 0; //Hide the icon
    logoAnimatedStyles.logoOpacity = 1; //Show the logo
    logoAnimatedStyles.logoWidth = 192; //Set the logo width
    logoAnimatedStyles.scale = 0.7; //Scale down the container
    logoAnimatedStyles.height = 20; //Set the container height
    logoAnimatedStyles.opacity = 0.8; //Set the container opacity
  }
  iconAnimate();

  return (
    <Modal visible={isModalVisible} animationType="fade" transparent>
      <View className="flex h-full w-full items-center bg-background">
        <Animated.View
          className="flex h-full w-full items-center justify-center bg-background"
          style={containerAnimatedStyle}
        >
          <View className="relative flex items-center justify-center">
            <Animated.View style={[styles.icon, iconAnimatedStyle]}>
              <BrandIcon />
            </Animated.View>
            <Animated.View style={[styles.logo, logoAnimatedStyle]}>
              <BrandLogo style={{ minHeight: 32, minWidth: 192 }} />
            </Animated.View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 40, //Width of the icon
    height: 32, //Height of the icon
    position: "absolute", //Position the icon absolutely
    zIndex: 1, //Ensure the icon is on top
  },
  logo: {
    height: 32, //Height of the logo
    overflow: "hidden", //Hide overflow of the logo
  },
});

export default Splashscreen;
