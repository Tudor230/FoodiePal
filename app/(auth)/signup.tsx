import React, { useState } from 'react';
import {View, Text, TextInput, Button, StyleSheet, TouchableOpacity} from 'react-native';
import { useAuthContext } from "@/app/context/AuthContext";
import { useRouter } from 'expo-router'

export default function  SignupScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { createAccount } = useAuthContext();
    const router = useRouter();

    const handleSignup = async () => {
        try {
            await createAccount(email, password);
            router.push('./(tabs)')
        } catch (error: any) {
            alert('Signup Failed: '+ error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign up</Text>
            <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                placeholderTextColor="#333"
            />
            <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                secureTextEntry
                placeholderTextColor="#333"
            />
            <TouchableOpacity style={styles.button} onPress={handleSignup}>
                <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.link} onPress={() => router.push('/login')}>
                <Text style={styles.linkText}>Already have an account? Log in </Text>
            </TouchableOpacity>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f7f7f7',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#333',
    },
    input: {
        width: '100%',
        padding: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#ccc',
        backgroundColor: '#fff',
        fontSize: 16,
        color: '#333',
    },
    button: {
        width: '100%',
        padding: 15,
        backgroundColor: '#007BFF',
        alignItems: 'center',
        borderRadius: 5,
    },
    buttonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
    },
    link: {
        marginTop: 20,
    },
    linkText: {
        color: '#007BFF',
        fontSize: 16,
    }
});