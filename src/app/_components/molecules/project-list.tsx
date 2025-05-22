import React from "react";
import { ScrollView, Text, View } from "react-native";

import { AlertTriangle, Commercial, HomeIcon } from "../atoms/assets/icons";

export interface Project {
  code: string;
  name: string;
  createdAt: Date;
  untestedChargepoints: number;
  type: string;
}

interface ProjectListProps {
  projects: Project[];
}

export default function ProjectList({ projects }: ProjectListProps) {
  return (
    <ScrollView className="w-full flex-1">
      {projects.map((project) => (
        <View
          key={project.code}
          className="flex flex-row gap-5 border-b-2 border-gray-300 p-2 py-7 dark:border-gray-700"
        >
          {project.type == "commercial" ? (
            <Commercial size={16} color="white" />
          ) : (
            <HomeIcon size={16} color="white" />
          )}
          <View className="flex-1">
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              className="text-2xl font-bold leading-none dark:text-white"
            >
              {project.name}
            </Text>
            <View className="mt-2 flex-row items-center">
              <Text className="text-bold text-gray-500 dark:text-gray-400">
                {project.code}
              </Text>
              <Text className="text-gray-500 dark:text-gray-400">
                {" "}
                - Created: {project.createdAt.toDateString()}
              </Text>
            </View>
            {project.untestedChargepoints > 0 && (
              <View className="mt-2 flex-row items-center gap-2">
                <AlertTriangle size={16} color="#f97316" />
                <Text className="text-orange-500 dark:text-orange-400">
                  {project.untestedChargepoints} untested chargepoints
                </Text>
              </View>
            )}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
