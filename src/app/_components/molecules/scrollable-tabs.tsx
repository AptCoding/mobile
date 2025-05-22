import type { ReactNode } from "react";
import type { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { useRef, useState } from "react";
import {
  Dimensions,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import { ThemedText } from "../atoms/themed";

export interface ScrollableTab {
  id: number;
  title: string;
  content: ReactNode;
}

interface ScrollTabsProps {
  tabs: ScrollableTab[];
}

export default function ScrollableTabs({ tabs }: ScrollTabsProps) {
  const [activeTab, setActiveTab] = useState<number | undefined>(
    tabs[0]?.id ?? 0,
  );
  const scrollViewRef = useRef<ScrollView>(null);
  const { width: screenWidth } = Dimensions.get("window");

  const handleTabPress = (tabId: number) => {
    //setActiveTab(tabId);
    const index = tabs.findIndex((tab) => tab.id === tabId);
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: index * (screenWidth - 28),
        animated: true,
      });
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offset = event.nativeEvent.contentOffset.x;
    const index = Math.round(offset / screenWidth);
    if (tabs[index]?.id !== activeTab) {
      setActiveTab(tabs[index]?.id);
    }
  };

  return (
    <View className="flex-1">
      <View className="z-0 flex-row gap-4 bg-transparent">
        {tabs.map((tab) => (
          <Pressable
            key={tab.id}
            style={[styles.tabItem, activeTab === tab.id && styles.activeTab]}
            onPress={() => handleTabPress(tab.id)}
          >
            <ThemedText style={[activeTab === tab.id && styles.activeTabText]}>
              {tab.title}
            </ThemedText>
          </Pressable>
        ))}
      </View>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {tabs.map((tab) => (
          <SafeAreaView
            key={tab.id}
            style={[styles.tabContent, { width: screenWidth - 28 }]}
          >
            {tab.content}
          </SafeAreaView>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabItem: {
    flexGrow: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#74af28",
  },
  activeTabText: {
    color: "#74af28",
  },
  tabContent: {
    flex: 1,
    alignItems: "center",
    padding: 0,
    margin: 0,
    paddingTop: 15,
  },
});
