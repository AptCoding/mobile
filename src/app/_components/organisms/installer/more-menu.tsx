import { View } from "react-native";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import { useClerk, useUser } from "@clerk/clerk-expo";

import type { StackedMenuLink } from "~/app/_components/molecules/stacked-menu";
import {
  Bell,
  BullsEye,
  LifeBuoy,
  QuestionIcon,
  Socket,
} from "~/app/_components/atoms/assets/icons";
import { ThemedText } from "~/app/_components/atoms/themed";
import StackedMenu from "~/app/_components/molecules/stacked-menu";
import { api } from "~/utils/api";

export default function MoreMenu() {
  const user = useUser();
  const { signOut } = useClerk();
  const { data } = api.mobile.user.query.isApproved.useQuery();

  async function handleSignOut() {
    await signOut();
    router.dismissAll();
  }

  const disableUserLinks = !data;

  const links: StackedMenuLink[] = [
    {
      icon: <Bell size={24} color={"#ffffff"} />,
      text: "Notifications",
      chevron: true,
      onPress: () => {
        void Linking.openURL("https://connect.rolec.app/jobs");
      },
      disabled: disableUserLinks,
    },
    {
      icon: <BullsEye size={24} color={"#ffffff"} />,
      text: "LeadConnect",
      chevron: true,
      onPress: () => {
        void Linking.openURL("https://connect.rolec.app/jobs");
      },
      disabled: disableUserLinks,
    },
    {
      icon: <LifeBuoy size={24} color={"#ffffff"} />,
      text: "SupportConnect",
      chevron: true,
      onPress: () => {
        void Linking.openURL("https://connect.rolec.app/support");
      },
      disabled: disableUserLinks,
    },
    {
      icon: <QuestionIcon size={24} color={"#ffffff"} />,
      text: "Help",
      chevron: true,
      onPress: () => {
        void Linking.openURL("https://connect.rolec.app/knowledge-base");
      },
      disabled: disableUserLinks,
    },
    {
      text: "Sign Out",
      chevron: false,
      onPress: () => {
        void handleSignOut();
      },
    },
  ];

  return (
    <View className="h-full w-full">
      <View className="w-full flex-col items-center justify-center py-20">
        <Socket
          size={160}
          color="#74AF28"
          style={{ maxHeight: 160, maxWidth: 160 }}
        />
        <ThemedText className="mt-4 text-xl text-ev-500">Installer</ThemedText>
        {user.user && (
          <ThemedText className="mt-4 text-sm">
            {user.user.emailAddresses[0]?.emailAddress}
          </ThemedText>
        )}
      </View>
      <View className="flex-1"></View>
      <View>
        <StackedMenu links={links} />
        <ThemedText className="text-sm opacity-50">
          App Version 0.0.1
        </ThemedText>
      </View>
    </View>
  );
}
