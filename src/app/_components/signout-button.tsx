import { Pressable, Text } from "react-native";
import * as Linking from "expo-linking";
import { useClerk } from "@clerk/clerk-expo";

export default function SignoutButton() {
  const { signOut } = useClerk();

  async function handlePress() {
    await signOut();
    await Linking.openURL(Linking.createURL("/"));
  }

  return (
    <Pressable
      className="mb-2 rounded-lg bg-grey-800 p-4"
      onPress={handlePress}
    >
      <Text className="text-center text-white">Signout</Text>
    </Pressable>
  );
}
