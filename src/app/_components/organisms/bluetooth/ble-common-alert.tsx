import React from "react";

import AlertModal from "../../molecules/alert-modal";

export type BleCommonAlertTypes =
  | "UNABLE_TO_CONNECT"
  | "INVALID_PASS"
  | "LOCKED"
  | null;

interface BleCommonAlertProps {
  alert: BleCommonAlertTypes;
  onDismiss: () => void;
}

export default function BleCommonAlert({
  alert,
  onDismiss,
}: BleCommonAlertProps) {
  const alerts = {
    UNABLE_TO_CONNECT: {
      title: "Unable to connect",
      message:
        "Unable to connect to the device, try again or power cycle the device",
      button: "Try again",
    },
    INVALID_PASS: {
      title: "Unable to authenticate",
      message:
        "The PIN or Password you entered is incorrect or we were unable to authenticate with the chargepoint, check the password and try again and ensure the chargepoint is powered on",
      button: "OK",
    },
    LOCKED: {
      title: "Chargepoint locked",
      message:
        "The chargepoint has been locked following too many incorrect attempts, fully power cycle the chargepoint and try again",
      button: "OK",
    },
  };

  if (!alert) return null;

  const message = alerts[alert];

  return (
    <AlertModal
      show={true}
      title={message.title}
      message={message.message}
      onClose={onDismiss}
      buttonLabel={message.button}
    />
  );
}
