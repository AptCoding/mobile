import { useState } from "react";
import { Keyboard, TextInput, View } from "react-native";
import { Link, router } from "expo-router";
import { isClerkAPIResponseError, useSignUp } from "@clerk/clerk-expo";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { ArrowRight } from "./atoms/assets/icons";
import BigButton from "./atoms/big-button";
import { ThemedText } from "./atoms/themed";
import SigninExpired from "./molecules/signin/expired";
import SigninLink from "./molecules/signin/link";
import { useDeviceToken } from "./use-device-token";

interface SignupProps {
  email: string;
  onExists: () => void;
}

const FormSchema = z.object({
  emailAddress: z.string().email({ message: "Invalid email address" }),
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
});

type FormSchemaType = z.infer<typeof FormSchema>;

export default function Signup({ email, onExists }: SignupProps) {
  const initialValues: Record<string, string> = {
    emailAddress: email,
    firstName: "",
    lastName: "",
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
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

  const [signupState, setSignupState] = useState("SIGNUP");

  const [error, setError] = useState("");
  const { signUp, isLoaded, setActive } = useSignUp();
  const [isWaiting, setIsWaiting] = useState(false);

  const { handleDeviceTokenUpdate } = useDeviceToken();

  if (!isLoaded) return null;

  const { startEmailLinkFlow, cancelEmailLinkFlow } =
    signUp.createEmailLinkFlow();

  const onSubmit = async (data: FormSchemaType) => {
    setIsWaiting(true);
    try {
      await signUp.create(data);

      // Close that keyboard just to be sure
      Keyboard.dismiss();

      setSignupState("LINK");
      const _signUp = await startEmailLinkFlow({
        redirectUrl: "https://connect.rolec.app/verification",
      });

      const verification = _signUp.verifications.emailAddress;

      if (verification.status === "expired") {
        setSignupState("EXPIRED");
        return;
      }

      console.log(`verification: ${verification.status}`);

      if (_signUp.status === "complete") {
        console.log("sessionId", _signUp.createdSessionId);
        await setActive({ session: _signUp.createdSessionId });
        await handleDeviceTokenUpdate();
        router.push("/");
      }
    } catch (error: unknown) {
      console.log(error);
      cancelEmailLinkFlow();

      if (!isClerkAPIResponseError(error)) return;

      if (error.message) {
        if (error.message.includes("That email address is taken")) onExists();

        setError(error.message);
      }

      return;
    } finally {
      setIsWaiting(false);
    }
  };

  if (signupState === "EXPIRED")
    return <SigninExpired goBack={() => setSignupState("SIGNUP")} />;
  if (signupState === "LINK")
    return (
      <SigninLink
        emailAddress={getValues().emailAddress}
        onResend={() => setSignupState("SIGNUP")}
      />
    );

  return (
    <View>
      {error && (
        <ThemedText className="mb-2 text-lg" style={{ color: "red" }}>
          {error}
        </ThemedText>
      )}

      <Controller
        control={control}
        name="emailAddress"
        render={({ field: { onChange, onBlur, value } }) => (
          <View>
            <View className="mb-2 flex-row items-center justify-between">
              <ThemedText className="text-lg" style={{ fontWeight: 600 }}>
                Email Address
              </ThemedText>
            </View>
            {/* Input field for email address */}
            <TextInput
              className="rounded-lg border border-gray-500 p-4 text-xl dark:text-white"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              keyboardType="email-address"
            />
            {errors.emailAddress?.message && (
              <ThemedText style={{ color: "red" }}>
                {errors.emailAddress.message}
              </ThemedText>
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="firstName"
        render={({ field: { onChange, onBlur, value } }) => (
          <View>
            <View className="mb-2 flex-row items-center justify-between">
              <ThemedText className="text-lg" style={{ fontWeight: 600 }}>
                First Name
              </ThemedText>
            </View>
            {/* Input field for first name */}
            <TextInput
              className="rounded-lg border border-gray-500 p-4 text-xl dark:text-white"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
            />
            {errors.firstName?.message && (
              <ThemedText style={{ color: "red" }}>
                {errors.firstName.message}
              </ThemedText>
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="lastName"
        render={({ field: { onChange, onBlur, value } }) => (
          <View>
            <View className="mb-2 flex-row items-center justify-between">
              <ThemedText className="text-lg" style={{ fontWeight: 600 }}>
                Last Name
              </ThemedText>
            </View>
            {/* Input field for email address */}
            <TextInput
              className="rounded-lg border border-gray-500 p-4 text-xl dark:text-white"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
            />
            {errors.lastName?.message && (
              <ThemedText style={{ color: "red" }}>
                {errors.lastName.message}
              </ThemedText>
            )}
          </View>
        )}
      />

      {/* Terms of service and privacy policy text */}
      <View className="mt-4 flex-row items-center">
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
        label="Continue"
        icon={<ArrowRight size={16} color="#ffffff" />}
        onPress={handleSubmit(onSubmit)}
        isLoading={isWaiting}
      />
    </View>
  );
}
