import { TouchableOpacity, Text, View, Image, ScrollView, Dimensions, StyleSheet } from 'react-native';
import { Animated } from 'react-native';
import { useState, useRef } from 'react';
import { images } from '../constants/index.js';

const window = Dimensions.get('window');
const BOTTOM_SHEET_MAX_HEIGHT = window.height * 0.7;
const BOTTOM_SHEET_MIN_HEIGHT = 60;

const ActionButton = ({ onPress, title, icon, isSelected }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      styles.actionButton,
      { backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.8)' : 'rgba(45, 45, 45, 0.95)' }
    ]}
    activeOpacity={0.8}
  >
    <View style={styles.actionButtonContent}>
      <View style={styles.iconContainer}>
        <Image
          source={icon}
          style={[
            styles.actionButtonIcon,
            // { tintColor: isSelected ? '#ffffff' : '#e0e0e0' }
          ]}
          resizeMode="contain"
        />
      </View>
      <Text 
        style={[
          styles.actionButtonText,
          { color: isSelected ? '#ffffff' : '#e0e0e0' }
        ]}
        numberOfLines={1}
      >
        {title}
      </Text>
    </View>
  </TouchableOpacity>
);

const BottomSheet = ({
  onPolicePress,
  onCenterPress,
  showPoliceStations,
  onPublicPlacesPress,
  onBestLightestRoutePress,
  onFastestRoutePress,
  onsaferoutepress,
  routetype,
  setroutetype
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  const toggleBottomSheet = () => {
    const toValue = isExpanded ? 0 : 1;
    
    Animated.spring(animation, {
      toValue,
      useNativeDriver: false,
      friction: 12,
      tension: 65,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01,
    }).start();
    
    setIsExpanded(!isExpanded);
  };

  const bottomSheetHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [BOTTOM_SHEET_MIN_HEIGHT, BOTTOM_SHEET_MAX_HEIGHT]
  });

  const getRouteTitle = (type) => {
    if (type === 'lighting') {
      return routetype === 'lighting' ? 'Hide Lit Route' : 'Best Lit Route';
    }
    if (type === 'fast') {
      return routetype === 'fast' ? 'Hide Fast Route' : 'Fastest Route';
    }
    if (type === 'safe') {
      return routetype === 'safe' ? 'Hide Safe Route' : 'Safe Route';
    }
    if(type=='crime'){
      return routetype==='crime'?'Hide crime Route':"Least crime route"
    }
    return '';
  };

  return (
    <Animated.View style={[styles.container, { height: bottomSheetHeight }]}>
      <TouchableOpacity 
        onPress={toggleBottomSheet}
        style={styles.handle}
      >
        <View style={styles.handleBar} />
        <Text style={styles.handleText}>
          {isExpanded ? 'Swipe down to close' : 'Swipe up for options'}
        </Text>
      </TouchableOpacity>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <Text style={styles.sectionTitle}>Police Stations & Places</Text>
        <View style={styles.buttonRow}>
          <ActionButton
            onPress={onPolicePress}
            title={showPoliceStations?.length > 0 ? 'Hide Police' : 'Show Police'}
            icon={images.policeimage}
            isSelected={showPoliceStations?.length > 0}
          />
          <ActionButton
            onPress={onPublicPlacesPress}
            title="Public Places"
            icon={images.policeimage}
            isSelected={false}
          />
        </View>

        <Text style={styles.sectionTitle}>Location</Text>
        <View style={styles.buttonRow}>
          <ActionButton
            onPress={onCenterPress}
            title="Center on Me"
            icon={images.centeronme}
            isSelected={false}
          />
        </View>

        <Text style={styles.sectionTitle}>Routes</Text>
        <View style={[styles.buttonRow, styles.lastButtonRow]}>
          <ActionButton
            onPress={() => {
              setroutetype(routetype === 'lighting' ? null : 'lighting');
              // onBestLightestRoutePress?.();
            }}
            title={getRouteTitle('lighting')}
            icon={images.lightroute}
            isSelected={routetype === 'lighting'}
          />
          <ActionButton
            onPress={() => {
              setroutetype(routetype === 'fast' ? null : 'fast');
              // onFastestRoutePress?.();
            }}
            title={getRouteTitle('fast')}
            icon={images.fastestroute}
            isSelected={routetype === 'fast'}
          />
          <ActionButton
            onPress={() => {
              setroutetype(routetype === 'safe' ? null : 'safe');
              // onsaferoutepress?.();
            }}
            title={getRouteTitle('safe')}
            icon={images.saferoute}
            isSelected={routetype === 'safe'}
          />
          <ActionButton
            onPress={() => {
              setroutetype(routetype === 'crime' ? null : 'crime');
              
            }}
            title={getRouteTitle('crime')}
            icon={images.saferoute}
            isSelected={routetype === 'crime'}
          />
        </View>
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#161622',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  },
  handle: {
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
  },
  handleText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    marginTop: 8,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 16,
    letterSpacing: 0.3,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  lastButtonRow: {
    marginBottom: 30,
  },
  actionButton: {
    width: '48%',
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  actionButtonContent: {
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  actionButtonIcon: {
    width: 24,
    height: 24,
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
    letterSpacing: 0.3,
  },
});

export default BottomSheet;