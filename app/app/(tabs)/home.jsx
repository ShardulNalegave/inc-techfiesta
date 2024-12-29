import React, { useState, useEffect, useRef } from 'react';
import { Image } from 'react-native';
import BottomSheet from '@/components/Buttontemp';
import LoadingOverlay from '../../components/mainloading'
import Maptemm from '../../components/MapViewComponent'

import { 
  StyleSheet, 
  View, 
  Alert, 
  ActivityIndicator,
  Button, 
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView 
} from 'react-native';

import { icons } from '@/constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE, UrlTile } from 'react-native-maps';
import * as Location from 'expo-location';
import { useRecoilState } from 'recoil';
import { userLocationatom, userstate } from '@/constants/atoms';
import debounce from 'lodash/debounce';
import {ROUTESFetch, safeMapStyle} from '../../constants/func'

const MapComponent = () => {
  const [userLocation, setUserLocation] = useRecoilState(userLocationatom);
  // const[mapRegion,setMapRegion]=useRecoilState()
  const [mapRegion, setMapRegion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mapReady, setMapReady] = useState(false);
  const[policeloading,setpoliceLoading]=useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [showRoutes, setShowRoutes] = useState([]);
  const [waypoints, setWaypoints] = useState([]);
  const[policestations,setpolicestations]=useState([]);
  const mapRef = useRef(null);
  const [markers, setMarkers] = useState([]);
  const [destination, setDestination] = useState(null);

  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  const api = "23a0d5e795ac4090a71535c0fdcc3f86"; 
  // const fetchNearbyPlaces = async (latitude, longitude) => {
  //   try {
  //     const response = await fetch(
  //       `https://api.geoapify.com/v2/places?categories=commercial.shopping_mall,commercial.supermarket,commercial.shop&filter=circle:${longitude},${latitude},5000&limit=3&apiKey=${api}`
  //     );
  //     const data = await response.json();

  //     if (data.features) {
  //       const newWaypoints = data.features.map(feature => ({
  //         latitude: feature.properties.lat,
  //         longitude: feature.properties.lon,
  //         name: feature.properties.name || 'Unnamed Location'
  //       }));
  //       setWaypoints(newWaypoints);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching nearby places:', error);
  //     Alert.alert('Error', 'Failed to fetch nearby locations');
  //   }
  // };
  const fetchRoute = async () => {
    if (userLocation && destination) {
      await fetchRouteBetweenLocations(
        { latitude: userLocation.latitude, longitude: userLocation.longitude },
        destination
      );
    }
  };


const fetchpolice = async (latitude, longitude) => {
    try {
      if(policestations.length>0){
        setpolicestations([])
        return
      }
      const response = await fetch(
        `https://api.geoapify.com/v2/places?categories=service.police&filter=circle:${longitude},${latitude},10000&limit=10&apiKey=${api}`
      );
      const data = await response.json();
      console.log(data)
      if (data.features) {
        const newWaypoints = data.features.map(feature => ({
          latitude: feature.properties.lat,
          longitude: feature.properties.lon,
          name: feature.properties.name || 'Unnamed Police Station',
        }));
      if(policestations.length>0){
        setpolicestations([])
      }
      else{
        setpolicestations(newWaypoints);
      }
        console.log('Nearby Police Stations:', newWaypoints);
      } else {
        Alert.alert('No Police Stations Found', 'No police stations were found near this location.');
      }
    } catch (error) {
      console.error('Error fetching nearby police stations:', error);
      Alert.alert('Error', 'Failed to fetch nearby police stations');
    }

  };
  

  const searchPlaces = async (text) => {
    if (!text) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(text)}&apiKey=${api}`
      );
      const data = await response.json();

      if (data.features) {
        const formattedResults = data.features.map(feature => ({
          name: feature.properties.formatted,
          latitude: feature.properties.lat,
          longitude: feature.properties.lon,
        }));
        setSearchResults(formattedResults);
        setShowSearchResults(true);
      }
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const debouncedSearch = debounce(searchPlaces, 300);

  const handleSearchTextChange = (text) => {
    setSearchText(text);
    debouncedSearch(text);
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setSearchText(location.name);
    setShowSearchResults(false);
  
    const newRegion = {
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    };
    setMapRegion(newRegion);
    mapRef.current?.animateToRegion(newRegion, 1000);
  
    // Save destination for later use
    setDestination({
      latitude: location.latitude,
      longitude: location.longitude,
    });
  };
  

const fetchRouteBetweenLocations = async (startLocation, endLocation) => {
  setIsLoading(true);
  try {
    const type="safest route"
    const predefinedPlaces = await ROUTESFetch(startLocation,endLocation,type)

    const allPoints = [
      { ...startLocation, name: "Start Location" },
      ...predefinedPlaces,
      { ...endLocation, name: "End Location" },
    ];

    const coordinates = allPoints
      .map(point => `${point.longitude},${point.latitude}`)
      .join(';');

    const response = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson&steps=true`
    );
    const data = await response.json();

    if (data.routes && data.routes[0]) {
      const newRoute = data.routes[0].geometry.coordinates.map(([longitude, latitude]) => ({
        latitude,
        longitude,
      }));
      setShowRoutes([newRoute]);

      if (mapRef.current && newRoute.length > 0) {
        mapRef.current.fitToCoordinates(newRoute, {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        });
      }

      const distance = (data.routes[0].distance / 1000).toFixed(2); 
      const duration = Math.round(data.routes[0].duration / 60); 
      console.log(`Total distance: ${distance}km, Duration: ${duration}min`);

      setMarkers(allPoints);
    } else {
      Alert.alert('Error', 'No route found between these locations');
    }
  } catch (error) {
    console.error('Routing error:', error);
    Alert.alert('Error', 'Failed to fetch route. Please try again.');
  }
  setIsLoading(false);
};



const policecover = async () => {
  try {
    setpoliceLoading(true);
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Please enable location services');
      setpoliceLoading(false);
      return;
    }

    const { coords } = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
      maximumAge: 10000,
      timeout: 5000
    });

    if (coords && coords.latitude && coords.longitude) {
      console.log(coords);

      const newRegion = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05
      };

      await fetchpolice(coords.latitude, coords.longitude);
    } else {
      
      Alert.alert('Location Error', 'Could not retrieve location coordinates');
    }
  } catch (error) {
    console.log(error);
    Alert.alert('Error', 'Could not fetch location');
  } finally {
    setpoliceLoading(false);
  }
};


const getLocation = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Please enable location services');
      setLoading(false);
      return;
    }

    const { coords } = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
      maximumAge: 10000,
      timeout: 5000
    });

    if (coords && coords.latitude && coords.longitude) {
      console.log(coords);

      const newRegion = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05
      };

      setUserLocation(coords);
      setMapRegion(newRegion);
    } else {
      console.log(error)
      Alert.alert('Location Error', 'Could not retrieve location coordinates');
    }
    
  } catch (error) {
    console.log(error);
    Alert.alert('Error', 'An error occurred while fetching location');
  } finally {
    setLoading(false);
  }
};


const centerOnUser = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }, 1000);
    }
  };

  useEffect(() => {
    const initializeMap = async () => {
      await getLocation();
    };

    initializeMap();
    
    const locationSubscription = Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 5000,
        distanceInterval: 10
      },
      (location) => {
        setUserLocation(location.coords);
      }
      
    );
    return () => {
      if (locationSubscription) {
        locationSubscription.then(sub => sub.remove());
      }
    };
  }, []);
 
  

  return (
      <SafeAreaView className="flex-1">
    <View className="flex-1 bg-black">
    <View className="z-20 flex-col p-5">

  <View className="z-20 flex-row items-center space-x-4">
    <TextInput
      className="px-5 py-3 bg-[#e1f5fe] rounded-full border border-[#81d4fa] text-base text-[#37474f] shadow-sm w-4/5"
      placeholder="Search for a location..."
      placeholderTextColor="#a9a9a9"
      value={searchText}
      onChangeText={handleSearchTextChange}
      onFocus={() => setShowSearchResults(true)}
    />
    <View className="flex-1">
      <TouchableOpacity
        onPress={fetchRoute}
        style={{
          backgroundColor: '#0288d1',
          borderRadius: 50,
          paddingVertical: 12,
          paddingHorizontal: 20,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Image
          source={icons.search}
          style={{ width: 12, height: 12 }}
          />
  
      </TouchableOpacity>
    </View>
  </View>

  {showSearchResults && searchResults.length > 0 && (
            <ScrollView className="left-0 right-0 max-h-[200px] mx-4 px-5 py-3 bg-black rounded-lg shadow border border-[#81d4fa] z-30">
              {searchResults.map((result, index) => (
                <TouchableOpacity
                key={index}
                className="p-3 border-b border-[#cfd8dc]"
                onPress={() => handleLocationSelect(result)}
                >
                  <Text numberOfLines={1} className="text-[#eaeaea]">
                    {result.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
</View>
<View style={{ flex: 1 }}>
      <Maptemm
        mapRegion={mapRegion}
        waypoints={waypoints}
        selectedLocation={selectedLocation}
        policestations={policestations}
        showRoutes={showRoutes}
        markers={markers}
        mapRef={mapRef}
        setMapRegion={setMapRegion}
        setMapReady={setMapReady}
      />
     
    </View>
        <LoadingOverlay isVisible={isLoading} message="Finding the best route..." />
      <LoadingOverlay isVisible={loading} message="Getting your location..." />
      <LoadingOverlay isVisible={policeloading} message="Getting the police stations..." />
  
      <BottomSheet
      onPolicePress={policecover}
      onCenterPress={centerOnUser}
      showPoliceStations={policestations}/>
    </View>
      </SafeAreaView>
  );
  
};
export default MapComponent;
















