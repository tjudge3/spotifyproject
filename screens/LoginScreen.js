import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import { StyleSheet, Text, View, SafeAreaView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import Entypo from '@expo/vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

WebBrowser.maybeCompleteAuthSession();

// Spotify Authorization Discovery Endpoints
const discovery = {
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
};

const LoginScreen = () => {
  const navigation = useNavigation();

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: '76543b3610be4b76ae54eb5a60571607',
      scopes: [
        'user-read-email',
        'user-library-read',
        'user-read-recently-played',
        'user-top-read',
        'user-read-playback-position',
        'user-read-currently-playing',
        'playlist-read-private',
        'playlist-read-collaborative',
        'playlist-modify-public',
      ],
      redirectUri: makeRedirectUri({
        scheme: 'myapp',
      }),
    },
    discovery
  );

  useEffect(() => {
    // Handle response from Spotify
    const handleResponse = async () => {
      if (response?.type === 'success') {
        const { access_token, expires_in } = response.params;

        // Save token and expiration date to AsyncStorage
        const expirationDate = Date.now() + expires_in * 1000;
        await AsyncStorage.setItem('token', access_token);
        await AsyncStorage.setItem('expirationDate', expirationDate.toString());

        // Navigate to the main screen
        navigation.navigate('Main');
      }
    };
    handleResponse();
  }, [response]);

  useEffect(() => {
    // Check token validity on mount
    const checkTokenValidity = async () => {
      const accessToken = await AsyncStorage.getItem('token');
      const expirationDate = await AsyncStorage.getItem('expirationDate');
      console.log('Access token: ', accessToken);
      console.log('Expiration Date: ', expirationDate);

      if (accessToken && expirationDate) {
        const currentTime = Date.now();
        if (currentTime < parseInt(expirationDate)) {
          // Token is valid
          navigation.replace('Main');
        } else {
          // Token expired
          await AsyncStorage.removeItem('token');
          await AsyncStorage.removeItem('expirationDate');
        }
      }
    };
    checkTokenValidity();
  }, []);

  return (
    <LinearGradient colors={['#231640', '#2c1b50']} style={{ flex: 1 }}>
      <SafeAreaView>
        <View style={{ height: 80 }} />
        <Entypo
          style={{ textAlign: 'center' }}
          name="spotify"
          size={80}
          color="#1DB954"
        />
        <Text
          style={{
            color: 'white',
            fontSize: 40,
            fontWeight: 'bold',
            textAlign: 'center',
            marginTop: 40,
          }}
        >
          TuneTags
        </Text>

        <View style={{ height: 80 }} />
        <Pressable
          onPress={() => {
            promptAsync();
          }}
          style={{
            backgroundColor: '#1DB954',
            padding: 10,
            marginLeft: 'auto',
            marginRight: 'auto',
            width: 300,
            borderRadius: 25,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          disabled={!request}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Sign in with Spotify</Text>
        </Pressable>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});
