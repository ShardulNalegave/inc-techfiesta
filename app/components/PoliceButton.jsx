
import React from 'react';
import { TouchableOpacity, Text,View } from 'react-native';

const PoliceButton = ({ policestations, isLoading, policecover }) => {
  return (
    <TouchableOpacity
      className={`p-3 rounded-lg flex-[0.48] ${policestations.length > 0 ? 'bg-[#05744f]' : 'bg-[#a7c7e7]'}`}
      onPress={policecover}
      disabled={isLoading}
    >
      <Text className="text-[#1c3a49] text-center text-base font-semibold">
        {policestations.length > 0 ? 'Police stations selected' : 'Get Police stations'}
      </Text>
    </TouchableOpacity>
  );
};

export default PoliceButton;
