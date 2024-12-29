
import { TouchableOpacity, Text, View, Image, ScrollView } from 'react-native'; 
import { Animated, Dimensions } from 'react-native'; 
import { useState, useRef } from 'react';


const window = Dimensions.get('window');
const MIDDLE_SCREEN_HEIGHT = window.height / 2;
const BOTTOM_SHEET_MAX_HEIGHT = MIDDLE_SCREEN_HEIGHT;
const BOTTOM_SHEET_MIN_HEIGHT = 60;
const MAX_UPWARD_TRANSLATE_Y = 0;

const BottomSheet = ({
  onPolicePress,
  onCenterPress,
  showPoliceStations,
  onPublicPlacesPress,
  onBestLightestRoutePress,
  onFastestRoutePress,
  onsaferoutepress,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;

  const toggleBottomSheet = () => {
    const toValue = isExpanded ? 0 : 1;
    Animated.spring(animatedValue, {
      toValue,
      useNativeDriver: false,
      friction: 8,
      tension: 70,
    }).start();
    setIsExpanded(!isExpanded);
  };

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, MAX_UPWARD_TRANSLATE_Y], 
  });

  const height = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [BOTTOM_SHEET_MIN_HEIGHT, BOTTOM_SHEET_MAX_HEIGHT],
  });

  return (
    <Animated.View
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#1a1a1a',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 10,
        transform: [{ translateY }],
        height,
      }}
    >
      <TouchableOpacity onPress={toggleBottomSheet} style={{ paddingVertical: 8, alignItems: 'center' }}>
        <View className="w-16 h-1.5 bg-white rounded-full" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={{ padding: 15 }}>
        <Text className="text-white text-2xl font-bold mb-3">Quick Actions</Text>

        {/* Police Stations & Places Section */}
        <View className="mb-5">
          <Text className="text-white text-lg mb-3">Police Stations & Places</Text>
          <View className="flex flex-row flex-wrap gap-4">
            <ActionButton
              onPress={onPolicePress}
              title={showPoliceStations?.length > 0 ? 'Hide Police Stations' : 'Show Police Stations'}
              icon={{ uri: 'your-police-icon-path' }}
              isSelected={showPoliceStations?.length > 0}
            />
            <ActionButton
              onPress={onPublicPlacesPress}
              title="Show Public Places"
              icon={{ uri: 'your-public-place-icon-path' }}
              isSelected={false}
            />
          </View>
        </View>

        {/* Location Section */}
        <View className="mb-5">
          <Text className="text-white text-lg mb-3">Location</Text>
          <View className="flex flex-row flex-wrap gap-4">
            <ActionButton
              onPress={onCenterPress}
              title="Center on Me"
              icon={{ uri: 'your-location-icon-path' }}
              isSelected={false}
            />
          </View>
        </View>

        {/* Routes Section */}
        <View>
          <Text className="text-white text-lg mb-3">Routes</Text>
          <View className="flex flex-row flex-wrap gap-4">
            <ActionButton
              onPress={onBestLightestRoutePress}
              title="Best Lightest Route"
              icon={{ uri: 'your-lightest-route-icon-path' }}
              isSelected={false}
            />
            <ActionButton
              onPress={onFastestRoutePress}
              title="Fastest Route"
              icon={{ uri: 'your-fastest-route-icon-path' }}
              isSelected={false}
            />
            <ActionButton
              onPress={onsaferoutepress}
              title="saferoutepress"
              icon={{ uri: 'your-fastest-route-icon-path' }}
              isSelected={false}
            />
          </View>
        </View>
      </ScrollView>
    </Animated.View>
  );
};

const ActionButton = ({ onPress, title, icon, isSelected }) => {
  const activeButtonStyle = isSelected
    ? { backgroundColor: '#0ba6ff' } // Active color
    : { backgroundColor: '#5fb9ed' }; // Inactive color

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[{ paddingVertical: 12, paddingHorizontal: 15, borderRadius: 10, width: '45%' }, activeButtonStyle]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image source={icon} style={{ width: 24, height: 24, marginRight: 10 }} />
        <View className='flex-1'>
        <Text
          className="text-white text-lg font-medium"
          numberOfLines={1}
          ellipsizeMode="tail" 
          >
          {title}
        </Text>
          </View>
      </View>
    </TouchableOpacity>
  );
};

export default BottomSheet