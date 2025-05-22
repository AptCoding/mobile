import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";

import { ThemedText } from "../../atoms/themed";

export default function SigninLink({
  emailAddress,
  onResend,
}: {
  emailAddress: string;
  onResend: () => void;
}) {
  const time = 30;
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(true);
  const [countdown, setCountdown] = useState(time);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isResendDisabled) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown === 1) {
            setIsResendDisabled(false);
            clearInterval(timer);
            return time;
          }
          return prevCountdown - 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(timer);
    };
  }, [isResendDisabled]);

  const handleResend = () => (isResendDisabled ? null : onResend());

  return (
    <View className="pb-4">
      <View className="mb-8 flex-row items-center justify-between">
        <ThemedText className="text-4xl font-semibold leading-tight">
          Check your email for a 1-time login link
        </ThemedText>
      </View>

      <View className="flex-row items-center">
        <ThemedText className="font-montserrat_light mb-14 text-lg">
          {emailAddress}
        </ThemedText>
      </View>

      <Pressable
        className={`mb-2 rounded-xl ${isResendDisabled ? "bg-gray-400" : "bg-ev-500"} flex-row items-center justify-center p-5`}
        onPress={handleResend}
      >
        <ThemedText className="text-center text-xl">Resend</ThemedText>
        {isResendDisabled && (
          <ThemedText className="ml-1 text-center text-xl">
            ({countdown})
          </ThemedText>
        )}
      </Pressable>
    </View>
  );
}
