import React, { useState } from 'react';
import { StyleSheet, ImageBackground, View } from 'react-native';
import { BlurView } from 'expo-blur';

export function BlurHashBackground({ children }: { children: React.ReactNode }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <View style={styles.container}>
      {!imageLoaded && (
        <BlurView
          intensity={80}
          tint="dark"
          style={StyleSheet.absoluteFill}
        />
      )}
      <ImageBackground
        source={require('@/assets/images/auth_background.jpg')}
        style={styles.image}
        onLoad={() => setImageLoaded(true)}
      >
        {children}
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    width: '100%',
  },
});