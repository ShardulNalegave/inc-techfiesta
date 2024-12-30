import React from 'react';
import { Image,View } from 'react-native';
import MapView, { Marker, Polyline, UrlTile } from 'react-native-maps';
import { PROVIDER_GOOGLE } from 'react-native-maps';
import { icons } from '@/constants';
const MapComponent = ({
  settempo,
  mapRegion,
  waypoints,
  selectedLocation,
  policestations,
  showRoutes,
  markers,
  mapRef,
  setMapRegion,
  setMapReady,
}) => {
  return (
    <View className="flex-1">
      {mapRegion && (
        <MapView
          provider={PROVIDER_GOOGLE}
          ref={mapRef}
          style={{ flex: 1 }}
          initialRegion={mapRegion}
          showsUserLocation={true}
          showsCompass={true}
          onMapReady={() => setMapReady(true)}
          onRegionChangeComplete={setMapRegion}
        >
          
          <UrlTile
            urlTemplate="https://api.maptiler.com/maps/streets-v2-dark/256/{z}/{x}/{y}.png?key=SGgBQHHXMhhRIb7IWb4R"
            maximumZ={19}
          />
          
        
          {waypoints.map((point, index) => (
            <Marker
              key={`waypoint-${index}`}
              coordinate={{
                latitude: point.latitude,
                longitude: point.longitude,
              }}
              title={point.name}
              description={`Waypoint ${index + 1}`}
              pinColor="#00ffff"
            />
          ))}

        
          {selectedLocation && (
            <Marker
              coordinate={{
                latitude: selectedLocation.latitude,
                longitude: selectedLocation.longitude,
              }}
              title={selectedLocation.name}
              pinColor="#000000"
            />
          )}
          {settempo && (
            <Marker
              coordinate={{
                latitude: settempo.latitude,
                longitude: settempo.longitude,
              }}
              title={settempo.name}
              pinColor="#000000"
            />
          )}
            
    
          {policestations.length > 0 && policestations.map((data,index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: data.latitude,
                longitude: data.longitude,
              }}
              title={data.name}
            >
              <Image source={icons.police} className="w-10 h-10" />
            </Marker>
          ))}

          
          {showRoutes.map((route, index) => (
            <Polyline
              key={`route-${index}`}
              coordinates={route}
              strokeColor="#00aaff"
              strokeWidth={4}
            />
          ))}

         
{markers.map((marker, index) => {
  const isStartOrEnd = index === 0 || index === markers.length - 1;
  return (
    <Marker
      key={`marker-${index}`}
      coordinate={{
        latitude: marker.latitude,
        longitude: marker.longitude,
      }}
      title={marker.name}
      pinColor={index === 0 ? 'red' : isStartOrEnd ? 'red' : 'blue'}
    />
  );
})}

        </MapView>
      )}
    </View>
  );
};

export default MapComponent;
