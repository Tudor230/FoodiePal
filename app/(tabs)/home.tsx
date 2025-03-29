import { Image, StyleSheet, Platform, TouchableOpacity, FlatList } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import {MapPin} from '@/components/ui/MapPin';
import { Card, Title, Paragraph, Avatar } from 'react-native-paper';

type Restaurant = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address?: string;
}

export default function HomeScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);
  const mapRef = useRef<MapView>(null);
  const markerRefs = useRef<{ [key: string]: any }>({});
  const flatListRef = useRef<FlatList>(null);

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
  
  const selectRestaurant = (restaurantId: string) => {
    setSelectedRestaurantId(restaurantId);
    
    const restaurant = restaurants.find(r => r.id === restaurantId);
    if (restaurant && mapRef.current) {
      // Animate to the restaurant location
      mapRef.current.animateToRegion({
        latitude: restaurant.latitude,
        longitude: restaurant.longitude,
        latitudeDelta: 0.001,
        longitudeDelta: 0.001,
      }, 1000);
      
      // Show the callout for the marker
      setTimeout(() => {
        if (markerRefs.current[restaurantId]) {
          markerRefs.current[restaurantId].showCallout();
        }
      }, 1100);
      
      // Scroll to the restaurant card in the FlatList
      const index = restaurants.findIndex(r => r.id === restaurantId);
      if (index !== -1 && flatListRef.current) {
        flatListRef.current.scrollToIndex({
          index,
          animated: true,
          viewPosition: 0.5 // Center the item
        });
      }
    }
  };
  
  const renderRestaurantCard = ({ item }: { item: Restaurant }) => (
    <Card 
      key={item.id} 
      style={[
        styles.card,
        selectedRestaurantId === item.id && styles.selectedCard
      ]}
    >
      <Card.Content>
        <Title>{item.name}</Title>
        <Paragraph>{item.address || 'No address available'}</Paragraph>
      </Card.Content>
      <Card.Actions>
        <TouchableOpacity 
          style={styles.directionButton}
          onPress={() => selectRestaurant(item.id)}
        >
          <Ionicons name="navigate" size={16} color="#007AFF" />
          <ThemedText style={styles.buttonText}>View on Map</ThemedText>
        </TouchableOpacity>
      </Card.Actions>
    </Card>
  );
  
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
                ref={ref => markerRefs.current[restaurant.id] = ref}
                key={restaurant.id}
                coordinate={{
                  latitude: restaurant.latitude,
                  longitude: restaurant.longitude,
                }}
                title={restaurant.name}
                description={restaurant.address}
                pinColor={selectedRestaurantId === restaurant.id ? '#FF3B30' : undefined}
                onPress={() => selectRestaurant(restaurant.id)}
              >
              </Marker>
            ))}
          </MapView>
          
          <TouchableOpacity 
            style={styles.myLocationButton} 
            onPress={goToMyLocation}
          >
            <Ionicons name="locate" size={24} color="#007AFF" />
          </TouchableOpacity>
          
          <FlatList
            ref={flatListRef}
            data={restaurants}
            renderItem={renderRestaurantCard}
            keyExtractor={item => item.id}
            style={styles.scrollView}
            onScrollToIndexFailed={info => {
              // Handle scroll failure
              setTimeout(() => {
                if (flatListRef.current) {
                  flatListRef.current.scrollToIndex({
                    index: info.index,
                    animated: true
                  });
                }
              }, 100);
            }}
          />
        </>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 80,
  },
  map: {
    width: '100%',
    height: '40%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  myLocationButton: {
    position: 'absolute',
    top: 250,
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
  scrollView: {
    flex: 1,
    width: '100%',
  },
  card: {
    margin: 8,
    elevation: 4,
  },
  directionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  buttonText: {
    marginLeft: 4,
    color: '#007AFF',
  },
  callout: {
    padding: 8,
    maxWidth: 200,
  },
  calloutTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  selectedCard: {
    borderColor: '#007AFF',
    borderWidth: 2,
  },
});
