import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

const LoadingOverlay = ({ isVisible, message }) => {
  if (!isVisible) return null;

  return (
    <View className="absolute inset-0 items-center justify-center bg-black/80 z-20">
      <ActivityIndicator size="large" color="#00aaff" />
      <Text className="mt-2.5 text-[#81d4fa] text-base">{message}</Text>
    </View>
  );
};

export default LoadingOverlay;
