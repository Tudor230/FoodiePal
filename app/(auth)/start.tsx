import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
import { useRouter } from "expo-router";
import { useAuthContext } from "@/app/context/AuthContext";
import { BlurHashBackground } from '@/components/BlurHashBackground';

export default function Auth() {
    const router = useRouter();
    const { user } = useAuthContext();
    
    // useEffect(() => {
    //     if (user) {
    //         router.replace('../(tabs)');
    //     }
    // }, [user]);


    return (
        <BlurHashBackground>
            <View style={styles.overlay}>
                <Text style={styles.title}>FoodiePal</Text>
                <Text style={styles.subtitle}>Discover Great Places to Eat</Text>
                <Text style={styles.description}>
                    Find local restaurants, see where your friends are dining, and share your favorite spots
                </Text>
                
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={() => router.replace('/login')}
                >
                    <Text style={styles.buttonText}>Get Started</Text>
                </TouchableOpacity>
            </View>
        </BlurHashBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 42,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 24,
        color: '#fff',
        marginBottom: 20,
    },
    description: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
        marginBottom: 40,
        paddingHorizontal: 20,
    },
    button: {
        backgroundColor: '#FF6B6B',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 25,
        elevation: 3,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});