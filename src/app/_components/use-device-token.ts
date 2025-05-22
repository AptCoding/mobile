import { api } from "~/utils/api";
import { usePushNotifications } from "../push-notifications";

export function useDeviceToken() {
  const { expoPushToken } = usePushNotifications();
  console.log("pushToken", expoPushToken);

  const updateDeviceToken =
    api.mobile.notification.mutate.addDeviceToken.useMutation({
      onSuccess: () => {
        console.log("Device token updated successfully");
      },
      onError: (error) => {
        console.error("Error updating device token:", error);
      },
    });

  const handleDeviceTokenUpdate = async () => {
    if (expoPushToken) {
      try {
        await updateDeviceToken.mutateAsync({
          expoPushToken: expoPushToken.data,
        });
      } catch (error) {
        console.error("Failed to add device token:", error);
      }
    }
  };
  return { handleDeviceTokenUpdate };
}
