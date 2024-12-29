import React from 'react';
import { Redirect, Tabs } from "expo-router";
import { Image, Text, View } from "react-native";
import { StatusBar } from 'expo-status-bar';
import { icons } from "../../constants";
import { Loader } from "../../components";
import { useRecoilState } from 'recoil';
import { loadingg,isloggedd } from '../../constants/atoms';
const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View className="flex items-center justify-center gap-2 text-nowrap">
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        className="w-6 h-6"
      />
    </View>
  );
};

export default function TabLayout() {
  const [loadin,setloading]=useRecoilState(loadingg)
  const [isLogged,setIsLogged]=useRecoilState(isloggedd)
  if (!loadin && !isLogged) return <Redirect href="/signup" />;
  return (
    <>
   <Tabs
  screenOptions={{
    tabBarActiveTintColor: "#0cbddc",
    headerShown: false,
    tabBarInactiveTintColor: "#CDCDE0",
    tabBarShowLabel: false,
    tabBarStyle: {
      backgroundColor: "#161622",
      // borderTopWidth: 1,
      borderTopColor: "#232533",
      height: 60,
      justifyContent: "center", 
      alignItems: "center",
    
    },
  }}
>
     <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.home}
                color={color}
                name="Home"
                focused={focused}
              />
            ),
          }}
        />
      <Tabs.Screen
          name="connect"
          options={{
            title: "Connect",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.connection}
                color={color}
                name="Connect"
                focused={focused}
              />
            ),
          }}
        />
       <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.profile}
                color={color}
                name="Profile"
                focused={focused}
              />
            ),
          }}
        />
    </Tabs>
    <Loader isLoading={loadin} />
    <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
}
