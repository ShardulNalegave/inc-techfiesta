import React from 'react';
import { TextInput, ScrollView, TouchableOpacity, Text,View } from 'react-native';

const SearchInput = ({ searchText, handleSearchTextChange, showSearchResults, searchResults, handleLocationSelect }) => {
  return (
    <View className="absolute top-4 left-4 right-4 z-20">
      <TextInput
        className="px-5 py-3 bg-[#e1f5fe] rounded-full border border-[#81d4fa] text-base text-[#37474f] shadow-sm"
        placeholder="Search for a location..."
        placeholderTextColor="#a9a9a9"
        value={searchText}
        onChangeText={handleSearchTextChange}
        onFocus={() => setShowSearchResults(true)}
      />
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

export default SearchInput;
