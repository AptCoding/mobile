import { Pressable, View } from "react-native";

import { ThemedText } from "../../atoms/themed";

export default function SigninExpired({ goBack }: { goBack: () => void }) {
  return (
    <View className="pb-4">
      <View className="mb-8 flex-row items-center justify-between">
        <ThemedText className="text-4xl font-semibold leading-normal text-gray-800 dark:text-white">
          Your 1-time login link has expired
        </ThemedText>
      </View>

      <Pressable className="mb-2 rounded-xl bg-ev-500 p-5" onPress={goBack}>
        <ThemedText className="text-center text-xl text-grey-800 dark:text-white">
          Go Back
        </ThemedText>
      </Pressable>
    </View>
  );
}
