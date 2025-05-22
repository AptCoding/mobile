import type { ReactElement, ReactNode } from "react";
import type { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { cloneElement, useRef, useState } from "react";
import {
  Dimensions,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useColorScheme } from "nativewind";

import colors from "~/app/_styles/colors";
import { ArrowRight } from "../atoms/assets/icons";
import BigButton from "../atoms/big-button";

export interface ScrollableIconTab {
  id: number;
  title: string;
  icon: ReactElement;
  content: ReactNode;
}

interface ScrollIconTabsProps {
  tabs: ScrollableIconTab[];
  showNext?: boolean;
  onFinish?: () => void;
}

export default function ScrollableIconTabs({
  tabs,
  showNext,
  onFinish,
}: ScrollIconTabsProps) {
  const { colorScheme } = useColorScheme();
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

  const handleTabNext = () => {
    const index = tabs.findIndex((tab) => tab.id === activeTab);
    if (index < tabs.length - 1) {
      //setActiveTab(tabs[index + 1]?.id);
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({
          x: (index + 1) * (screenWidth - 28),
          animated: true,
        });
      }
    }

    if (index == tabs.length - 1 && typeof onFinish === "function") {
      onFinish();
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
    <View style={styles.container}>
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
            <ScrollView>{tab.content}</ScrollView>
          </SafeAreaView>
        ))}
      </ScrollView>
      <View style={styles.tabBar}>
        {tabs.map((tab) => (
          <Pressable
            key={tab.id}
            style={[styles.tabItem]}
            onPress={() => handleTabPress(tab.id)}
          >
            {cloneElement(tab.icon, {
              color:
                activeTab !== undefined && activeTab === tab.id
                  ? colors[colorScheme ?? "light"].green
                  : colors[colorScheme ?? "light"].text,
            })}
          </Pressable>
        ))}
      </View>
      {showNext && (
        <BigButton
          onPress={handleTabNext}
          label="Next"
          icon={<ArrowRight size={16} color={"white"} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "transparent",
    gap: 20,
    marginBottom: 10,
  },
  tabItem: {
    flexGrow: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  tabText: {
    color: "#333",
  },
  activeTabText: {
    color: "#74af28",
    fontWeight: "bold",
  },
  tabContent: {
    flex: 1,
    alignItems: "center",
    padding: 0,
    margin: 0,
    paddingBottom: 15,
  },
});
