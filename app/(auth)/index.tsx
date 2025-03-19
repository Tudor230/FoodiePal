import React, {useEffect} from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import { useRouter } from "expo-router";
import { useAuthContext } from "@/app/context/AuthContext";

export default function Auth() {
    const router = useRouter();
    const { user } = useAuthContext();
    useEffect(() => {
        if (user) {
            router.push('../(tabs)')
        }
    }, [user])
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to Our Platform</Text>
            <Button title="Join Now" onPress={() => router.push('/login')} />
        </View>
    );

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
});