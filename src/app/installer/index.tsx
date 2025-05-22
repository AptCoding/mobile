import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Application from "expo-application";
import * as Linking from "expo-linking";
import { router, Stack } from "expo-router";
import { useClerk, useUser } from "@clerk/clerk-expo";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import type { StackedMenuLink } from "../_components/molecules/stacked-menu";
import { api } from "~/utils/api";
import {
  Bell,
  BullsEye,
  Clipboard,
  LifeBuoy,
  MoreHorizontal,
  QuestionIcon,
  Socket,
  Zap,
} from "../_components/atoms/assets/icons";
import { ThemedText } from "../_components/atoms/themed";
import SlideOutDrawer from "../_components/molecules/slide-out";
import StackedMenu from "../_components/molecules/stacked-menu";
import AccountDelete from "../_components/organisms/account-delete";
import DeviceSelector from "../_components/organisms/device-selector";
import ProjectTabs from "../_components/organisms/project-tabs";

const Tab = createBottomTabNavigator();

// This will be replaced with actual content at some point
// const Home = () => {

//   return (
//     <View className="h-full w-full bg-background">
//       <ThemedText>Home</ThemedText>
//     </View>
//   );
// };

const More = () => {
  const user = useUser();
  const { signOut } = useClerk();
  const { data } = api.mobile.user.query.isApproved.useQuery();
  const [closeOpen, setCloseOpen] = useState(false);

  async function handleSignOut() {
    await signOut();
    router.dismissTo("/");
  }

  const disableUserLinks = !user.user || data === undefined || data === false;

  const links: StackedMenuLink[] = [
    {
      icon: <Bell size={24} color={"#ffffff"} />,
      text: "Notifications",
      chevron: true,
      onPress: () => {
        console.log("Notifications clicked");
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
      <View className="w-full flex-col items-center justify-center py-16">
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

        <View className="w-full">
          <ThemedText className="mb-4 text-sm opacity-50">
            App Version {Application.nativeApplicationVersion}
          </ThemedText>
          <Pressable onPress={() => setCloseOpen(true)}>
            <ThemedText className="opacity-50">Close My Account</ThemedText>
          </Pressable>
        </View>
      </View>

      <AccountDelete visible={closeOpen} onCancel={() => setCloseOpen(false)} />
    </View>
  );
};

export default function InstallerIndex() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <SafeAreaView className="bg-background">
      <SlideOutDrawer isOpen={isOpen} onClose={toggleDrawer}>
        <More />
      </SlideOutDrawer>

      <View className="items h-full w-full flex-col bg-background p-4">
        <Stack.Screen
          name="installerIndex"
          options={{
            headerShown: false,
          }}
        />

        <Tab.Navigator
          screenOptions={{
            tabBarStyle: styles.tabBar,
            tabBarLabelStyle: styles.tabBarLabel,
            tabBarIconStyle: styles.tabBarIcon,
            tabBarActiveTintColor: "#74AF28",
            headerShown: false,
          }}
        >
          {/* <Tab.Screen
            name="Home"
            component={Home}
            options={{
              tabBarIcon: ({ color, size }) => (
                <HomeIcon size={size} color={color} />
              ),
            }}
          /> */}
          <Tab.Screen
            name="Add"
            component={DeviceSelector}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Zap size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Projects"
            component={ProjectTabs}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Clipboard size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="More"
            component={() => <View></View>}
            listeners={() => ({
              tabPress: (e) => {
                e.preventDefault();
                setIsOpen(true);
              },
            })}
            options={{
              tabBarIcon: ({ color, size }) => (
                <MoreHorizontal size={size} color={color} />
              ),
            }}
          />
        </Tab.Navigator>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  logo: {
    height: "17%",
    transform: [{ scale: 0.7 }],
  },
  tabBar: {
    height: 80,
    paddingBottom: 10,
    paddingTop: 10,
    backgroundColor: "#000000",
    borderTopWidth: 0,
  },
  tabBarLabel: {
    fontSize: 10,
    marginTop: 5,
    color: "#d1d1d1",
  },
  tabBarIcon: {
    fontSize: 20,
    color: "#d1d1d1",
  },
});
