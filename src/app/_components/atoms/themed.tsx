import type { TextProps } from "react-native";
import { Text } from "react-native";
import { useColorScheme } from "nativewind";

interface ThemedTextProps extends TextProps {
  children: React.ReactNode | string | null;
}

export function ThemedText({ children, ...props }: ThemedTextProps) {
  const { colorScheme } = useColorScheme();

  return (
    <Text
      {...props}
      className={`${colorScheme == "dark" ? "text-white" : "text-black"} font-montserrat ${props.className}`}
    >
      {children}
    </Text>
  );
}

export default function () {
  return null;
}
