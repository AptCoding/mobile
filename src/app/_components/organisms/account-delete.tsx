import React from "react";
import { Modal, Pressable, View } from "react-native";
import { router } from "expo-router";
import { useClerk } from "@clerk/clerk-expo";
import { useColorScheme } from "nativewind";

import colors from "~/app/_styles/colors";
import { api } from "~/utils/api";
import { ThemedText } from "../atoms/themed";

export default function AccountDelete({
  visible,
  onCancel,
}: {
  visible: boolean;
  onCancel: () => void;
}) {
  const { colorScheme } = useColorScheme();
  const { signOut } = useClerk();
  const { mutate, isPending } = api.web.account.mutate.delete.useMutation({
    async onSuccess() {
      console.log("Account deleted");
      await signOut();
      router.dismissTo("/");
    },
    onError(err) {
      console.log("Account not created");
      console.error(err);
    },
  });

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
    >
      <View className="flex-1 items-center justify-center">
        <View
          className="w-11/12 rounded-2xl bg-white p-5 shadow-2xl shadow-black"
          style={{
            backgroundColor: colors[colorScheme ?? "light"].optionsMenuBg,
          }}
        >
          <ThemedText className="mb-4 text-2xl">Delete Account</ThemedText>
          <ThemedText className="mb-2">
            Once you press "Yes, Close My Account", your account will be
            permanently deleted. This means:
          </ThemedText>
          <ThemedText className="mb-2 p-2 pl-4">
            You will no longer be able to use your account.
          </ThemedText>
          <ThemedText className="mb-2 p-2 pl-4">
            All personal data associated with your account will be erased.
          </ThemedText>
          <ThemedText className="mb-2 p-2 pl-4">
            Any chargers linked to your account will be forgotten.
          </ThemedText>
          <ThemedText className="mb-2">
            Any shared accounts will lose control of the associated charge
            points.
          </ThemedText>

          <Pressable
            className="mt-4 rounded-lg bg-ev-500 p-3"
            onPress={onCancel}
          >
            <ThemedText className="text-center">Cancel</ThemedText>
          </Pressable>

          <Pressable className="mt-4 rounded-lg p-3" onPress={() => mutate()}>
            {!isPending ? (
              <ThemedText className="text-center">
                Yes, Close My Account
              </ThemedText>
            ) : (
              <ThemedText className="text-center">Closing&hellip;</ThemedText>
            )}
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
