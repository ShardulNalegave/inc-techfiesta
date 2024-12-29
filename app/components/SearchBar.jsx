import React from 'react';
import {
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Text,
  Button,
} from 'react-native';

const SearchLocationInput = ({
  searchText,
  handleSearchTextChange,
  setShowSearchResults,
  showSearchResults,
  searchResults,
  handleLocationSelect,
  fetchRoute,
}) => {
  return (
    <View className="z-20 flex-col">
      <View className="z-20 flex-row">
        <View className="flex-1 flex-row items-center justify-center">
          <TextInput
            className="px-5 py-3 bg-[#e1f5fe] rounded-full border border-[#81d4fa] text-base text-[#37474f] shadow-sm w-4/5"
            placeholder="Search for a location..."
            placeholderTextColor="#a9a9a9"
            value={searchText}
            onChangeText={handleSearchTextChange}
            onFocus={() => setShowSearchResults(true)}
          />

          <View className="items-center rounded-lg bg-primary">
            <Button
              title="Get Route"
              onPress={fetchRoute}
              className="rounded-lg bg-primary"
            />
          </View>
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
  );
};

export default SearchLocationInput;
