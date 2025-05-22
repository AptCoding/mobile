import { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { Link, router } from "expo-router";
import { isClerkAPIResponseError, useSignIn } from "@clerk/clerk-expo";

import BrandLogo from "./atoms/assets/brand-logo";
import ChargersRow from "./atoms/assets/chargers-row";
import { ArrowRight } from "./atoms/assets/icons";
import BigButton from "./atoms/big-button";
import { ThemedText } from "./atoms/themed";
import SigninExpired from "./molecules/signin/expired";
import SigninLink from "./molecules/signin/link";
import Signup from "./signup";
import { useDeviceToken } from "./use-device-token";

// Function to check if a string is empty
const isEmpty = (str: string) => {
  return !str.trim();
};

export default function Signin() {
  const [expired, setExpired] = useState(false);
  const [error, setError] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const { signIn, isLoaded, setActive } = useSignIn();
  const [isWaiting, setIsWaiting] = useState(false);

  // Options
  // SIGNIN, EXPIRED, LINK, NOUSER
  const [signinState, setSigninState] = useState("SIGNIN");

  const { handleDeviceTokenUpdate } = useDeviceToken();

  // Return null if the sign-in component is not loaded
  if (!isLoaded) return null;

  const { startEmailLinkFlow, cancelEmailLinkFlow } =
    signIn.createEmailLinkFlow();

  async function handleSignin() {
    setExpired(false);

    // Validate an email address has been entered
    if (isEmpty(emailAddress)) {
      setError("Please enter a valid email address");
      return;
    }

    setError("");

    // Return early if the component is not loaded
    if (!isLoaded) return;

    setIsWaiting(true);
    try {
      const _signIn = await signIn.create({
        identifier: emailAddress.toLowerCase(),
      });

      // Check if supportedFirstFactors is defined
      const supportedFirstFactors = _signIn.supportedFirstFactors;
      if (!supportedFirstFactors) return;

      // @ts-expect-error - emailLinkFactor is not null
      const { emailAddressId } = supportedFirstFactors.find(
        (ff) =>
          ff.strategy === "email_link" && ff.safeIdentifier === emailAddress,
      );

      const emailId = String(emailAddressId);
      // Return early if emailId is not defined
      if (!emailId) return;

      // Close that keyboard just to be sure
      Keyboard.dismiss();

      setSigninState("LINK");
      const res = await startEmailLinkFlow({
        // emailAddressId is required for email link flow
        emailAddressId: emailId,
        redirectUrl: "https://connect.rolec.app/verification",
      });

      const verification = res.firstFactorVerification;
      if (verification.status === "expired") {
        setSigninState("EXPIRED");
        return;
      }

      console.log(`verification: ${verification.status}`);

      if (res.status === "complete") {
        console.log("sessionId", res.createdSessionId);
        await setActive({ session: res.createdSessionId });
        await handleDeviceTokenUpdate();
        router.push("/");
      }
    } catch (error: unknown) {
      cancelEmailLinkFlow();
      if (!isClerkAPIResponseError(error)) return;
      if (error.message.includes("Couldn't find your account."))
        setSigninState("SIGNUP");
      else setError(error.message);
      return;
    } finally {
      setIsWaiting(false);
    }
  }

  // Display a message if the email link has expired
  if (expired) return <ThemedText>Email link has expired</ThemedText>;

  return (
    <KeyboardAvoidingView
      className="items h-full w-full flex-col bg-background p-4"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View
        className="relative flex items-center justify-center"
        style={styles.logo}
      >
        <BrandLogo />
      </View>

      <View className="flex flex-1 items-center justify-center p-4">
        <ChargersRow />
      </View>

      {signinState === "SIGNIN" && (
        <View className="pb-4">
          <View className="mb-2 flex-row items-center justify-between">
            <ThemedText className="text-lg" style={{ fontWeight: 600 }}>
              Email Address
            </ThemedText>
          </View>

          {/* Input field for email address */}
          <TextInput
            className="rounded-lg border border-gray-500 p-4 text-xl dark:text-white"
            placeholder="Email Address"
            value={emailAddress}
            onChangeText={(e) => setEmailAddress(e.toLowerCase())}
            keyboardType="email-address"
          />
          {error && (
            <ThemedText className="text-lg" style={{ color: "red" }}>
              {error}
            </ThemedText>
          )}

          {/* Instruction to use work email address */}
          <View className="mt-4 flex-row items-center">
            <ThemedText className="font-montserrat_light mb-8 text-lg">
              Please use your work email address.
            </ThemedText>
          </View>

          {/* Terms of service and privacy policy text */}
          <View className="flex-row items-center">
            <ThemedText className="text-md font-montserrat_light mb-10 opacity-50">
              By signing up, you agree to our{" "}
              <Link
                href="https://www.rolecserv.com/rolec-smart-solutions/rolec-connect-installer-licence-agreement"
                target="_blank"
                className="font-montserrat_bold underline"
              >
                Terms of Services
              </Link>{" "}
              and{" "}
              <Link
                href="https://www.rolecserv.com/rolec-smart-solutions/rolec-connect-privacy-policy"
                target="_blank"
                className="font-montserrat_bold underline"
              >
                Privacy Policy
              </Link>
              .
            </ThemedText>
          </View>

          <BigButton
            icon={<ArrowRight size={16} color="#ffffff" />}
            label="Continue"
            isLoading={isWaiting}
            onPress={handleSignin}
          />
        </View>
      )}

      {signinState === "SIGNUP" && (
        <Signup
          email={emailAddress}
          onExists={() => setSigninState("SIGNIN")}
        />
      )}

      {signinState === "LINK" && (
        <SigninLink
          emailAddress={emailAddress}
          onResend={() => setSigninState("SIGNIN")}
        />
      )}

      {signinState === "EXPIRED" && (
        <SigninExpired goBack={() => setSigninState("SIGNIN")} />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  logo: {
    height: "17%",
    transform: [{ scale: 0.7 }],
  },
});
