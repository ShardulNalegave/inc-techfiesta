
import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';

const LoadingIndicator = ({ loading, text }) => {
  return loading ? (
    <View className="absolute inset-0 items-center justify-center bg-black/60 z-20">
      <ActivityIndicator size="large" color="#00aaff" />
      <Text className="mt-2.5 text-[#81d4fa] text-base">{text}</Text>
    </View>
  ) : null;
};

export default LoadingIndicator;
