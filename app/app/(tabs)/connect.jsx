import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  TextInput,
  Platform,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';

const initialConnections = [
  {
    id: '1',
    name: 'Siddhant Vishnu',
    phone: '9545572005',
    trusted: true,
  },
  {
    id: '2',
    name: 'Darshan',
    phone: '9529868652',
    trusted: true,
  },
];

const suggestedUsers = [
  {
    id: '3',
    name: 'Shardul nalgave',
    phone: '8308802211',
    mutual: 3,
  },
  {
    id: '4',
    name: 'Shlok',
    phone: '9579815842',
    mutual: 2,
  },
];

const ConnectionsScreen = () => {
  const [connections, setConnections] = useState(initialConnections);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getCurrentLocation = async () => {
    try {
      const enabled = await Location.hasServicesEnabledAsync();
      if (!enabled) {
        throw new Error('Location services are disabled');
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Location permission denied');
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        maximumAge: 10000,
        timeout: 5000
      });

      return location;
    } catch (error) {
      console.error('Error getting location:', error);
      throw error;
    }
  };

  const sendSOSMessage = async (phoneNumbers) => {
    try {
      const location = await Promise.race([
        getCurrentLocation(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Location timeout')), 10000)
        )
      ]);

      let message = "EMERGENCY SOS! I need immediate assistance!";
      
      if (location) {
        const { latitude, longitude } = location.coords;
        message += `\n\nMy current location: https://www.google.com/maps?q=${latitude},${longitude}`;
      } else {
        message += "\n\nLocation information unavailable";
      }

      
      const separator = Platform.OS === 'ios' ? '&' : '?';
      const phoneNumberString = phoneNumbers.join(',');
      const encodedMessage = encodeURIComponent(message);
      const url = `sms:${phoneNumberString}${separator}body=${encodedMessage}`;

      const supported = await Linking.canOpenURL(url);
      if (!supported) {
        throw new Error('SMS not supported on this device');
      }

      await Linking.openURL(url);
      return true;
    } catch (error) {
      console.error('Error in sendSOSMessage:', error);
      throw error;
    }
  };

  const sendSOS = async (connection) => {
    setIsLoading(true);
    try {
      await sendSOSMessage([connection.phone]);
      
    } catch (error) {
      Alert.alert(
        'Error',
        error.message || 'Failed to open SMS app. Please try again.',
        [
          { 
            text: 'Try Again',
            onPress: () => sendSOS(connection)
          },
          {
            text: 'Cancel',
            style: 'cancel'
          }
        ]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const sendSOSToAll = async () => {
    setIsLoading(true);
    try {
      const phoneNumbers = connections.map(conn => conn.phone);
      await sendSOSMessage(phoneNumbers);
    } catch (error) {
      Alert.alert(
        'Error',
        error.message || 'Failed to open SMS app. Please try again.',
        [
          { 
            text: 'Try Again',
            onPress: () => sendSOSToAll()
          },
          {
            text: 'Cancel',
            style: 'cancel'
          }
        ]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const deleteConnection = useCallback((id) => {
    Alert.alert(
      'Delete Connection',
      'Are you sure you want to remove this connection?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setConnections(prev => prev.filter(conn => conn.id !== id));
          },
        },
      ]
    );
  }, []);

  const addConnection = useCallback((user) => {
    if (!connections.find(conn => conn.id === user.id)) {
      setConnections(prev => [...prev, { ...user, trusted: true }]);
      Alert.alert('Success', 'Connection added successfully!');
    }
  }, [connections]);

  const renderConnectionItem = useCallback(({ item }) => (
    <View className="flex-row items-center justify-between bg-gray-800 p-4 rounded-xl mb-3">
      <View className="flex-row items-center flex-1">
        <View className="w-12 h-12 bg-blue-500 rounded-full items-center justify-center">
          <Text className="text-white text-xl font-bold">
            {item.name.charAt(0)}
          </Text>
        </View>
        <View className="ml-3 flex-1">
          <Text className="text-white font-semibold text-lg">{item.name}</Text>
          <Text className="text-gray-400">{item.phone}</Text>
        </View>
      </View>
      <View className="flex-row items-center">
        <TouchableOpacity
          onPress={() => sendSOS(item)}
          disabled={isLoading}
          className="bg-red-500 rounded-full p-2 mr-2"
        >
          {isLoading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <MaterialIcons name="sos" size={24} color="white" />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => deleteConnection(item.id)}
          className="bg-gray-700 rounded-full p-2"
        >
          <MaterialIcons name="delete" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  ), [isLoading, sendSOS, deleteConnection]);

  const renderSuggestedItem = useCallback(({ item }) => (
    <View className="flex-row items-center justify-between bg-gray-800 p-4 rounded-xl mb-3">
      <View className="flex-row items-center flex-1">
        <View className="w-12 h-12 bg-gray-600 rounded-full items-center justify-center">
          <Text className="text-white text-xl font-bold">
            {item.name.charAt(0)}
          </Text>
        </View>
        <View className="ml-3 flex-1">
          <Text className="text-white font-semibold text-lg">{item.name}</Text>
          <Text className="text-gray-400">{item.mutual} mutual connections</Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => addConnection(item)}
        className="bg-blue-500 rounded-full p-2"
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  ), [addConnection]);

  const filteredConnections = connections.filter(conn => 
    conn.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSuggestions = suggestedUsers.filter(user => 
    !connections.find(conn => conn.id === user.id)
  );


    return (
      <SafeAreaView className="flex-1 bg-gray-900">
        <StatusBar style="light" />
        
        <View className="p-4 flex-1">
          <Text className="text-white text-3xl font-bold mb-6">Safey</Text>
          
        
          
          {/* Search Bar */}
          <View className="bg-gray-800 rounded-full px-4 py-2 mb-6 flex-row items-center">
            <Ionicons name="search" size={20} color="gray" />
            <TextInput
              placeholder="Search connections..."
              placeholderTextColor="gray"
              className="ml-2 flex-1 text-white"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
  
          {/* Trusted Connections */}
          <Text className="text-white text-xl font-semibold mb-4">
            Trusted Connections
          </Text>
          <FlatList
            data={connections.filter(conn => 
              conn.name.toLowerCase().includes(searchQuery.toLowerCase())
            )}
            renderItem={renderConnectionItem}
            keyExtractor={item => item.id}
            className="mb-6"
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Text className="text-gray-400 text-center">No trusted connections found</Text>
            }
          />
  
          
          <Text className="text-white text-xl font-semibold mb-4">
            Suggested Connections
          </Text>
          <FlatList
            data={suggestedUsers.filter(user => 
              !connections.find(conn => conn.id === user.id)
            )}
            renderItem={renderSuggestedItem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Text className="text-gray-400 text-center">No suggestions available</Text>
            }
          />
          {/* <TouchableOpacity
            onPress={sendSOSToAll}
            disabled={isLoading}
            className="bg-red-500 rounded-xl p-4 mb-6 items-center"
          >
            {isLoading ? (
              <ActivityIndicator color="white" size="large" />
            ) : (
              <Text className="text-white text-xl font-bold">
                SEND SOS TO ALL CONTACTS
              </Text>
            )}
          </TouchableOpacity> */}
        </View>
      </SafeAreaView>
    );
  
};

export default ConnectionsScreen;