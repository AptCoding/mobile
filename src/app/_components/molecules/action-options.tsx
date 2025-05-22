import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export interface ActionSheetOptionProps {
  options: string[];
  onOptionPress: (option: string) => void;
}

export default function ActionSheet({
  options,
  onOptionPress,
}: ActionSheetOptionProps) {
  return (
    <View style={styles.optionsWrapper}>
      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => {
            onOptionPress(option);
          }}
          style={styles.option}
        >
          <Text style={styles.optionText}>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  optionsWrapper: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  option: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  optionText: {
    fontSize: 16,
    textAlign: "center",
  },
});
