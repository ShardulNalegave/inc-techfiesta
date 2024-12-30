import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import logo from '../assets/images/mainlogo.png';
import TypeWriter from 'react-native-typewriter'
import { useRecoilState } from "recoil";
import { Redirect } from "expo-router";
import {isloggedd } from "../constants/atoms.js";
// import buttonn from '../components/Buttontemp'
import Buttontemp from '../components/CustomButton2'
import CustomButton from '../components/CustomButton'
const Welcome = () => {
  const [islogge,setislogge] = useRecoilState(isloggedd);
  if(islogge){
    return(<Redirect href="/home"/>)
  }
  return (
   
    <SafeAreaView>
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="h-screen w-screen bg-black">
          <View className="w-full flex justify-center items-center h-[80vh]">
            <Image
              source={logo}
              className="w-[400px] h-[400px]"
              resizeMode="contain"
            />

            <View className="relative flex-col">
                <TypeWriter typing={1} fixed={true} initialDelay={100}>
              <Text className="text-5xl text-white text-center font-plight">
                Find Safest {"\n"}Route with{" "}
                  <Text style={{ color: 'rgb(135, 206, 235)' }} className="font-pextrabold text-5xl">Saefy!</Text>
              </Text>
                  </TypeWriter>
            </View>

            <Text className="text-xl mt-7 text-center">
              Reach safe home with us
            </Text>
            <View className="w-full gap-5 flex items-center justify-center">
             <CustomButton
            title="Register now"
            handlePress={() => router.push("/signup")}
            containerStyles="w-full mt-7"
          />
           <Buttontemp
            title="Login now"
            handlePress={() => router.push("/login")}
            containerStyles="w-full mt-7"
          />
            </View>
           
          </View>
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
   
  );
};

export default Welcome;
