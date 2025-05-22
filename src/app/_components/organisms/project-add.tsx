import { ActivityIndicator, Pressable, TextInput, View } from "react-native";
import { useColorScheme } from "nativewind";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import colors from "~/app/_styles/colors";
import { api } from "~/utils/api";
import { ArrowRight, Commercial, HomeIcon } from "../atoms/assets/icons";
import BugButton from "../atoms/big-button";
import { ThemedText } from "../atoms/themed";
import ActionSheet from "../molecules/action-sheet";

const FormSchema = z.object({
  name: z.string().min(1, { message: "A project name is required" }),
  type: z.string().min(1, { message: "Please select a is required" }),
});

type FormSchemaType = z.infer<typeof FormSchema>;

interface ProjectAddProps {
  onClose: () => void;
}

export default function ProjectAdd({ onClose }: ProjectAddProps) {
  const { colorScheme } = useColorScheme();
  const utils = api.useUtils();

  const { mutate, isPending } = api.mobile.project.mutate.new.useMutation({
    async onSuccess() {
      console.log("Project created");
      onClose();
      await utils.mobile.projects.query.invalidate();
    },
    onError(err) {
      console.log("Project not created");
      console.error(err);
    },
  });

  const initialValues: Record<string, string> = {
    name: "",
    type: "commercial",
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = useForm<FormSchemaType>({
    defaultValues: initialValues,
    resolver: (data) => {
      try {
        FormSchema.parse(data);
        return { values: data, errors: {} };
      } catch (error) {
        if (error instanceof z.ZodError) {
          const formatedErrors = error.issues.reduce(
            (acc, issue) => {
              const path = issue.path.join(".");
              acc[path] = {
                type: issue.code,
                message: issue.message,
              };
              return acc;
            },
            {} as Record<string, { type: string; message: string }>,
          );

          return {
            values: {},
            errors: formatedErrors,
          };
        }
        return { values: {}, errors: {} };
      }
    },
  });

  const onSubmit = (data: FormSchemaType) => {
    mutate({
      name: data.name,
      type: data.type == "residential" ? "residential" : "commercial",
    });
  };

  const toggleType = () => {
    setValue(
      "type",
      getValues("type") == "commercial" ? "residential" : "commercial",
    );
  };

  return (
    <ActionSheet isVisible={true} onClose={onClose} title="Create New Project">
      <View className="pt-2">
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <View className="mb-4">
              <View className="mb-2 flex-row items-center justify-between">
                <ThemedText className="text-lg" style={{ fontWeight: 600 }}>
                  Project Name
                </ThemedText>
              </View>
              {/* Input field for email address */}
              <TextInput
                className="rounded-lg border border-gray-500 p-4 text-xl dark:text-white"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                autoFocus={true}
              />
              {errors.name?.message && (
                <ThemedText style={{ color: "red" }}>
                  {errors.name.message}
                </ThemedText>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name="type"
          render={({ field: { value } }) => (
            <View className="flex-row items-center gap-10 py-4">
              <Pressable onPress={toggleType} className="p-2">
                <View className="flex-row items-center gap-4">
                  <Commercial
                    size={24}
                    color={
                      value == "commercial"
                        ? colors[colorScheme ?? "light"].green
                        : colors[colorScheme ?? "light"].text
                    }
                  />
                  <ThemedText
                    className="text-lg"
                    style={{
                      color:
                        value == "commercial"
                          ? colors[colorScheme ?? "light"].green
                          : colors[colorScheme ?? "light"].text,
                    }}
                  >
                    Commercial
                  </ThemedText>
                </View>
              </Pressable>
              <Pressable onPress={toggleType} className="p-2">
                <View className="flex-row items-center gap-4">
                  <HomeIcon
                    size={24}
                    color={
                      value == "residential"
                        ? colors[colorScheme ?? "light"].green
                        : colors[colorScheme ?? "light"].text
                    }
                  />
                  <ThemedText
                    className="text-lg"
                    style={{
                      color:
                        value == "residential"
                          ? colors[colorScheme ?? "light"].green
                          : colors[colorScheme ?? "light"].text,
                    }}
                  >
                    Residential
                  </ThemedText>
                </View>
              </Pressable>
            </View>
          )}
        />

        <View className="mt-4">
          <BugButton
            label="Create"
            icon={
              isPending ? (
                <ActivityIndicator color={"#ffffff"} size={16} />
              ) : (
                <ArrowRight size={16} color="#ffffff" />
              )
            }
            onPress={!isPending ? handleSubmit(onSubmit) : null}
          />
        </View>
      </View>
    </ActionSheet>
  );
}
