import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { images } from "../../constants";
import { Loader } from "../../components";
import { useRecoilState } from 'recoil';
import {isloggedd, loadingg, userstate} from '../../constants/atoms.js'
import { CustomButton, FormField } from "../../components";


const SignUp = () => {
  
  const [user,setUser]=useRecoilState(userstate)
  const [isloggedin,setisloggedin]=useRecoilState(isloggedd)
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    phoneno:""
  });

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
      // Simulating an API call
      // const response = await fetch("https://example.com/api/login", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     email: form.email,
      //     password: form.password,
      //   }),
      // });
  
      // if (!response.ok) {
      //   throw new Error("Invalid email or password.");
      // }
  
      // const data = await response.json();
  
      // const userData = {
      //   username: data.user.username,
      //   email: data.user.email,
      //   phoneno: data.user.phoneno,
      // };
      const tokennn="omg"
      const userData = {
        username: form.username,
        email:    form.email,
        phoneno:  form.phoneno,
      };
      
  
      
      await AsyncStorage.setItem("token", tokennn);
      await AsyncStorage.setItem("userData", JSON.stringify(userData));
  
     
      setUser(userData);
      setisloggedin(true);
  
   
      router.replace("/home");
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to log in. Please try again.");
      console.error(error);
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
            className="w-[150px] h-[150px]"
          />

          <Text className="text-2xl font-semibold text-white mt-10 font-psemibold">
            Signup to <Text style={{ color: 'rgb(135, 206, 235)' }}>Saefy</Text>
          </Text>

          <FormField
            title="Username"
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles="mt-10"
          />

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />
          <FormField
          title="Enter your Phone No"
          value={form.phoneno}
          handleChangeText={(e) => setForm({ ...form, phoneno: e })}
          otherStyles="mt-7"
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
          />

          <CustomButton
            title="Sign Up"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Have an account already?
            </Text>
            <Link
              href="/login"
              className="text-lg font-psemibold text-secondary"
            >
              Login
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
