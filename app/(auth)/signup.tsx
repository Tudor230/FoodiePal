import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { useAuthContext } from "@/app/context/AuthContext";
import { useRouter } from 'expo-router'
import { BlurHashBackground } from "@/components/BlurHashBackground";

export default function SignupScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { createAccount } = useAuthContext();
    const router = useRouter();

    const handleSignup = async () => {
        try {
            await createAccount(email, password);
            router.replace('./(tabs)')
        } catch (error: any) {
            alert('Signup Failed: ' + error.message);
        }
    };

    return (
        <BlurHashBackground
        >
            <View style={styles.overlay}>
                <Text style={styles.title}>Create Account</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Email"
                        placeholderTextColor="#rgba(255,255,255,0.7)"
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Password"
                        secureTextEntry
                        placeholderTextColor="#rgba(255,255,255,0.7)"
                    />
                </View>

                <TouchableOpacity style={styles.button} onPress={handleSignup}>
                    <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.link} onPress={() => router.dismissTo('/login')}>
                    <Text style={styles.linkText}>Already have an account? Log in</Text>
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
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 40,
    },
    inputContainer: {
        width: '100%',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        padding: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderRadius: 25,
        borderColor: 'rgba(255,255,255,0.3)',
        backgroundColor: 'rgba(255,255,255,0.1)',
        fontSize: 16,
        color: '#fff',
        paddingHorizontal: 25,
    },
    button: {
        width: '100%',
        backgroundColor: '#FF6B6B',
        padding: 15,
        borderRadius: 25,
        alignItems: 'center',
        marginBottom: 20,
        elevation: 3,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    link: {
        marginTop: 10,
    },
    linkText: {
        color: '#fff',
        fontSize: 16,
        textDecorationLine: 'underline',
    },
});