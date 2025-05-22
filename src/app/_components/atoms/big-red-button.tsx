import type { PressableProps } from "react-native";
import { ActivityIndicator, Pressable } from "react-native";

import { ThemedText } from "./themed";

interface BigButtonProps extends PressableProps {
  label: string;
  icon?: React.ReactNode;
  variant?: "filled" | "outline";
  isLoading?: boolean;
}

export default function BigRedButton({
  label,
  icon,
  variant,
  isLoading,
  ...props
}: BigButtonProps) {
  if (variant == "outline")
    return (
      <Pressable
        className="mb-2 flex-row items-center justify-center gap-3 rounded-xl border-2 border-red-500 p-4"
        {...props}
      >
        <ThemedText className="text-center text-xl">{label}</ThemedText>
        {icon}
      </Pressable>
    );

  return (
    <Pressable
      className="mb-2 flex-row items-center justify-center gap-3 rounded-xl bg-red-500 p-4"
      {...props}
    >
      <ThemedText className="text-center text-xl">{label}</ThemedText>
      {!isLoading && icon}
      {isLoading && <ActivityIndicator size={16} color={"white"} />}
    </Pressable>
  );
}
