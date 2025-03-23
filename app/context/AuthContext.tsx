import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import {onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} from 'firebase/auth';
import { auth } from "@/firebaseConfig";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useRouter} from "expo-router";

type User = {
    id: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    createAccount: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider(props: { children: ReactNode }){
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {

        const loadUserFromStorage = async () => {
            try {
                const storedUser = await AsyncStorage.getItem('user');
                if (storedUser) {
                    const parsedUser = JSON.parse(storedUser);
                    setUser(parsedUser);
                }
            } catch (error) {
                console.log("Error loading user from AsyncStorage", error);
            } finally {
                setLoading(false);
            }
        };

        loadUserFromStorage();

        const subscriber = onAuthStateChanged(auth, (user) => {
            console.log("User changed: ", user);
            if (user) {
                const userData = {
                    id: user.uid,
                    email: user.email || ''
                };
                AsyncStorage.setItem('user', JSON.stringify(userData))
                setUser(userData);
            } else {
                setUser(null);
                AsyncStorage.removeItem('user')
            }
        })
        return () => subscriber();
    }, []);

    const signup = async (email: string, password: string) => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.log("Signup Error:", error);
            throw error;
        }
    }

    const login = async (email: string, password: string) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.log("Login Error:", error);
            throw error;
        }
    }

    const logout = async () => {
        try {
            await signOut(auth);
            router.dismissTo('/(auth)/start')
        } catch (error) {
            console.log("Logout Error:", error);
            throw error;
        }
    }
    return (
        <AuthContext.Provider value = {{user, loading, signIn: login, signOut: logout, createAccount: signup}}>
            {props.children}
        </AuthContext.Provider>
    )
}

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
}


