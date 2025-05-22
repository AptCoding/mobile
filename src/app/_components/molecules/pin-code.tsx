import React, { useEffect, useRef, useState } from "react";
import { Keyboard, Pressable, StyleSheet, TextInput, View } from "react-native";
import { useColorScheme } from "nativewind";

import colors from "~/app/_styles/colors";
import { ThemedText } from "../atoms/themed";

interface PinCodeProps {
  onPinChange?: (pin: string) => void;
  length?: number;
  isAlphanumeric?: boolean;
  initialPin?: string | undefined;
}

export default function PinCode({
  onPinChange,
  length = 4,
  isAlphanumeric = false,
  initialPin,
}: PinCodeProps) {
  const { colorScheme } = useColorScheme();
  const [pin, setPin] = useState<string>(initialPin ?? "");
  const hiddenInputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (onPinChange) {
      onPinChange(pin);
    }
  }, [pin, onPinChange]);

  const handlePinChange = (value: string) => {
    if (
      isAlphanumeric
        ? /^[a-zA-Z0-9]+$/.test(value) || value === ""
        : /^[0-9]+$/.test(value) || value === ""
    ) {
      if (value.length <= length) {
        setPin(value);
      }
    }
  };

  const handleBackspace = () => {
    setPin((prevPin) => prevPin.slice(0, -1));
  };

  const getPinDigitStyle = (index: number) => {
    const isActive = index === pin.length;
    return isActive
      ? { ...styles.pin, ...styles.activePinStyle }
      : { ...styles.pin };
  };

  const focusHiddenInput = () => {
    if (!Keyboard.isVisible()) Keyboard.dismiss();

    hiddenInputRef.current?.focus();
  };

  const getDisplayDigit = (index: number) => {
    if (index >= pin.length) {
      return "";
    }
    return isAlphanumeric ? pin[index] : "*";
  };

  const handleKeyPress = (event: { nativeEvent: { key: string } }) => {
    if (event.nativeEvent.key === "Backspace") {
      handleBackspace();
    }
  };

  return (
    <View style={[styles.container]}>
      <TextInput
        ref={hiddenInputRef}
        style={{ position: "absolute", width: 0, height: 0 }}
        keyboardType={isAlphanumeric ? "default" : "numeric"}
        maxLength={length}
        value={pin}
        onChangeText={handlePinChange}
        onKeyPress={handleKeyPress}
        autoFocus
      />
      {Array.from({ length }).map((_, index) => (
        <Pressable
          key={index}
          style={[
            getPinDigitStyle(index),
            { borderColor: colors[colorScheme ?? "light"].mainBorder },
          ]}
          onPress={focusHiddenInput}
        >
          <ThemedText style={styles.digit}>{getDisplayDigit(index)}</ThemedText>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 10,
    paddingTop: 10,
  },
  pin: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    width: 56,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
  },
  activePinStyle: {
    boxShadow: "inset 0 0 2px #ffffff",
  },
  digit: {
    fontSize: 24,
  },
});
