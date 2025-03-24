import { Image, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { useAuthContext } from "@/app/context/AuthContext";
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import MapView, { Marker } from 'react-native-maps';
import { Redirect } from 'expo-router';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import {MapPin} from '@/components/ui/MapPin';

type Restaurant = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address?: string;
}

export default function HomeScreen() {
  const { user, loading } = useAuthContext();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    async function getCurrentLocation() {
      setLocationLoading(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        setLocationLoading(false);
        return;
      }
      try {
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        fetchNearbyRestaurants(location.coords.latitude, location.coords.longitude);
      } catch (error) {
        console.error('Error getting location:', error);
      } finally {
        setLocationLoading(false);
      }
    }
    getCurrentLocation();
  }, []);

  const fetchNearbyRestaurants = async (latitude: number, longitude: number) => {
    try{
        const apiKey = process.env.EXPO_PUBLIC_GEOAPIFY_KEY;
        const radius = 1000;
        const limit = 40;
        const url = `https://api.geoapify.com/v2/places?categories=catering&filter=circle:${longitude},${latitude},${radius}&limit=${limit}&bias=proximity:${longitude},${latitude}&apiKey=${apiKey}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.features) {
            const restaurants: Restaurant[] = data.features.map((feature: any) => ({
                id: feature.properties.place_id,
                name: feature.properties.name,
                latitude: feature.geometry.coordinates[1],
                longitude: feature.geometry.coordinates[0],
                address: feature.properties.address_line2,
            }));
            setRestaurants(restaurants);
        }
    } catch (error) {
        console.error('Error fetching nearby restaurants:', error);
    }
  }
  
  // Wait for authentication to complete before deciding what to render
  if (loading) {
    return null; // Show nothing while loading
  }
  
  if (!user) {
    return <Redirect href="/(auth)/start"/>
  }
  
  const goToMyLocation = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
    }
  };
  
  return (
    <ThemedView style={styles.container}>
      {locationLoading ? (
        <ThemedView style={styles.loadingContainer}>
          <ThemedText>Loading map...</ThemedText>
        </ThemedView>
      ) : (
        <>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              latitude: location?.coords.latitude || 37.78825,
              longitude: location?.coords.longitude || -122.4324,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            showsUserLocation={true}
          >
            {restaurants.map((restaurant) => (
              <Marker
                key={restaurant.id}
                coordinate={{
                  latitude: restaurant.latitude,
                  longitude: restaurant.longitude,
                }}
                title={restaurant.name}
                description={restaurant.address}
              />
              // Custom map marker
              // <Marker
              //   key={restaurant.id}
              //   coordinate={{
              //     latitude: restaurant.latitude,
              //     longitude: restaurant.longitude,
              //   }}
              //   title={restaurant.name}
              //   description={restaurant.address}
              // >
              //   <MapPin/>
              // </Marker>
            ))}
          </MapView>
          <TouchableOpacity 
            style={styles.myLocationButton} 
            onPress={goToMyLocation}
          >
            <Ionicons name="locate" size={24} color="#007AFF" />
          </TouchableOpacity>
        </>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  myLocationButton: {
    position: 'absolute',
    bottom: 100,
    right: 16,
    backgroundColor: 'white',
    borderRadius: 30,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
