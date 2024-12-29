import { View, Text } from "react-native";

const InfoBox = ({ username,phoneno,email, containerStyles, titleStyles }) => {
  return (
    <View className={containerStyles}>
      <Text className={`text-white text-center font-psemibold ${titleStyles}`}>
        {username}
      </Text>
      <Text className="text-sm text-gray-100 text-center font-pregular">
        {phoneno}
      </Text>
      <Text className="text-sm text-gray-100 text-center font-pregular">
        {email}
      </Text>
    </View>
  );
};

export default InfoBox;
