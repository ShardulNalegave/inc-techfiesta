import { useState, useEffect } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert, Image } from "react-native";
import { useRecoilState } from "recoil";
import { isloggedd, userstate } from "../../constants/atoms";
import { images } from "../../constants";
import { CustomButton, FormField } from "../../components";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SignIn = () => {
  const [isloggedin, setisloggedin] = useRecoilState(isloggedd);
  const [user, setuser] = useRecoilState(userstate);
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    // Redirect to home once user is set
    if (isloggedin && user) {
      router.replace("/home");
    }
  }, [isloggedin, user]);

  const submit = async () => {
    if (!form.email.trim()) {
      Alert.alert("Error", "Email cannot be empty.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim())) {
      Alert.alert("Error", "Please enter a valid email address.");
      return;
    }

    if (!form.password.trim()) {
      Alert.alert("Error", "Password cannot be empty.");
      return;
    }

    setSubmitting(true);

    try {
      // Mocking an API response
      const response = {
        data: {
          token: "mytoken",
          user: { email: form.email, password: form.password },
        },
      };

      const { token, user } = response.data;

      // Save user data and token to AsyncStorage
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("userData", JSON.stringify(user));

      // Update Recoil states
      setuser(user);
      setisloggedin(true);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to log in. Please try again.";
      Alert.alert("Error", errorMessage);
      console.error("Login error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View
          className="w-full flex justify-center h-full px-4 my-6"
          style={{
            minHeight: Dimensions.get("window").height - 100,
          }}
        >
          <Image
            source={images.logo}
            resizeMode="contain"
            className="w-[115px] h-[100px]"
          />

          <Text className="text-2xl font-semibold text-white mt-10 font-psemibold">
            Log in to { }
            <Text style={{ color: 'rgb(135, 206, 235)' }}>Saefy</Text>
          </Text>

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
          />

          <CustomButton
            title="Login"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Don't have an account?
            </Text>
            <Link
              href="/signup"
              className="text-lg font-psemibold text-secondary"
            >
              Signup
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
