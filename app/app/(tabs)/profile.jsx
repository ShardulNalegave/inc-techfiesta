import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Alert, TextInput, Dimensions, ActivityIndicator, Modal } from 'react-native';
import { SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import image from '../../assets/images/mainlogo.png';
import { useRecoilState } from 'recoil';
import { isloggedd, userstate } from '../../constants/atoms';
import { router } from 'expo-router';

const UserProfile = () => {
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(isloggedd);
  const [userdata, setuserdata] = useRecoilState(userstate);
  const { width } = Dimensions.get("window");

  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState(userdata?.username);
  const [newPhoneNo, setNewPhoneNo] = useState(userdata?.phoneNo);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      setuserdata(false);
      setIsLoggedIn(false);
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('userData');
      Alert.alert('Success', 'You have been logged out.');
      router.replace("/login");
    } catch (error) {
      Alert.alert('Error', 'Failed to log out. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    if (!/^\d{10}$/.test(newPhoneNo)) {
      Alert.alert('Error', 'Please enter a valid phone number.');
      return;
    }

    try {
      setLoading(true);
      const updatedUserData = {
        ...userdata,
        username: newUsername,
        phoneNo: newPhoneNo
      };
      
      setuserdata(updatedUserData); 
      await AsyncStorage.setItem('userData', JSON.stringify(updatedUserData)); 

      setIsEditing(false); 
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black justify-center items-center">
      <ScrollView className="flex-1">
        <View className='h-screen justify-center items-center'>
          <View className="items-center justify-center">
            <Text style={{
              fontSize: 50, 
              fontWeight: '800', 
              color: 'rgb(135, 206, 235)', 
            }}>Safey!</Text>
          </View>
          <View className="items-center mt-12">
            <Image
              source={image}
              className="w-32 h-32 rounded-full border-4 border-blue-500"
              resizeMode="cover"
            />
            {isEditing ? (
              <>
                <TextInput
                  value={newUsername}
                  onChangeText={setNewUsername}
                  className="text-xl font-semibold mt-4 text-white border-b border-blue-500"
                  placeholder="Enter new username"
                  placeholderTextColor="gray"
                />
                <TextInput
                  value={newPhoneNo}
                  onChangeText={setNewPhoneNo}
                  className="text-base text-white border-b border-blue-500 mt-2"
                  placeholder="Enter new phone number"
                  placeholderTextColor="gray"
                  keyboardType="phone-pad"
                />
              </>
            ) : (
              <>
                <Text className="text-xl font-semibold mt-4 text-white">{userdata?.username}</Text>
                <Text className="text-base text-gray-400">{userdata?.email}</Text>
                <Text className="text-base text-gray-500">{userdata?.phoneNo}</Text>
              </>
            )}
          </View>

          <View className="mt-8 w-screen">
            <TouchableOpacity
              className="py-4 border-b border-gray-700"
              onPress={() => setIsEditing(!isEditing)}
            >
              <Text className="text-lg text-blue-400">{isEditing ? 'Cancel' : 'Edit Profile'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="py-4 border-b border-gray-700"
              onPress={() => setIsModalVisible(true)}
            >
              <Text className="text-lg text-blue-400">Terms and Conditions</Text>
            </TouchableOpacity>
          </View>

          {isEditing && (
            <TouchableOpacity
              style={{ width: width * 0.8 }}
              className="mt-10 py-4 bg-blue-600 rounded-lg items-center"
              onPress={handleSaveChanges}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text className="text-lg text-white font-bold">Save Changes</Text>
              )}
            </TouchableOpacity>
          )}

          {!isEditing && (
            <TouchableOpacity
              style={{ width: width * 0.8 }}
              className="mt-10 py-4 bg-red-600 rounded-lg items-center"
              onPress={handleLogout}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text className="text-lg text-white font-bold">Logout</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-70">
          <View className="bg-black p-6 rounded-lg w-4/5">
            <Text className="text-2xl font-bold text-blue-400 mb-4">Terms and Conditions</Text>
            <ScrollView className="max-h-96">
              <Text className="text-base text-white">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </Text>
            </ScrollView>
            <TouchableOpacity
              className="mt-4 bg-blue-600 py-2 rounded-lg items-center"
              onPress={() => setIsModalVisible(false)}
            >
              <Text className="text-white font-bold">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default UserProfile;
