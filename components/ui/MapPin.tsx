import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface MapPinProps {
  title?: string;
  selected?: boolean;
  onPress?: () => void;
  importance?: number; // Add importance level (1-5, with 5 being most important)
  zoomLevel?: number; // Current map zoom level
}

export function MapPin({ 
  title, 
  selected = false, 
  onPress, 
  importance = 3, 
  zoomLevel = 15 
}: MapPinProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const isDark = colorScheme === 'dark';
  
  // Determine if the marker should be visible based on zoom level and importance
  const isVisible = shouldShowMarker(zoomLevel, importance);
  
  if (!isVisible) return null;
  
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View style={styles.container}>
        <View style={[
          styles.pin, 
          { backgroundColor: isDark ? Colors.dark.background : Colors.light.background },
          selected && styles.selectedPin,
          getImportanceStyle(importance)
        ]}>
          <IconSymbol 
            name="house.fill"
            size={16} 
            color={selected 
              ? '#FFFFFF' 
              : isDark ? Colors.dark.tint : Colors.light.tint
            } 
          />
        </View>
        <View style={styles.pinBottom} />
        {title && zoomLevel > 14 && (
          <View style={[
            styles.label,
            { backgroundColor: isDark ? Colors.dark.background : Colors.light.background }
          ]}>
            <ThemedText style={styles.labelText} type="defaultSemiBold">
              {title}
            </ThemedText>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

// Helper function to determine if a marker should be shown based on zoom level and importance
function shouldShowMarker(zoomLevel: number, importance: number): boolean {
  // Show all markers when zoomed in closely
  if (zoomLevel >= 15) return true;
  
  // Show only important markers when zoomed out
  if (zoomLevel >= 13 && importance >= 3) return true;
  if (zoomLevel >= 11 && importance >= 4) return true;
  if (zoomLevel < 11 && importance >= 5) return true;
  
  return false;
}

// Helper function to get style based on importance
function getImportanceStyle(importance: number) {
  switch(importance) {
    case 5: return styles.veryHighImportance;
    case 4: return styles.highImportance;
    case 3: return styles.mediumImportance;
    case 2: return styles.lowImportance;
    default: return styles.veryLowImportance;
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: 140,
  },
  pin: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  selectedPin: {
    backgroundColor: '#FF6B6B',
  },
  pinBottom: {
    width: 2,
    height: 8,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  label: {
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    maxWidth: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  labelText: {
    fontSize: 12,
    textAlign: 'center',
  },
  // Importance-based styles
  veryHighImportance: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#FF6B6B',
  },
  highImportance: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderColor: '#FFA06B',
  },
  mediumImportance: {
    // Default size
  },
  lowImportance: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  veryLowImportance: {
    width: 28,
    height: 28,
    borderRadius: 14,
  }
});