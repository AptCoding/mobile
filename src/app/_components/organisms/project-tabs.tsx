import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import type { ScrollableTab } from "../molecules/scrollable-tabs";
import { api } from "~/utils/api";
import { Plus } from "../atoms/assets/icons";
import { ThemedText } from "../atoms/themed";
import ProjectList from "../molecules/project-list";
import ScrollableTabs from "../molecules/scrollable-tabs";
import ProjectAdd from "./project-add";

export default function ProjectTabs() {
  const [showCreate, setShowCreate] = useState(false);

  return (
    <>
      <View className="h-full w-full bg-background">
        <View className="w-full flex-row items-center">
          <ThemedText className="py-12 text-3xl">Projects</ThemedText>
          <View className="flex-1"></View>
          <View className="flex-row gap-3">
            {/* <Pressable className="mb-2 flex-row items-center justify-center rounded-xl bg-transparent p-4">
              <Search size={24} color="white" />
            </Pressable> */}
            <Pressable
              className="mb-2 flex-row items-center justify-center rounded-xl bg-ev-500 p-4"
              onPress={() => setShowCreate(true)}
            >
              <Plus size={24} color="white" />
            </Pressable>
          </View>
        </View>
        <ScrollableTabs tabs={[AllTab(), CommercialTab(), ResidentialTab()]} />
      </View>
      {showCreate && <ProjectAdd onClose={() => setShowCreate(false)} />}
    </>
  );
}

function AllTab(): ScrollableTab {
  const { data, isFetching } = api.mobile.projects.query.all.useQuery();

  if (isFetching)
    return {
      id: 0,
      title: "All",
      content: <Text className="dark:text-white">Loading....</Text>,
    };

  if (!data?.length)
    return {
      id: 0,
      title: "All",
      content: <Text className="dark:text-white">No projects</Text>,
    };

  return {
    id: 0,
    title: "All",
    content: <ProjectList projects={data} />,
  };
}

function CommercialTab(): ScrollableTab {
  const { data, isFetching } = api.mobile.projects.query.commercial.useQuery();

  if (isFetching)
    return {
      id: 1,
      title: "Commercial",
      content: <Text className="dark:text-white">Loading....</Text>,
    };

  if (!data?.length)
    return {
      id: 1,
      title: "Commercial",
      content: <Text className="dark:text-white">No projects</Text>,
    };

  return {
    id: 1,
    title: "Commercial",
    content: <ProjectList projects={data} />,
  };
}

function ResidentialTab(): ScrollableTab {
  const { data, isFetching } = api.mobile.projects.query.residential.useQuery();

  if (isFetching)
    return {
      id: 2,
      title: "Residential",
      content: <Text className="dark:text-white">Loading....</Text>,
    };

  if (!data?.length)
    return {
      id: 2,
      title: "Residential",
      content: <Text className="dark:text-white">No projects</Text>,
    };

  return {
    id: 2,
    title: "Residential",
    content: <ProjectList projects={data} />,
  };
}
