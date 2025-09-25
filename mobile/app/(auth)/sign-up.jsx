import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useState } from "react";
import { styles } from "@/assets/styles/auth.style.js";
import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import SignupImage from "@/assets/images/revenue-i2.png";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState("");

  const onSignUpPress = async () => {
    if (!isLoaded || !emailAddress.trim() || !password.trim()) return;

    setError("");

    setIsLoading(true);

    try {
      await signUp.create({
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setPendingVerification(true);
    } catch (err) {
      setError(JSON.stringify(err.errors[0].message, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded || !code.trim()) return;

    setError("");

    setIsLoading(true);

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });

        router.replace("/");
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2));

        setIsLoading(false);
      }
    } catch (err) {
      setError(JSON.stringify(err.errors[0].message, null, 2));

      setIsLoading(false);
    }
  };

  if (pendingVerification)
    return (
      <View style={styles.verificationContainer}>
        <Text style={styles.verificationTitle}>Verify your email</Text>

        {error.trim() ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={20} color={COLORS.expense} />

            <Text style={styles.errorText}>{error}</Text>

            <TouchableOpacity onPress={() => setError("")}>
              <Ionicons name="close" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>
        ) : null}

        <TextInput
          style={[styles.verificationInput, error && styles.errorInput]}
          value={code}
          keyboardType="numeric"
          inputMode="numeric"
          placeholder="Enter your verification code"
          placeholderTextColor="#9A8478"
          onChangeText={(code) => setCode(code)}
        />

        <TouchableOpacity
          style={[
            styles.button,
            isLoading
              ? {
                  opacity: 0.5,
                  pointerEvents: "none",
                }
              : null,
          ]}
          onPress={onVerifyPress}
          disabled={!code.trim() || isLoading}
        >
          <Text style={styles.buttonText}>Verify</Text>
        </TouchableOpacity>
      </View>
    );

  return (
    <ScrollView
      style={{
        flex: 1,
      }}
      contentContainerStyle={{
        flexGrow: 1,
      }}
    >
      <View style={styles.container}>
        <Image source={SignupImage} style={styles.illustration} />

        <Text style={styles.title}>Create Account</Text>

        {error.trim() ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={20} color={COLORS.expense} />

            <Text style={styles.errorText}>{error}</Text>

            <TouchableOpacity onPress={() => setError("")}>
              <Ionicons name="close" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>
        ) : null}

        <TextInput
          style={[styles.input, error && styles.errorInput]}
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Enter email"
          placeholderTextColor="#9A8478"
          onChangeText={setEmailAddress}
        />

        <TextInput
          style={[styles.input, error && styles.errorInput]}
          autoCapitalize="none"
          value={password}
          placeholder="Enter password"
          placeholderTextColor="#9A8478"
          secureTextEntry
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={[
            styles.button,
            isLoading
              ? {
                  opacity: 0.5,
                  pointerEvents: "none",
                }
              : null,
          ]}
          disabled={!emailAddress || !password}
          onPress={onSignUpPress}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Already have an account?</Text>

          <TouchableOpacity
            style={[
              isLoading
                ? {
                    opacity: 0.5,
                    pointerEvents: "none",
                  }
                : null,
            ]}
            disabled={isLoading}
            onPress={() => router.push("/sign-in")}
          >
            <Text style={styles.linkText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
