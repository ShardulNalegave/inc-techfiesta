import React, { useState, useEffect, useRef } from 'react';
import { Image } from 'react-native';
import BottomSheet from '@/components/Buttontemp';
import LoadingOverlay from '../../components/mainloading'
import Maptemm from '../../components/MapViewComponent'
import axios from 'axios';

import {

  View,
  Alert,

  Text,
  TouchableOpacity,
  TextInput,
  ScrollView
} from 'react-native';

import { icons } from '@/constants';
import { SafeAreaView } from 'react-native-safe-area-context';

import * as Location from 'expo-location';
import { useRecoilState } from 'recoil';
import { userLocationatom, userstate } from '@/constants/atoms';
import debounce from 'lodash/debounce';
import { ROUTESFetch, safeMapStyle } from '../../constants/func'

const MapComponent = () => {
  const [userLocation, setUserLocation] = useRecoilState(userLocationatom);
  const [mapRegion, setMapRegion] = useState(null);
  const [routetype,setroutetype]=useState("safe");
  const [loading, setLoading] = useState(true);
  const [mapReady, setMapReady] = useState(false);
  const [policeloading, setpoliceLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showRoutes, setShowRoutes] = useState([]);
  const [waypoints, setWaypoints] = useState([]);
  const [policestations, setpolicestations] = useState([]);
  const mapRef = useRef(null);
  const [markers, setMarkers] = useState([]);
  const [destination, setDestination] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [temp, settemp] = useState(null)
  const [startLocationText, setStartLocationText] = useState('');
  const [startLocationResults, setStartLocationResults] = useState([]);
  const [showStartLocationResults, setShowStartLocationResults] = useState(false);
  const [startLocation, setStartLocation] = useState(null);

  const api = "23a0d5e795ac4090a71535c0fdcc3f86";

  const searchPlaces = async (text, setResults) => {
    if (!text) {
      setResults([]);
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
        setResults(formattedResults);
      }
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const debouncedSearch = debounce(searchPlaces, 300);

  const handleSearchTextChange = (text) => {
    setSearchText(text);
    debouncedSearch(text, setSearchResults);
    setShowSearchResults(true);
  };

  const handleStartLocationSearch = (text) => {
    setStartLocationText(text);
    debouncedSearch(text, setStartLocationResults);
    setShowStartLocationResults(true);
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setSearchText(location.name);
    setShowSearchResults(false);
    setDestination({
      latitude: location.latitude,
      longitude: location.longitude,
    });
  };

  const handleStartLocationSelect = (location) => {
    settemp(location)
    setStartLocation({
      latitude: location.latitude,
      longitude: location.longitude,
    });
    setStartLocationText(location.name);
    setShowStartLocationResults(false);
  };

  const fetchRoute = async () => {
    if (!startLocation || !destination) {
      Alert.alert('Missing Location', 'Please select both start and end locations');
      return;
    }
    await fetchRouteBetweenLocations(startLocation, destination);
  };

  const fetchpolice = async (latitude, longitude) => {
    try {
      if (policestations.length > 0) {
        setpolicestations([]);
        return;
      }
      setpoliceLoading(true);
      const response = await fetch(
        `https://api.geoapify.com/v2/places?categories=service.police&filter=circle:${longitude},${latitude},10000&limit=10&apiKey=${api}`
      );
      const data = await response.json();
      if (data.features) {
        const newWaypoints = data.features.map(feature => ({
          latitude: feature.properties.lat,
          longitude: feature.properties.lon,
          name: feature.properties.name || 'Unnamed Police Station',
        }));
        setpolicestations(newWaypoints);
      }
    } catch (error) {
      console.error('Error fetching police stations:', error);
      Alert.alert('Error', 'Failed to fetch police stations');
    } finally {
      setpoliceLoading(false);
    }
  };

  const transformPathData = (apiResponse) => {
    return apiResponse.map((entry) => {
      const position = entry._fields[1]; // Accessing the "position" field
      return {
        latitude: position.y,
        longitude: position.x,
      };
    });
  };

  const fetchRouteBetweenLocations = async (startLocation, endLocation) => {
    setIsLoading(true);
    try {
      // const type = "safest route";
      // console.log(startLocation)
      //const predefinedPlaces = await ROUTESFetch(startLocation, endLocation, type);

      const allPoints = [
        { ...startLocation, name: "Start Location" },
        //...predefinedPlaces,
        { ...endLocation, name: "End Location" },
      ];
      if (routetype === "fast") {
        try {
          const coordinates = allPoints
            .map(point => `${point.longitude},${point.latitude}`)
            .join(';');
  
          const response = await fetch(
            `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson&steps=true`
          );
  
          if (!response.ok) {
            throw new Error("Failed to fetch the fast route");
          }
  
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
  
            setMarkers(allPoints);
            setIsLoading(false);
          } else {
            Alert.alert('Error', 'No route found between these locations');
          }
          return;
        } catch (error) {
          console.error("Fast route error:", error);
          Alert.alert("Error", "Failed to fetch the fast route");
          setIsLoading(false);
          return;
        }
      }

      const coordinates = allPoints.map(point => [point.latitude, point.longitude]);

      console.log(coordinates);

      /* const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson&steps=true`
      );
      const data = await response.json(); */
      console.log(routetype)
      const roadNearStartResponse = await axios.get(`http://192.168.29.208:8000/roads/roadByProximity?latitude=${coordinates[0][0]}&longitude=${coordinates[0][1]}&type=${routetype}`);
      const roadNearEndResponse = await axios.get(`http://192.168.29.208:8000/roads/roadByProximity?latitude=${coordinates[1][0]}&longitude=${coordinates[1][1]}&type=${routetype}`);

      // Extract data
      const roadNearStartData = roadNearStartResponse.data;
      const roadNearEndData = roadNearEndResponse.data;

      // Access the osmid property
      const roadNearStartOsmIds = roadNearStartData.map(road => road.properties.osmid);
      const roadNearEndOsmIds = roadNearEndData.map(road => road.properties.osmid);

      console.log('Start OsmIDs:', roadNearStartOsmIds);
      console.log('End OsmIDs:', roadNearEndOsmIds);

      // Extract Road IDs
      const startId = roadNearStartOsmIds[0].low != 0 ? roadNearStartOsmIds[0].low : roadNearStartOsmIds[0].high;
      const endId = roadNearEndOsmIds[0].low != 0 ? roadNearEndOsmIds[0].low : roadNearEndOsmIds[0].high;

      const routeData = await axios.get(`http://192.168.29.208:8000/roads/dijkstraWithLogs?startId=${startId}&endId=${endId}`);

      if (routeData.data && routeData.data.length > 0) {

        // Use transformPathData to format the API response
        const newRoute = transformPathData(routeData.data);

        console.log(newRoute);

        setShowRoutes([newRoute]);

        if (mapRef.current && newRoute.length > 0) {
          mapRef.current.fitToCoordinates(newRoute, {
            edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
            animated: true,
          });
        }

        // Optionally set markers if needed
        setMarkers(newRoute);
      }
      else {
        Alert.alert('Error', 'No route found between these locations');
      }
    } catch (error) {
      console.error('Routing error:', error);
      Alert.alert('Error', 'Failed to fetch route');
    }
    setIsLoading(false);
  };

  const policecover = async () => {
    try {
      if (!startLocation) {
        Alert.alert('Error', 'Please select a starting location first');
        return;
      }
      await fetchpolice(startLocation.latitude, startLocation.longitude);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not fetch police stations');
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
      });

      setUserLocation(coords);
      setMapRegion({
        latitude: 22.5726,
        longitude: 88.3639,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05
      }
      );
    } catch (error) {
      Alert.alert('Error', 'Could not fetch location');
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
    getLocation();

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
      locationSubscription.then(sub => sub.remove());
    };
  }, []);

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 bg-gray-900">
        <View className="z-20 p-4 bg-gray-800/95 backdrop-blur-xl border-b border-gray-700" style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5
        }}>
          <Text className="text-blue-400 text-xl font-bold mb-4">Plan Your Journey</Text>

          <View className="flex-row items-center space-x-3 mb-4">
            <View className="flex-1 relative">
              <View className="absolute left-3 top-3 z-10">
                <View className="w-6 h-6 rounded-full bg-blue-600 items-center justify-center" style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.2,
                  shadowRadius: 1.41,
                  elevation: 2
                }}>
                  <Text className="text-white text-sm font-bold">A</Text>
                </View>
              </View>
              <TextInput
                className="w-full pl-12 pr-4 py-3.5 bg-gray-700/90 rounded-2xl border border-gray-600/50 text-base text-gray-100"
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5
                }}
                placeholder="Enter starting point..."
                placeholderTextColor="#60A5FA60"
                value={startLocationText}
                onChangeText={handleStartLocationSearch}
                onFocus={() => setShowStartLocationResults(true)}
                autoCorrect={false}
                autoCapitalize="none"
              />
            </View>
          </View>

          <View className="flex-row items-center space-x-3">
            <View className="flex-1 relative">
              <View className="absolute left-3 top-3 z-10">
                <View className="w-6 h-6 rounded-full bg-blue-600 items-center justify-center" style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.2,
                  shadowRadius: 1.41,
                  elevation: 2
                }}>
                  <Text className="text-white text-sm font-bold">B</Text>
                </View>
              </View>
              <TextInput
                className="w-full pl-12 pr-4 py-3.5 bg-gray-700/90 rounded-2xl border border-gray-600/50 text-base text-gray-100"
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5
                }}
                placeholder="Enter destination..."
                placeholderTextColor="#60A5FA60"
                value={searchText}
                onChangeText={handleSearchTextChange}
                onFocus={() => setShowSearchResults(true)}
                autoCorrect={false}
                autoCapitalize="none"
              />
            </View>
            <TouchableOpacity
              onPress={fetchRoute}
              className="bg-blue-600 p-4 rounded-2xl active:bg-blue-700"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5
              }}>
              <Image
                source={icons.search}
                className="w-6 h-6"
                style={{ tintColor: '#ffffff' }}
              />
            </TouchableOpacity>
          </View>

          {showStartLocationResults && startLocationResults.length > 0 && (
            <View className="mt-3 rounded-2xl overflow-hidden bg-gray-800/95 border border-gray-700/50" style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 4.65,
              elevation: 8
            }}>
              <ScrollView className="max-h-[250px]" showsVerticalScrollIndicator={false}>
                {startLocationResults.map((result, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleStartLocationSelect(result)}
                    className={`px-4 py-3.5 flex-row items-center space-x-3 active:bg-gray-700/80
             ${index !== startLocationResults.length - 1 ? 'border-b border-gray-700/50' : ''}`}>
                    <View className="w-8 h-8 rounded-full bg-gray-700/80 items-center justify-center">
                      <Image
                        source={icons.location}
                        className="w-4 h-4"
                        style={{ tintColor: '#60A5FA' }}
                      />
                    </View>
                    <Text className="flex-1 text-gray-100 text-base font-medium" numberOfLines={1}>
                      {result.name || 'Unknown Location'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {showSearchResults && searchResults.length > 0 && (
            <View className="mt-3 rounded-2xl overflow-hidden bg-gray-800/95 border border-gray-700/50" style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 4.65,
              elevation: 8
            }}>
              <ScrollView className="max-h-[250px]" showsVerticalScrollIndicator={false}>
                {searchResults.map((result, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleLocationSelect(result)}
                    className={`px-4 py-3.5 flex-row items-center space-x-3 active:bg-gray-700/80
             ${index !== searchResults.length - 1 ? 'border-b border-gray-700/50' : ''}`}>
                    <View className="w-8 h-8 rounded-full bg-gray-700/80 items-center justify-center">
                      <Image
                        source={icons.location}
                        className="w-4 h-4"
                        style={{ tintColor: '#60A5FA' }}
                      />
                    </View>
                    <Text className="flex-1 text-gray-100 text-base font-medium" numberOfLines={1}>
                      {result.name || 'Unknown Location'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        <View className="flex-1">
          <Maptemm
            mapRegion={mapRegion}
            waypoints={waypoints}
            settempo={temp}
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
          routetype={routetype}
          setroutetype={setroutetype}
          onPolicePress={policecover}
          onCenterPress={centerOnUser}
          showPoliceStations={policestations}
          // onBestLightestRoutePress={onBestLightestRoutePress}
          // oncrimeroutepress={oncrimeroutepress}
        />
      </View>
    </SafeAreaView>
  );



};
export default MapComponent;
















