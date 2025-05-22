import type { ReactNode } from "react";
import React from "react";
import { Pressable, View } from "react-native";
import { useColorScheme } from "nativewind";

import colors from "~/app/_styles/colors";
import { ChevronRight } from "../atoms/assets/icons";
import { ThemedText } from "../atoms/themed";

export interface StackedMenuLink {
  text: string;
  icon?: ReactNode;
  onPress: () => void;
  chevron: boolean;
  notifications?: number;
  disabled?: boolean;
}

interface StackedMenuLinkProps {
  links: StackedMenuLink[];
}

function Link({
  link,
  seperator,
}: {
  link: StackedMenuLink;
  seperator: boolean;
}) {
  const { colorScheme } = useColorScheme();
  const notificationsStr: string = link.notifications
    ? link.notifications.toString()
    : "";
  return (
    <View>
      <Pressable
        onPress={link.onPress}
        style={{ opacity: link.disabled ? 0.5 : 1 }}
      >
        <View className="flex flex-row items-center py-6">
          {link.icon && (
            <View className="relative mr-1 w-10">
              {link.notifications && (
                <View className="absolute -top-2 left-3 z-10 flex h-6 min-w-6 flex-row items-center justify-center rounded-full bg-red-600 p-1">
                  <ThemedText className="-mt-0.5 leading-tight">
                    {notificationsStr}
                  </ThemedText>
                </View>
              )}
              {link.icon}
            </View>
          )}
          <ThemedText className="font-montserrat_light flex-1 text-xl">
            {link.text}
          </ThemedText>
          {link.chevron && (
            <View className="-mr-5 w-10">
              <ChevronRight
                size={14}
                color={colors[colorScheme ?? "light"].text}
              />
            </View>
          )}
        </View>
      </Pressable>
      {seperator && (
        <View
          style={{
            height: 0.5,
            backgroundColor: colors[colorScheme ?? "light"].disabled,
          }}
        />
      )}
    </View>
  );
}

export default function StackedMenu({ links }: StackedMenuLinkProps) {
  return (
    <View className="w-full overflow-hidden">
      {links.map((link, index) => (
        <Link key={index} link={link} seperator={index < links.length - 1} />
      ))}
    </View>
  );
}
