import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useRecoilValue } from "recoil";
import { isloggedd, loadingg } from "../../constants/atoms";

import { Loader } from "../../components";


const AuthLayout = () => {
 
const loading=useRecoilValue(loadingg)
const isLogged=useRecoilValue(isloggedd)
  if (!loading && isLogged) return <Redirect href="/home" />;

  return (
    <>
      <Stack>
        <Stack.Screen
          name="signup"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="login"
          options={{
            headerShown: false,
          }}
        />
      </Stack>

      <Loader isLoading={loading} />
      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
};

export default AuthLayout;
