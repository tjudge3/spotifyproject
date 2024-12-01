import { StyleSheet, Text, View, SafeAreaView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import Entypo from '@expo/vector-icons/Entypo';
import * as AppAuth from 'expo-app-auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    // Check if the token is valid or expired on component mount
    const checkTokenValidity = async () => {
      try {
        const accessToken = await AsyncStorage.getItem('token');
        const expirationDate = await AsyncStorage.getItem('expirationDate');
        console.log('Access token:', accessToken);
        console.log('Expiration Date:', expirationDate);

        if (accessToken && expirationDate) {
          const currentTime = Date.now();
          console.log('Current time:', currentTime);
          console.log('Expiration time:', parseInt(expirationDate));

          if (currentTime < parseInt(expirationDate)) {
            console.log('Token is valid, navigating to Main...');
            navigation.replace('Main');
          } else {
            console.log('Token is expired, clearing AsyncStorage...');
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('expirationDate');
          }
        } else {
          console.log('No token or expiration date found in AsyncStorage.');
        }
      } catch (error) {
        console.error('Error checking token validity:', error.message);
      }
    };

    checkTokenValidity();
  }, []);

  async function authenticate() {
    console.log('Authenticate function triggered'); // Debugging log
    try {
      const config = {
        issuer: 'https://accounts.spotify.com',
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
          'playlist-modify-public', // or 'playlist-modify-private'
        ],
        redirectUrl: 'myapp://spotify-auth-callback',
      };
      console.log('Authentication config:', config);

      const result = await AppAuth.authAsync(config);
      console.log('Authentication result:', result);

      if (result.accessToken) {
        console.log('Access token retrieved:', result.accessToken);
        const expirationDate = new Date(result.accessTokenExpirationDate).getTime();
        await AsyncStorage.setItem('token', result.accessToken);
        await AsyncStorage.setItem('expirationDate', expirationDate.toString());
        console.log('Token and expiration date saved in AsyncStorage');
        navigation.navigate('Main');
      }
    } catch (error) {
      console.error('Authentication failed:', error.message, error.stack);
    }
  }

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
            console.log('Button Pressed'); // Debugging log
            authenticate();
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
        >
          <Text style={{ color: 'white' }}>Sign in with Spotify</Text>
        </Pressable>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});
