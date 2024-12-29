import { useEffect } from "react";
import { useFonts } from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { isloggedd, userstate } from "../constants/atoms";
import './global.css'
import { Redirect, SplashScreen, Stack } from "expo-router";
import { RecoilRoot,useSetRecoilState } from "recoil";


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [fontsLoaded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
  });

  useEffect(() => {
    if (error) throw error;

    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded) {
    return null;
  }

  if (!fontsLoaded && !error) {
    return null;
  }



  const AppInitializer = ({ children }) => {
    const setUser = useSetRecoilState(userstate);
    const setisloggedin = useSetRecoilState(isloggedd);
  
    useEffect(() => {
      const restoreUserData = async () => {
        try {
          const token = await AsyncStorage.getItem("token");
          const storedUser = await AsyncStorage.getItem("userData");
  
          if (token) {
            setUser(JSON.parse(storedUser));
            setisloggedin(true);
            return(<Redirect href='/home'/>)
          }
        } catch (error) {
          console.error("Error restoring user data:", error);
        }
      };
  
      restoreUserData();
    }, []);
  
    return <>{children}</>;
  };

  return (
  
    <RecoilRoot>

<AppInitializer>

      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
       
      </Stack>
</AppInitializer>

    </RecoilRoot>
  );
};

export default RootLayout;
